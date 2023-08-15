import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";

export default function ProductForm({
  _id,
  productName: existingName,
  description: existingDescription,
  price: existingPrice,
  images,
}) {
  const [productName, setProductName] = useState(existingName || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  // const [goToProducts, setGoToProducts] = useState(false)
  const router = useRouter();

  const saveProduct = async function (e) {
    e.preventDefault();
    const data = { productName, description, price };
    if (_id) {
      //edit/update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    router.push("/products");
    // setGoToProducts(true)
    // if(goToProducts) {
    // }
  };
  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="Enter new Product"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <label>Photos</label>
      <div className="mb-2">
        <button className="w-24 h-24 flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 btn-upload ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload{" "}
        </button>
        {!images?.length && <div> No photos in this product </div>}
      </div>
      <label>Description</label>
      <textarea
        placeholder="Desctiption"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>Price (in AUD)</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
