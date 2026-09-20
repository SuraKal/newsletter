import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Package, Search, Truck } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import DeliveryStatusHero from "@/components/delivery/DeliveryStatusHero";
import DeliveryTimelinePanel from "@/components/delivery/DeliveryTimelinePanel";
import {
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardPanel,
} from "@/components/dashboard/DashboardPrimitives";
import { useAuth } from "@/lib/AuthContext";
import { useReaderOverview } from "@/lib/use-reader-overview";
import {
  useReaderDeliveries,
  useReaderDeliveryDetail,
} from "@/lib/use-reader-deliveries";
import {
  DELIVERY_SAMPLE_CODES,
  getCurrentDelivery,
  getDeliveryByTrackingCode,
  isValidTrackingCode,
  normalizeTrackingCode,
} from "@/lib/delivery-store";

const deliveryIconMap = {
  Clock: Package,
  Package,
  Truck,
};

export default function Delivery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { current: currentDelivery } = useReaderDeliveries();
  const requestedCode =
    searchParams.get("trackingId") ||
    currentDelivery?.trackingId ||
    getCurrentDelivery().trackingId;
  const [inputValue, setInputValue] = useState(requestedCode);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const isReaderSession = Boolean(user && user.role === "reader");
  const subscription = useReaderOverview(user?.email);
  const deliveryDetail = useReaderDeliveryDetail(requestedCode);

  const delivery = useMemo(
    () =>
      isReaderSession
        ? (deliveryDetail?.delivery || null)
        : getDeliveryByTrackingCode(requestedCode),
    [isReaderSession, deliveryDetail, requestedCode],
  );
  const timeline =
    (isReaderSession
      ? deliveryDetail?.timeline
      : delivery?.timeline) || [];

  const isCurrentEdition = Boolean(
    delivery && currentDelivery && delivery.trackingId === currentDelivery.trackingId,
  );
  const hasMatchedSession = Boolean(subscription?.session) || isReaderSession;
  const isPrintSubscriber = hasMatchedSession && subscription?.isPrintSubscriber;

  const hero = delivery
    ? {
        edition: delivery.edition,
        trackingId: delivery.trackingId,
        status:
          isCurrentEdition && hasMatchedSession && !isPrintSubscriber
            ? "No print route"
            : delivery.status,
        tone:
          isCurrentEdition && hasMatchedSession && !isPrintSubscriber
            ? "neutral"
            : delivery.tone,
        destination: hasMatchedSession
          ? subscription.locationSummary
          : delivery.destination,
        eta: delivery.eta,
        note:
          isCurrentEdition && hasMatchedSession && !isPrintSubscriber
            ? "Your current plan does not schedule physical newspaper drops yet."
            : hasMatchedSession && isPrintSubscriber
              ? "The next print cycle is scheduled for your saved delivery profile."
              : delivery.note,
      }
    : null;

  const timelineItems = timeline.map((item, index) => ({
    ...item,
    icon:
      deliveryIconMap[item.icon] ||
      (index === 0
        ? Package
        : index === timeline.length - 1
          ? Truck
          : Package),
  }));

  const updateTracking = (nextCode) => {
    const cleanCode = normalizeTrackingCode(nextCode);
    setInputValue(cleanCode);

    if (!cleanCode) {
      setError("Enter a tracking ID to follow a delivery.");
      return;
    }

    if (!isValidTrackingCode(cleanCode)) {
      setError(`The tracking ID format looks off. Try ${DELIVERY_SAMPLE_CODES[0]}.`);
      return;
    }

    if (!isReaderSession && !getDeliveryByTrackingCode(cleanCode)) {
      setError(`No shipment found for ${cleanCode} yet. Please check the ID and try again.`);
      return;
    }

    setError("");
    setSearchParams({ trackingId: cleanCode }, { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTracking(inputValue);
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <DashboardPageHeader
          eyebrow="Delivery tracking"
          title="Track your delivery"
          action={
            <Link
              to="/dashboard/deliveries"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
            >
              My deliveries
              <Truck className="h-4 w-4" />
            </Link>
          }
        />

        <section className="mt-6">
          <DashboardPanel
            title="Track a delivery"
            description="Enter your tracking ID."
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <label htmlFor="tracking-code" className="sr-only">
                Tracking ID
              </label>
              <input
                id="tracking-code"
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder={`e.g. ${DELIVERY_SAMPLE_CODES[0]}`}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 font-sans text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 sm:max-w-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
              >
                <Search className="h-4 w-4" />
                Track shipment
              </button>
            </form>
            {error ? (
              <p className="mt-3 font-sans text-xs font-medium text-red-600">
                {error}
              </p>
            ) : null}
          </DashboardPanel>
        </section>

        {delivery && hero ? (
          <>
            <section className="mt-6">
              <DeliveryStatusHero
                edition={hero.edition}
                trackingId={hero.trackingId}
                status={hero.status}
                tone={hero.tone}
                destination={hero.destination}
                eta={hero.eta}
                note={hero.note}
              />
            </section>

            <section className="mt-6">
              <DeliveryTimelinePanel
                title="Route progress"
                items={timelineItems}
              />
            </section>
          </>
        ) : (
          <section className="mt-6">
            <DashboardPanel title="Tracking lookup" className="p-0">
              <DashboardEmptyState
                title="No shipment found"
                description={`We could not find a delivery for ${requestedCode}. Double-check the tracking ID or clear the lookup to return to the current edition.`}
                action={
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setInputValue(
                        currentDelivery?.trackingId ||
                          getCurrentDelivery().trackingId,
                      );
                      setSearchParams({});
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
                  >
                    Clear tracking
                  </button>
                }
              />
            </DashboardPanel>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}