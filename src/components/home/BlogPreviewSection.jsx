import React from "react";
import { Link } from "react-router-dom";
import { ARTICLES } from "@/lib/nequdem-data";
import NewsCard from "@/components/nequdem/NewsCard";
import SectionHeader from "@/components/nequdem/SectionHeader";

export default function BlogPreviewSection() {
  return (
    <section className="nq-vellum py-12">
      <div className="nq-container">
        <SectionHeader
          title="From the Editorial Desk"
          subtitle="Opinion, analysis, and long-form journalism"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.slice(5, 8).map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/news" className="nq-btn-outline text-xs">
            View All Editorials
          </Link>
        </div>
      </div>
    </section>
  );
}
