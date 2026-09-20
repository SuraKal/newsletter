import React from "react";
import { useLegalPage } from "@/lib/use-legal-page";
import LegalPolicyPage from "@/components/legal/LegalPolicyPage";

export default function Refund() {
  const { page, notFound } = useLegalPage("refund");
  return <LegalPolicyPage page={notFound ? null : page} />;
}