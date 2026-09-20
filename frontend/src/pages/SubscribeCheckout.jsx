import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  Lock,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import ReaderPlanPicker from "@/components/forms/ReaderPlanPicker";
import SubscriptionOrderSummary from "@/components/forms/SubscriptionOrderSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appClient } from "@/api/appClient";
import { useAuth } from "@/lib/AuthContext";
import {
  cardBrandFor,
  formatCardNumber,
  formatCvc,
  formatExpiry,
  isExpiryValid,
  isLuhnValid,
} from "@/lib/card-utils";
import {
  getReaderPlans,
  getSubscriptionQuote,
  useSubscriptionPlans,
} from "@/lib/subscription-catalog";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const METHOD_ICONS = {
  card: CreditCard,
  paypal: Wallet,
};

const splitExpiry = (value) => {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) {
    return { month: digits, year: "" };
  }
  return { month: digits.slice(0, 2), year: digits.slice(2) };
};

const fieldClass = (hasError) =>
  hasError
    ? "h-11 rounded-xl border-red-300 bg-red-50/40 focus-visible:ring-red-200"
    : "h-11 rounded-xl";

export default function SubscribeCheckout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const subscriptionPlans = useSubscriptionPlans();
  const readerCheckoutPlans = useMemo(
    () => getReaderPlans(subscriptionPlans),
    [subscriptionPlans],
  );
  const requestedPlan = searchParams.get("plan");
  const requestedBilling = searchParams.get("billing");
  const fallbackPlan =
    readerCheckoutPlans.find((plan) => plan.highlighted)?.id ||
    readerCheckoutPlans[0]?.id;
  const [planId, setPlanId] = useState(
    readerCheckoutPlans.some((plan) => plan.id === requestedPlan)
      ? requestedPlan
      : fallbackPlan,
  );
  const [billingCycle, setBillingCycle] = useState(
    requestedBilling === "yearly" ? "yearly" : "monthly",
  );
  const [paymentMethodId, setPaymentMethodId] = useState("card");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Record<string, boolean>} */ ({}),
  );
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    country: "Belgium",
    cardholderName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    paypalEmail: "",
    consentRecurring: false,
    consentDelivery: false,
    newsletterOptIn: false,
  });

  const selectedPlan = useMemo(
    () => readerCheckoutPlans.find((plan) => plan.id === planId) || readerCheckoutPlans[0],
    [planId, readerCheckoutPlans],
  );

  const selectedPaymentMethod = useMemo(
    () =>
      paymentMethods.find((method) => method.id === paymentMethodId) ||
      paymentMethods[0] ||
      null,
    [paymentMethodId, paymentMethods],
  );

  const quote = useMemo(
    () => getSubscriptionQuote(selectedPlan, billingCycle),
    [billingCycle, selectedPlan],
  );

  useEffect(() => {
    if (!readerCheckoutPlans.some((plan) => plan.id === planId)) {
      setPlanId(
        readerCheckoutPlans.find((plan) => plan.highlighted)?.id ||
          readerCheckoutPlans[0]?.id,
      );
    }
  }, [planId, readerCheckoutPlans]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("plan", planId);
    nextParams.set("billing", billingCycle);
    setSearchParams(nextParams, { replace: true });
  }, [billingCycle, planId, searchParams, setSearchParams]);

  useEffect(() => {
    let cancelled = false;
    appClient.checkout
      .availableMethods()
      .then((methods) => {
        if (!cancelled && Array.isArray(methods) && methods.length) {
          setPaymentMethods(methods);
        }
      })
      .catch(() => {
        // Fallback ordered response from the offline default stays "card".
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm((current) => ({
      ...current,
      fullName: current.fullName || user.name || "",
      email: current.email || user.email || "",
      phone: current.phone || user.contactPhone || "",
      streetAddress: current.streetAddress || user.deliveryAddress || "",
      paypalEmail: current.paypalEmail || user.email || "",
    }));
  }, [user]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: false }));
    }
  };

  const paymentMethodLabel = selectedPaymentMethod?.label || "Card";
  const showCard = paymentMethodId === "card" || !selectedPaymentMethod;
  const cardBrand = cardBrandFor(form.cardNumber);
  const hasCardDigits = String(form.cardNumber || "").replace(/\D/g, "").length > 0;

  const validateContact = () => {
    if (!form.fullName) {
      return "Full name is required.";
    }
    if (!EMAIL_PATTERN.test(form.email)) {
      return "A valid contact email is required.";
    }
    if (!form.phone) {
      return "A contact phone is required for delivery coordination.";
    }
    return "";
  };

  const validateAddress = () => {
    if (!form.streetAddress || !form.city || !form.postalCode || !form.country) {
      return "Please provide the full delivery address before continuing.";
    }
    return "";
  };

  const collectCardErrors = () => {
    /** @type {Record<string, boolean>} */
    const errors = {};
    const number = String(form.cardNumber || "").replace(/\D/g, "");
    const { month, year } = splitExpiry(form.cardExpiry);
    if (!form.cardholderName.trim()) {
      errors.cardholderName = true;
    }
    if (number.length < 13 || !isLuhnValid(number)) {
      errors.cardNumber = true;
    }
    if (String(form.cardCvc || "").length < 3) {
      errors.cardCvc = true;
    }
    if (!isExpiryValid(month, year)) {
      errors.cardExpiry = true;
    }
    return errors;
  };

  const validateConsents = () => {
    if (!form.consentRecurring || !form.consentDelivery) {
      return "Please accept the recurring billing and delivery-data consent statements.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (paymentMethodId === "paypal") {
      if (!EMAIL_PATTERN.test(form.paypalEmail)) {
        setError("A valid PayPal account email is required.");
        return;
      }
    } else {
      const cardErrors = collectCardErrors();
      if (Object.keys(cardErrors).length) {
        setFieldErrors(cardErrors);
        setError("Please correct the highlighted payment details.");
        return;
      }
    }

    const validationMessage =
      validateContact() || validateAddress() || validateConsents();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const customer = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        streetAddress: form.streetAddress.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
      };
      const consents = {
        recurringBilling: form.consentRecurring,
        deliverySharing: form.consentDelivery,
        newsletterOptIn: form.newsletterOptIn,
      };

      const session = await appClient.checkout.create({
        planId: selectedPlan.id,
        billingCycle,
        paymentMethod: paymentMethodId,
        plan: selectedPlan,
        customer,
        consents,
      });

      if (paymentMethodId === "paypal") {
        await appClient.checkout.confirm(session.id, {
          paypalEmail: form.paypalEmail.trim(),
        });
      } else {
        const { month, year } = splitExpiry(form.cardExpiry);
        await appClient.checkout.confirm(session.id, {
          card: {
            name: form.cardholderName.trim(),
            number: String(form.cardNumber).replace(/\D/g, ""),
            expMonth: Number(month),
            expYear: Number(year),
            cvc: form.cardCvc.trim(),
          },
        });
      }

      navigate(`/subscribe/success?session=${session.id}`, { replace: true });
    } catch (err) {
      const message =
        err?.message || "The checkout could not be completed. Please try again.";
      if (message && !/authentication|401/i.test(message)) {
        setError(message);
      } else {
        setError("The checkout could not be completed. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(circle_at_top,_rgba(72,60,50,0.1),_transparent_62%)]" />
        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <section className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                      Step 1
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-black text-ink">
                      Payment details
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-sans text-[0.62rem] font-bold uppercase tracking-[0.16em] text-emerald-700">
                    <Lock className="h-3 w-3" />
                    Secure
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {(
                    paymentMethods.length
                      ? paymentMethods
                      : [{ id: "card", label: "Card" }]
                  ).map((method) => {
                    const Icon = METHOD_ICONS[method.id] || CreditCard;
                    const isActive = method.id === paymentMethodId;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          setPaymentMethodId(method.id);
                          setFieldErrors({});
                          setError("");
                        }}
                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.16em] transition ${
                          isActive
                            ? "border-heritage bg-heritage text-paper shadow-[0_10px_24px_rgba(72,60,50,0.18)]"
                            : "border-stone-300/70 bg-paper text-ink hover:border-heritage/60"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {method.label}
                      </button>
                    );
                  })}
                </div>

                {selectedPaymentMethod?.detail ? (
                  <p className="mt-3 font-body text-xs leading-5 text-redacted">
                    {selectedPaymentMethod.detail}
                  </p>
                ) : null}

                <div className="mt-6 rounded-2xl border border-stone-300/60 bg-vellum/40 p-5">
                  {showCard ? (
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardholderName">Cardholder name</Label>
                        <Input
                          id="cardholderName"
                          autoComplete="cc-name"
                          value={form.cardholderName}
                          onChange={(e) =>
                            updateField("cardholderName", e.target.value)
                          }
                          placeholder="Name as shown on card"
                          className={fieldClass(fieldErrors.cardholderName)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card number</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            value={form.cardNumber}
                            placeholder="1234 1234 1234 1234"
                            onChange={(e) =>
                              updateField(
                                "cardNumber",
                                formatCardNumber(e.target.value),
                              )
                            }
                            className={`${fieldClass(fieldErrors.cardNumber)} pr-20`}
                          />
                          {hasCardDigits ? (
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-stone-300/70 bg-paper px-2 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.12em] text-ink">
                              {cardBrand}
                            </span>
                          ) : (
                            <CreditCard className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Expiry</Label>
                          <Input
                            id="cardExpiry"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            value={form.cardExpiry}
                            placeholder="MM/YY"
                            onChange={(e) =>
                              updateField("cardExpiry", formatExpiry(e.target.value))
                            }
                            className={fieldClass(fieldErrors.cardExpiry)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input
                            id="cardCvc"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            value={form.cardCvc}
                            placeholder="123"
                            onChange={(e) =>
                              updateField("cardCvc", formatCvc(e.target.value))
                            }
                            className={fieldClass(fieldErrors.cardCvc)}
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 rounded-xl border border-stone-300/60 bg-paper px-4 py-3">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-heritage" />
                        <p className="font-body text-xs leading-5 text-redacted">
                          Your card is encrypted and tokenized by our payment
                          provider. We never store your card number or CVC.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="paypalEmail">PayPal account email</Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        autoComplete="email"
                        value={form.paypalEmail}
                        onChange={(e) => updateField("paypalEmail", e.target.value)}
                        placeholder="wallet@example.com"
                        className="h-11 rounded-xl"
                      />
                      <p className="font-body text-xs leading-5 text-redacted">
                        You will be redirected to PayPal to approve the recurring
                        billing after review.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                  Step 2
                </p>
                <h2 className="mt-2 font-display text-2xl font-black text-ink">
                  Plan and billing
                </h2>

                <div className="mt-6">
                  <ReaderPlanPicker
                    plans={readerCheckoutPlans}
                    selectedPlanId={planId}
                    billingCycle={billingCycle}
                    onPlanChange={setPlanId}
                    onBillingChange={setBillingCycle}
                  />
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                  Step 3
                </p>
                <h2 className="mt-2 font-display text-2xl font-black text-ink">
                  Contact information
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      autoComplete="name"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      placeholder="Subscriber name"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="reader@example.com"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+32 ..."
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                  Step 4
                </p>
                <h2 className="mt-2 font-display text-2xl font-black text-ink">
                  Delivery address
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="streetAddress">Street address</Label>
                    <Input
                      id="streetAddress"
                      autoComplete="street-address"
                      value={form.streetAddress}
                      onChange={(e) => updateField("streetAddress", e.target.value)}
                      placeholder="Street, building, apartment, or office"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="Brussels"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal code</Label>
                    <Input
                      id="postalCode"
                      autoComplete="postal-code"
                      value={form.postalCode}
                      onChange={(e) => updateField("postalCode", e.target.value)}
                      placeholder="1000"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      autoComplete="country-name"
                      value={form.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      placeholder="Belgium"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                  Step 5
                </p>
                <h2 className="mt-2 font-display text-2xl font-black text-ink">
                  Confirm and complete
                </h2>

                <div className="mt-5 space-y-4 rounded-[1.2rem] border border-stone-300/50 bg-vellum/45 p-5">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.consentRecurring}
                      onChange={(e) =>
                        updateField("consentRecurring", e.target.checked)
                      }
                      className="mt-1 accent-heritage"
                    />
                    <span className="font-body text-sm leading-6 text-ink">
                      I understand this is a recurring subscription billed {billingCycle === "yearly" ? "yearly" : "monthly"} until it is cancelled under the{" "}
                      <Link
                        to="/terms"
                        className="font-semibold text-heritage underline underline-offset-2 hover:opacity-80"
                      >
                        plan terms
                      </Link>
                      .
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.consentDelivery}
                      onChange={(e) =>
                        updateField("consentDelivery", e.target.checked)
                      }
                      className="mt-1 accent-heritage"
                    />
                    <span className="font-body text-sm leading-6 text-ink">
                      I agree that my contact and address information may be used for billing, delivery coordination, and logistics handoff as described in the{" "}
                      <Link
                        to="/privacy"
                        className="font-semibold text-heritage underline underline-offset-2 hover:opacity-80"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.newsletterOptIn}
                      onChange={(e) =>
                        updateField("newsletterOptIn", e.target.checked)
                      }
                      className="mt-1 accent-heritage"
                    />
                    <span className="font-body text-sm leading-6 text-ink">
                      Send me editorial product updates and subscriber news.
                    </span>
                  </label>
                </div>
              </section>
            </div>

            <div className="lg:sticky lg:top-6 lg:self-start">
              <SubscriptionOrderSummary
                plan={selectedPlan}
                billingCycle={billingCycle}
                quote={quote}
                paymentMethodLabel={paymentMethodLabel}
              />

              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-2xl bg-heritage px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-paper hover:bg-ink"
                >
                  {isSubmitting
                    ? "Processing payment..."
                    : `Pay €${Number(quote?.amount || 0).toFixed(2)}`}
                  {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/subscriptions")}
                  className="h-12 w-full rounded-2xl border-2 border-ink px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink"
                >
                  Back to plans
                </Button>

                <p className="flex flex-wrap justify-center gap-x-4 gap-y-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.16em] text-stone-400 lg:justify-start">
                  <Link to="/terms" className="transition-colors hover:text-heritage">
                    Terms
                  </Link>
                  <Link
                    to="/privacy"
                    className="transition-colors hover:text-heritage"
                  >
                    Privacy
                  </Link>
                  <Link to="/cookies" className="transition-colors hover:text-heritage">
                    Cookies
                  </Link>
                  <Link to="/refund" className="transition-colors hover:text-heritage">
                    Refund
                  </Link>
                </p>
              </div>

              <p className="mt-4 flex items-center justify-center gap-2 font-body text-xs leading-5 text-redacted">
                <Lock className="h-3.5 w-3.5" />
                Secure checkout · Payments processed by a PCI-compliant provider.
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}