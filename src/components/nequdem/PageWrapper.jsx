import React from "react";
import DeliveryTicker from "@/components/nequdem/DeliveryTicker";
import Masthead from "@/components/nequdem/Masthead";
import Footer from "@/components/nequdem/Footer";

export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen nq-parchment">
      <DeliveryTicker />
      <Masthead />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
