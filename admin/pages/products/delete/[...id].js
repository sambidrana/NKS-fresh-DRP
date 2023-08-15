import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProduct() {
  const [productInfo, setProductInfo] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/api/products?id=${id}`).then((res) => {
      setProductInfo(res.data);
    });
  }, [id]);

  const goBack = function () {
    router.push("/products");
  };

  const deleteProduct = async function () {
    const response = await axios.delete(`/api/products?id=${id}`);
    if (response.data === true) {
      setIsDeleted(true); // not necessary
      setTimeout(() => {
        goBack();
      }, 2000);
    }
  };
  if (!productInfo) {
    return (
      <Layout>
        <h1>Loading...</h1>
      </Layout>
    );
  }
  if (isDeleted) {
    return (
      <Layout>
        <h1>Product has been deleted</h1>
      </Layout>
    );
  }
  console.log(productInfo);
  return (
    <Layout>
      <h1 className="text-center">
        Do you really want to delete &nbsp;"{productInfo?.productName}" ?
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteProduct}>
          Yes
        </button>
        <button className="btn-default" onClick={goBack}>
          No
        </button>
      </div>
    </Layout>
  );
}
