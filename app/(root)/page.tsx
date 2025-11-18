import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";


const HomePAge = async () => {

  const latestProducts = await getLatestProducts();

  return (
    <>
      <ProductList data={latestProducts} title="New Arrivals" limit={4} />
    </>
  );
};

export default HomePAge;
