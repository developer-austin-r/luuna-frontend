import React from "react";
import Image from "next/image";
import Link from "next/link";

interface RelatedProduct {
  id: string;
  name: string;
  subtitle: string;
  slug: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
}

const defaultRelatedProducts: RelatedProduct[] = [
  {
    id: "1",
    name: "Batman: The Dark Knight Returns",
    subtitle: "Collector figure · 18 cm",
    slug: "batman-the-dark-knight-returns",
    price: 2500,
    originalPrice: 3500,
    discount: "-20%",
    image: "/images/recommendation-toy.png",
  },
  {
    id: "2",
    name: "Joker: Clown Prince of Crime",
    subtitle: "Anime & Comic figure · 16 cm",
    slug: "joker-clown-prince-of-crime",
    price: 2400,
    originalPrice: 3200,
    discount: "-25%",
    image: "/images/categories/dc.png",
  },
  {
    id: "3",
    name: "Arkham Knight Armored Edition",
    subtitle: "Collector figure · 17 cm",
    slug: "arkham-knight-armored-edition",
    price: 2800,
    originalPrice: 3800,
    discount: "-20%",
    image: "/images/categories/anime.png",
  },
  {
    id: "4",
    name: "Batman Beyond Neo-Gotham Edition",
    subtitle: "Vinyl figures · Set of 2",
    slug: "batman-beyond-neo-gotham-edition",
    price: 2600,
    originalPrice: 3600,
    discount: "-20%",
    image: "/images/recommendation-toy.png",
  },
];

interface RelatedItemsProps {
  products?: RelatedProduct[];
}

export const RelatedItems: React.FC<RelatedItemsProps> = ({
  products = defaultRelatedProducts,
}) => {
  return (
    <section className="w-full py-8 sm:py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white text-center uppercase tracking-widest mb-6 sm:mb-8 md:mb-12">
          RELATED ITEMS
        </h2>

        {/* Product Cards Grid: 2 cols on mobile, 3 on tablet, 4 on desktop/laptop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="group flex flex-col bg-[#180D2B] rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              {/* Card Image Area */}
              <div className="relative w-full aspect-square bg-[#130924] p-3 sm:p-4 flex items-center justify-center overflow-hidden">
                {/* Discount Badge */}
                <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 bg-white/90 text-black text-[9px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
                  {item.discount}
                </span>

                <div className="relative w-full h-full transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Card Details Area */}
              <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between bg-[#180D2B]">
                <div>
                  <h3 className="text-white font-bold text-xs sm:text-sm line-clamp-1 group-hover:text-purple-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5 sm:gap-2 mt-2 sm:mt-3 pt-2 border-t border-white/5">
                  <span className="text-white font-extrabold text-xs sm:text-base">
                    ₹{item.price}
                  </span>
                  <span className="text-gray-400 line-through text-[10px] sm:text-xs">
                    ₹{item.originalPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedItems;
