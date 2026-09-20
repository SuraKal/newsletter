import React from "react";
import { useLegalPage } from "@/lib/use-legal-page";
import LegalPolicyPage from "@/components/legal/LegalPolicyPage";

export default function Cookies() {
  const { page, notFound } = useLegalPage("cookies");
  return <LegalPolicyPage page={notFound ? null : page} />;
}