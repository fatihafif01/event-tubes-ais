"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EventCategories() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const categories = [
    {
      name: "Konser Musik",
      count: 245,
      slug: "konser-musik",
      description: "Konser, festival musik, dan pertunjukan live",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
    },
    {
      name: "Seminar & Workshop",
      count: 189,
      slug: "seminar-workshop",
      description: "Pengembangan diri dan pelatihan profesional",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80",
    },
    {
      name: "Festival",
      count: 156,
      slug: "festival",
      description: "Festival budaya, makanan, dan seni",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    },
    {
      name: "Olahraga",
      count: 98,
      slug: "olahraga",
      description: "Pertandingan, turnamen, dan event olahraga",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80",
    },
    {
      name: "Teater & Seni",
      count: 87,
      slug: "teater-seni",
      description: "Pertunjukan teater, pameran, dan seni pertunjukan",
      image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&q=80",
    },
    {
      name: "Bisnis & Networking",
      count: 134,
      slug: "bisnis-networking",
      description: "Konferensi bisnis dan acara networking",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&q=80",
    },
  ];

  // ✅ Handle klik kategori - redirect ke login
  const handleCategoryClick = (slug: string) => {
    router.push(`/login?redirect=/categories/${slug}`);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24">
      {/* Header Section */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Kategori Event
        </h2>
        <p className="text-gray-600 max-w-2xl text-lg">
          Temukan event yang sesuai dengan minat dan passion Anda
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={category.slug}
            onClick={() => handleCategoryClick(category.slug)}
            className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setActiveCategory(index)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Event Count Badge */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-sm">
                <span className="text-sm font-semibold text-gray-900">
                  {category.count} event
                </span>
              </div>

              {/* View All Link (appears on hover) */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-flex items-center text-white text-sm font-medium">
                  Jelajahi kategori
                  <svg 
                    className="ml-2 w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* View All Categories Link - juga redirect ke login */}
      <div className="mt-12 text-center">
        <Link
          href="/login?redirect=/categories"
          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
        >
          Lihat Semua Kategori
          <svg 
            className="ml-2 w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 8l4 4m0 0l-4 4m4-4H3" 
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}