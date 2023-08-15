import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProduct({}) {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  // console.log(router)
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/api/products?id=${id}`).then((res) => {
      setProductInfo(res.data);
    });
  }, [id]);

  if (!productInfo) {
    return (
      <Layout>
        <h1>Loading...</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Edit Product</h1>
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
}

// The filename dictates the route, and the square brackets [] are used to specify dynamic segments of the route. The file extension should be outside of these brackets.

// So if you want a dynamic route for editing a product, the correct filename would be:

// [...editProduct].js

// With this filename, the file will handle routes like:

// /products/edit/1
// /products/edit/1/2
// ... and so on.

// the location of the file matters and dictates the resulting URL pattern.

// products/edit/[...editProduct].js

// This structure means that you're anticipating routes like:
// /products/edit/1
// /products/edit/1/2
// ... and so on.
// The edit segment is static and always needs to be in the URL.

// products/[...editProduct].js

// This structure is more generic, and you're anticipating routes like:
// /products/1
// /products/1/edit
// /products/1/2
// ... and so on.
// It doesn't specify an edit segment in the URL, and the dynamic part can represent any value.

// In summary, the choice between these two depends on the URL structure you want for your application. If you specifically want an "edit" keyword in the URL path for editing products, then the first structure is the way to go. If you're looking for a more generic approach where the dynamic segment could represent different things, the second structure might be better.
