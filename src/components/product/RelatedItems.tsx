import LandingProductCarousel from "@/components/landing/NewArrivals/LandingProductCarousel";

interface RelatedItemsProps {
  productId: string;
}

export function RelatedItems({ productId }: RelatedItemsProps) {
  return (
    <div className="w-full flex flex-col">
      {/* RELATED ITEMS Carousel */}
      <LandingProductCarousel section="related" productId={productId} />

      {/* ACCESSORIES Carousel */}
      <LandingProductCarousel section="accessories" />
    </div>
  );
}

export default RelatedItems;
