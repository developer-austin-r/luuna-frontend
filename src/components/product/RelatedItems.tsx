"use client";

import React from "react";

import {
  type ArrivalProduct,
  ProductCarousel,
} from "@/components/landing/NewArrivals/NewArrivals";

export const relatedItemsProducts: ArrivalProduct[] = [
  {
    name: "God of War bundle",
    description: "Collector figure · 18 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "warrior",
    image: "/images/hero-1.jpg",
  },
  {
    name: "God of War bundle",
    description: "Anime figure · 15 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "ninja",
    image: "/images/hero-2.jpg",
  },
  {
    name: "God of War bundle",
    description: "Anime figure · 16 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "sunburst",
    image: "/images/hero-3.jpg",
  },
  {
    name: "God of War bundle",
    description: "Vinyl figures · Set of 2",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "web",
    image: "/images/hero-4.jpg",
  },
  {
    name: "God of War bundle",
    description: "Collector figure · 17 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "web",
    image: "/images/hero-5.jpg",
  },
  {
    name: "God of War bundle",
    description: "Fantasy figure · 18 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "warrior",
    image: "/images/hero-1.jpg",
  },
];

export const accessoriesProducts: ArrivalProduct[] = [
  {
    name: "God of War bundle",
    description: "Collector figure · 18 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "warrior",
    image: "/images/hero-1.jpg",
  },
  {
    name: "God of War bundle",
    description: "Anime figure · 15 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "ninja",
    image: "/images/hero-2.jpg",
  },
  {
    name: "God of War bundle",
    description: "Anime figure · 16 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "sunburst",
    image: "/images/hero-3.jpg",
  },
  {
    name: "God of War bundle",
    description: "Vinyl figures · Set of 2",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "web",
    image: "/images/hero-4.jpg",
  },
  {
    name: "God of War bundle",
    description: "Collector figure · 17 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "web",
    image: "/images/hero-5.jpg",
  },
  {
    name: "God of War bundle",
    description: "Fantasy figure · 18 cm",
    price: "₹2500",
    oldPrice: "₹3500",
    variant: "warrior",
    image: "/images/hero-1.jpg",
  },
];

interface RelatedItemsProps {
  relatedProducts?: ArrivalProduct[];
  accessories?: ArrivalProduct[];
}

export const RelatedItems: React.FC<RelatedItemsProps> = ({
  relatedProducts = relatedItemsProducts,
  accessories = accessoriesProducts,
}) => {
  return (
    <>
      {/* 1. RELATED ITEMS Carousel (Reusing Landing Page New Arrivals Design) */}
      <ProductCarousel
        id="related-items"
        title="RELATED ITEMS"
        products={relatedProducts}
      />

      {/* 2. ACCESSORIES Carousel (Reusing Landing Page New Arrivals Design) */}
      <ProductCarousel
        id="accessories"
        title="ACCESSORIES"
        products={accessories}
      />
    </>
  );
};

export default RelatedItems;
