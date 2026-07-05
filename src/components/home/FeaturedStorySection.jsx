import React from "react";
import { Link } from "react-router-dom";
import { IMAGES } from "@/lib/nequdem-data";

export default function FeaturedStorySection() {
  return (
    <section className="nq-vellum py-16">
      <div className="nq-container">
        <div className="nq-hairline mb-6" />
        <span className="nq-category-label">Featured Story</span>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={IMAGES.featured}
              alt="Featured editorial story"
              className="w-full h-72 md:h-96 object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="nq-category-label">Editorial</span>
            <h2 className="nq-headline text-2xl md:text-3xl lg:text-4xl mt-3">
              The Future of Print Journalism in a Digital World
            </h2>
            <p className="nq-deck mt-4 text-base leading-relaxed">
              As media consumption shifts ever further toward screens, Nequdem
              is charting a bold course that honors the tactile tradition of the
              printed word while embracing the immediacy of digital delivery. In
              this exclusive editorial, our editor-in-chief examines why the
              physical newspaper remains not just relevant, but essential to the
              practice of serious journalism.
            </p>
            <div className="flex items-center gap-3 mt-4 text-xs font-sans text-muted-foreground">
              <span className="font-medium text-ink">By Margaret Holloway</span>
              <span>·</span>
              <span>July 4, 2026</span>
              <span>·</span>
              <span>12 min read</span>
            </div>
            <div className="mt-6">
              <Link to="/article/1" className="nq-btn-primary text-xs">
                Read the Full Story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
