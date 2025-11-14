import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";

const HomePAge = () => {
  return (
    <>
      <ProductList data={sampleData.products} title="New Arrivals" limit={4} />
    </>
  );
};

export default HomePAge;
