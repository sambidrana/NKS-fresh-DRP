import Layout from "@/components/Layout";
import { useState } from "react";

export default function NewProduct() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  
  const createProduct = function() {
    
  }
  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>New Product</h1>
        <label>Product Name</label>
        <input
          type="text"
          placeholder="Enter new Product"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
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
    </Layout>
  );
}
