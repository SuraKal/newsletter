import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ReaderProfileForm({
  form,
  onChange,
  onSubmit,
  isSaving,
  error,
  successMessage,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error ? (
        <div
          role="alert"
          className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profile-name">Full name</Label>
          <Input
            id="profile-name"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Subscriber name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            value={form.email}
            readOnly
            disabled
            placeholder="reader@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-phone">Contact phone</Label>
          <Input
            id="profile-phone"
            value={form.contactPhone}
            onChange={(e) => onChange("contactPhone", e.target.value)}
            placeholder="+32 ..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-country">Country</Label>
          <Input
            id="profile-country"
            value={form.country}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="Belgium"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="profile-address">Delivery address</Label>
          <Input
            id="profile-address"
            value={form.deliveryAddress}
            onChange={(e) => onChange("deliveryAddress", e.target.value)}
            placeholder="Street, building, apartment, or office"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-city">City</Label>
          <Input
            id="profile-city"
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="Brussels"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-postal">Postal code</Label>
          <Input
            id="profile-postal"
            value={form.postalCode}
            onChange={(e) => onChange("postalCode", e.target.value)}
            placeholder="1000"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSaving}
        className="h-11 rounded-2xl bg-stone-900 px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-stone-700"
      >
        {isSaving ? "Saving profile..." : "Save profile"}
      </Button>
    </form>
  );
}
