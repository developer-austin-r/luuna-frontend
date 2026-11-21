import ProductDetailPage from "./[slug]/page";

export default async function ProductsDefaultPage() {
  return (
    <ProductDetailPage
      params={Promise.resolve({ slug: "batman-vs-joker-arkham-city-edition" })}
    />
  );
}
