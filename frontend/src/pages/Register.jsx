import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileBadge,
  Lock,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { authJourneyContent, useAuth } from "@/lib/AuthContext";
import { appClient } from "@/api/appClient";
import { backendPlaces } from "@/api/backendClient";
import { getDefaultDashboardRoute } from "@/lib/dashboard-config";

const journeyOptions = [
  { key: "individual", icon: Newspaper, title: "Individual reader" },
  { key: "business", icon: Building2, title: "Company account" },
];

const roleForJourney = {
  individual: "reader",
  business: "business",
};

const normalizeJourney = (value) =>
  value === "business" ? "business" : "individual";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkUserAuth } = useAuth();

  const query = new URLSearchParams(location.search);
  const [journeyKey, setJourneyKey] = useState(
    normalizeJourney(query.get("journey")),
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    companyName: "",
    licenseDocument: "",
    licenseFileName: "",
    contactPhone: "",
    deliveryAddress: "",
    deliveryRegion: "",
    deliveryLocationName: "",
    geoapifyPlaceId: "",
    deliveryLatitude: null,
    deliveryLongitude: null,
    consent: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autocomplete for delivery address (business journey)
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const addressInputRef = useRef(null);
  const addressSuggestionsRef = useRef(null);

  const debouncedAddressSearch = useCallback(
    (() => {
      let timeoutId;
      let requestSequence = 0;
      return (text) => {
        const sequence = ++requestSequence;
        clearTimeout(timeoutId);
        if (!text || text.length < 2) {
          setAddressSuggestions([]);
          setShowAddressSuggestions(false);
          return;
        }
        timeoutId = setTimeout(async () => {
          try {
            const features = await backendPlaces.autocomplete(text);
            if (sequence === requestSequence) {
              setAddressSuggestions(features);
              setShowAddressSuggestions(features.length > 0);
            }
          } catch {
            if (sequence === requestSequence) {
              setAddressSuggestions([]);
              setShowAddressSuggestions(false);
            }
          }
        }, 300);
      };
    })(),
    []
  );

  const handleAddressInput = (event) => {
    const value = event.target.value;
    setForm((current) => ({
      ...current,
      deliveryAddress: value,
      deliveryRegion: "",
      deliveryLocationName: "",
      geoapifyPlaceId: "",
      deliveryLatitude: null,
      deliveryLongitude: null,
    }));
    if (error) setError("");
    if (value && value.length >= 2) {
      debouncedAddressSearch(value);
    } else {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
    }
  };

  const selectAddress = (feature) => {
    const props = feature.properties || {};
    const name = props.name || props.address_line1 || "";
    const street = props.street || "";
    const postcode = props.postcode || "";
    const city = props.city || props.state || "";
    const country = props.country || "";

    // Keep the human-readable address and the Geoapify delivery reference.
    const parts = [name, street, [postcode, city].filter(Boolean).join(" "), country]
      .filter(Boolean);
    const formatted = props.formatted || parts.join(", ");
    const [longitude, latitude] = feature.geometry?.coordinates || [];

    setForm((current) => ({
      ...current,
      deliveryAddress: formatted,
      deliveryRegion: [city, country].filter(Boolean).join(", "),
      deliveryLocationName: name || city || current.companyName || "Primary delivery site",
      geoapifyPlaceId: props.place_id || "",
      deliveryLatitude: Number.isFinite(latitude) ? latitude : null,
      deliveryLongitude: Number.isFinite(longitude) ? longitude : null,
    }));
    setAddressSuggestions([]);
    setShowAddressSuggestions(false);
  };

  // Close address suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target) &&
        addressSuggestionsRef.current &&
        !addressSuggestionsRef.current.contains(event.target)
      ) {
        setShowAddressSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (query.get("journey") === "admin") {
    return <Navigate to="/login?journey=admin" replace />;
  }

  const isBusinessJourney = journeyKey === "business";
  const journey = authJourneyContent[journeyKey] || authJourneyContent.individual;
  const activeOption =
    journeyOptions.find((option) => option.key === journeyKey) ||
    journeyOptions[0];

  const updateField = (field) => (event) => {
    const nextValue = event.currentTarget.value;
    setForm((current) => ({ ...current, [field]: nextValue }));
    if (error) setError("");
  };

  const updateConsent = (event) => {
    const checked = event.currentTarget.checked;
    setForm((current) => ({
      ...current,
      consent: checked,
    }));
    if (error) setError("");
  };

  const selectJourney = (nextJourney) => {
    setJourneyKey(normalizeJourney(nextJourney));
    setError("");
  };

  const handleLicenseUpload = (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    const isAllowed =
      /^(application\/pdf|image\/(png|jpeg|webp))$/.test(file.type) &&
      file.size <= 5 * 1024 * 1024;
    if (!isAllowed) {
      setError(
        "Upload a PDF, PNG, JPG, or WebP business licence smaller than 5 MB.",
      );
      event.currentTarget.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        licenseDocument: String(reader.result || ""),
        licenseFileName: file.name,
      }));
      if (error) setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const email = form.email.trim().toLowerCase();
    if (!form.name.trim() || !email || !form.password || !form.confirm) {
      setError("Fill in every required field to create your account.");
      return;
    }
    if (form.password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (isBusinessJourney && !form.licenseDocument) {
      setError("Attach your business licence to continue.");
      return;
    }
    if (isBusinessJourney && !form.deliveryAddress.trim()) {
      setError("Add the delivery location for your company.");
      return;
    }
    if (!form.consent) {
      setError(
        "Please confirm how we can use your account and delivery information before continuing.",
      );
      return;
    }

    // Close address suggestions on submit
    setAddressSuggestions([]);
    setShowAddressSuggestions(false);

    setError("");
    setIsSubmitting(true);

    try {
      const registeredUser = await appClient.auth.register({
        name: form.name.trim(),
        email,
        password: form.password,
        role: roleForJourney[journeyKey],
        accountType: journeyKey,
        companyName: isBusinessJourney ? form.companyName.trim() : "",
        licenseDocument: isBusinessJourney ? form.licenseDocument : "",
        contactPhone: form.contactPhone.trim(),
        deliveryAddress: form.deliveryAddress.trim(),
        deliveryRegion: isBusinessJourney ? form.deliveryRegion.trim() : "",
        deliveryLocationName: isBusinessJourney
          ? form.deliveryLocationName.trim()
          : "",
        geoapifyPlaceId: isBusinessJourney ? form.geoapifyPlaceId : "",
        deliveryLatitude: isBusinessJourney ? form.deliveryLatitude : null,
        deliveryLongitude: isBusinessJourney ? form.deliveryLongitude : null,
      });

      if ("pendingApproval" in registeredUser && registeredUser.pendingApproval) {
        navigate("/login?journey=business&pending=license", { replace: true });
        return;
      }

      await checkUserAuth();
      navigate(getDefaultDashboardRoute(registeredUser.role), {
        replace: true,
      });
    } catch (registrationError) {
      setError(registrationError.message || "Unable to create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = ({
    id,
    name,
    type = "text",
    value,
    onChange,
    label,
    placeholder,
    icon: Icon,
    autoComplete,
    inputMode = undefined,
    autoCapitalize = "none",
    spellCheck = false,
  }) => (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#4c392b]"
      >
        {label}
      </label>
      <div className="flex w-full items-center rounded-xl border border-[#cfc0af] bg-white transition-colors focus-within:border-[#4A2A08] focus-within:ring-2 focus-within:ring-[#4A2A08]/15">
        <Icon className="ml-4 h-4 w-4 shrink-0 text-[#8b5f32]" />
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
          className="min-h-14 w-full rounded-xl bg-transparent px-3 text-base text-[#2a1b12] outline-none placeholder:text-[#9b8c7d]"
        />
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f4efe6] px-4 py-8 text-[#2a1b12] sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-[#d5c8b8] bg-[#fffdf8] shadow-[0_24px_80px_rgba(42,27,18,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden bg-[#4A2A08] p-10 text-[#fffdf8] lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9b77c]/60 font-display text-2xl font-black text-[#f1d6a5]">
                  ን
                </span>
                <span>
                  <span className="block font-display text-2xl font-black tracking-tight">
                    ንቐደም
                  </span>
                  <span className="block font-sans text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#e7d5bd]">
                    Independent journalism
                  </span>
                </span>
              </Link>
              <div className="mt-24 max-w-md">
                <p className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-[#e0bb7f]">
                  Account setup
                </p>
                <h1 className="mt-4 font-display text-5xl font-black leading-[0.98]">
                  Start your newsroom journey.
                </h1>
                <p className="mt-6 max-w-sm font-body text-base leading-7 text-[#eadfce]">
                  Create a reader account for your personal copy or a company
                  account for bulk deliveries, invoicing, and licence-based
                  access.
                </p>
              </div>
            </div>
            <div className="border-t border-[#d9b77c]/30 pt-6 font-sans text-xs uppercase tracking-[0.18em] text-[#e7d5bd]">
              Independent Journalism Since 2024
            </div>
          </section>

          <section className="p-6 sm:p-10 lg:p-12">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link
                  to="/"
                  className="font-display text-2xl font-black text-[#4A2A08] lg:hidden"
                >
                  ንቐደም
                </Link>
                <p className="mt-6 font-sans text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#8b5f32] lg:mt-0">
                  {journey.eyebrow}
                </p>
                <h2 className="mt-2 font-display text-3xl font-black tracking-tight sm:text-4xl">
                  Create account
                </h2>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d5c8b8] bg-[#f4efe6] text-[#4A2A08]">
                {isBusinessJourney ? (
                  <Building2 className="h-5 w-5" />
                ) : (
                  <Newspaper className="h-5 w-5" />
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {journeyOptions.map((option) => {
                const Icon = option.icon;
                const isActive = option.key === activeOption.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => selectJourney(option.key)}
                    className={`flex min-h-16 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "border-[#4A2A08] bg-[#4A2A08] text-white"
                        : "border-[#d5c8b8] bg-white text-[#5f4c3d] hover:border-[#8b5f32]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="font-sans text-[0.68rem] font-bold uppercase leading-4 tracking-[0.08em]">
                      {option.title}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 font-body text-sm leading-6 text-[#756253]">
              {journey.description}
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              {error ? (
                <div
                  role="alert"
                  className="rounded-xl border border-[#c98d86] bg-[#fff3f1] px-4 py-3 text-sm leading-5 text-[#8b3027]"
                >
                  {error}
                </div>
              ) : null}

              {renderField({
                id: "register-name",
                name: "name",
                value: form.name,
                onChange: updateField("name"),
                label: isBusinessJourney ? "Primary contact" : "Full name",
                placeholder: isBusinessJourney
                  ? "Operations lead name"
                  : "Your full name",
                icon: UserRound,
                autoComplete: "name",
              })}

              {isBusinessJourney ? (
                <>
                  {renderField({
                    id: "register-company",
                    name: "companyName",
                    value: form.companyName,
                    onChange: updateField("companyName"),
                    label: "Company name",
                    placeholder: "Company or organization",
                    icon: Building2,
                    autoComplete: "organization",
                  })}

                  <div>
                    <label
                      htmlFor="register-license"
                      className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#4c392b]"
                    >
                      Business licence
                    </label>
                    <div className="flex w-full items-center rounded-xl border border-[#cfc0af] bg-white px-4 py-3 transition-colors focus-within:border-[#4A2A08] focus-within:ring-2 focus-within:ring-[#4A2A08]/15">
                      <FileBadge className="h-4 w-4 shrink-0 text-[#8b5f32]" />
                      <input
                        id="register-license"
                        name="licenseDocument"
                        type="file"
                        accept="application/pdf,image/png,image/jpeg,image/webp"
                        onChange={handleLicenseUpload}
                        className="w-full min-h-14 bg-transparent text-sm text-[#2a1b12] file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#f4efe6] file:px-3 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.14em] file:text-[#4A2A08] hover:file:bg-[#e9e0d3]"
                      />
                    </div>
                    <p className="mt-2 font-body text-xs text-[#756253]">
                      PDF, PNG, JPG, or WebP · up to 5 MB. An administrator
                      approves your licence before you can sign in.
                    </p>
                    {form.licenseFileName ? (
                      <p className="mt-2 flex items-center gap-2 font-sans text-xs font-semibold text-[#2f6b3c]">
                        <CheckCircle2 className="h-4 w-4" />
                        Ready: {form.licenseFileName}
                      </p>
                    ) : null}
                  </div>
                </>
              ) : null}

              {renderField({
                id: "register-email",
                name: "email",
                type: "email",
                value: form.email,
                onChange: updateField("email"),
                label: "Email address",
                placeholder: isBusinessJourney
                  ? "operations@company.com"
                  : "reader@example.com",
                icon: Mail,
                autoComplete: "username",
                inputMode: "email",
                autoCapitalize: "none",
                spellCheck: false,
              })}

              <div className="grid gap-5 sm:grid-cols-2">
                {renderField({
                  id: "register-phone",
                  name: "contactPhone",
                  type: "tel",
                  value: form.contactPhone,
                  onChange: updateField("contactPhone"),
                  label: "Contact phone",
                  placeholder: "+32 ...",
                  icon: Phone,
                  autoComplete: "tel",
                })}
                {isBusinessJourney ? (
                  <>
                    <div ref={addressInputRef} className="relative">
                      <label
                        htmlFor="register-address"
                        className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#4c392b]"
                      >
                        Delivery location
                      </label>
                      <div className="flex w-full items-center rounded-xl border border-[#cfc0af] bg-white transition-colors focus-within:border-[#4A2A08] focus-within:ring-2 focus-within:ring-[#4A2A08]/15">
                        <MapPin className="ml-4 h-4 w-4 shrink-0 text-[#8b5f32]" />
                        <Search className="absolute left-10 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b8c7d]" />
                        <input
                          id="register-address"
                          name="deliveryAddress"
                          type="text"
                          value={form.deliveryAddress}
                          onChange={handleAddressInput}
                          onFocus={() => addressSuggestions.length > 0 && setShowAddressSuggestions(true)}
                          placeholder="Search for a place..."
                          autoComplete="off"
                          required
                          className="min-h-14 w-full rounded-xl bg-transparent pl-10 pr-4 py-3 text-base text-[#2a1b12] outline-none placeholder:text-[#9b8c7d]"
                        />
                      </div>
                      {showAddressSuggestions && addressSuggestions.length > 0 && (
                        <div
                          ref={addressSuggestionsRef}
                          className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-xl border border-[#cfc0af] bg-white shadow-lg"
                        >
                          {addressSuggestions.map((feature, idx) => (
                            <button
                              key={feature.properties?.place_id || idx}
                              type="button"
                              onClick={() => selectAddress(feature)}
                              className="w-full px-4 py-2 text-left font-sans text-sm text-[#2a1b12] hover:bg-[#f4efe6]"
                            >
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#8b5f32]" />
                                <span>{feature.properties?.name || feature.properties?.formatted}</span>
                              </div>
                              {feature.properties?.city && (
                                <div className="ml-6 font-sans text-xs text-[#756253]">
                                  {feature.properties.city}{" "}
                                  {feature.properties.country &&
                                    `, ${feature.properties.country}`}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  renderField({
                    id: "register-address",
                    name: "deliveryAddress",
                    value: form.deliveryAddress,
                    onChange: updateField("deliveryAddress"),
                    label: "Delivery context",
                    placeholder: "Home or delivery address",
                    icon: MapPin,
                    autoComplete: "street-address",
                  })
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {renderField({
                  id: "register-password",
                  name: "password",
                  type: "password",
                  value: form.password,
                  onChange: updateField("password"),
                  label: "Password",
                  placeholder: "8 or more characters",
                  icon: Lock,
                  autoComplete: "new-password",
                })}
                {renderField({
                  id: "register-confirm",
                  name: "confirm",
                  type: "password",
                  value: form.confirm,
                  onChange: updateField("confirm"),
                  label: "Confirm password",
                  placeholder: "Re-enter your password",
                  icon: ShieldCheck,
                  autoComplete: "new-password",
                })}
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e2d7ca] bg-[#faf6ef] p-4">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={updateConsent}
                  className="mt-1 h-4 w-4 accent-[#4A2A08]"
                />
                <span className="font-body text-sm leading-5 text-[#3a2b1f]">
                  I agree that my contact and delivery information can be used
                  for account setup, shipment routing, and account support, as
                  described in the{" "}
                  <Link
                    to="/privacy"
                    className="font-semibold text-[#4A2A08] underline underline-offset-2 hover:text-[#2a1b12]"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and under the{" "}
                  <Link
                    to="/terms"
                    className="font-semibold text-[#4A2A08] underline underline-offset-2 hover:text-[#2a1b12]"
                  >
                    Terms of Service
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4A2A08] px-6 font-sans text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#2a1b12] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
                {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>

            <div className="mt-8 grid gap-2 rounded-xl border border-[#e2d7ca] bg-[#faf6ef] p-4 text-sm text-[#756253]">
              <p className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#4A2A08]">
                <CheckCircle2 className="h-4 w-4" />
                Why register
              </p>
              <p>
                Reader accounts get a personal workspace; company accounts
                order in bulk once an administrator approves the business
                licence.
              </p>
            </div>

            <p className="mt-6 text-center text-sm text-[#756253]">
              Already have an account?{" "}
              <Link
                to={`/login?journey=${journeyKey}`}
                className="font-bold text-[#4A2A08] hover:underline"
              >
                Sign in
              </Link>
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[#e2d7ca] pt-5 font-sans text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#9b8c7d]">
              <Link to="/terms" className="transition-colors hover:text-[#4A2A08]">
                Terms of Service
              </Link>
              <Link
                to="/privacy"
                className="transition-colors hover:text-[#4A2A08]"
              >
                Privacy Policy
              </Link>
              <Link to="/cookies" className="transition-colors hover:text-[#4A2A08]">
                Cookies Policy
              </Link>
              <Link to="/refund" className="transition-colors hover:text-[#4A2A08]">
                Refund Policy
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
