import React from "react";
import { useLegalPage } from "@/lib/use-legal-page";
import LegalPolicyPage from "@/components/legal/LegalPolicyPage";

export default function Privacy() {
  const { page, notFound } = useLegalPage("privacy");
  return <LegalPolicyPage page={notFound ? null : page} />;
}