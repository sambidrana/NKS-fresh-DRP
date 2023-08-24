import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  productName: existingName,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties
}) {
  const [productName, setProductName] = useState(existingName || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  // const [goToProducts, setGoToProducts] = useState(false)
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(assignedProperties || {});
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const saveProduct = async function (e) {
    e.preventDefault();
    const data = {
      productName,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      //edit/update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    router.push("/products"); // setGoToProducts(true)// if(goToProducts) { // }
  };

  const uploadImages = async function (e) {
    const files = e.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const response = await axios.post("/api/upload", data);
      // console.log(response.data)
      setImages((oldImages) => {
        return [...oldImages, ...response.data.links];
      });
      setIsUploading(false);
    }
  };

  const updateImagesOrder = function (images) {
    setImages(images);
  };

  const setProductProp = function (propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  };

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      //5.05.10 // running the parent cat again
      catInfo = parentCat;
    }
  }
  
  return (
    <form onSubmit={saveProduct}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="Enter new Product"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Uncategorised</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option value={category._id} key={category._id}>
              {category.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div className="" key={p.name}>
            <label>{p.name}</label>
            <div>
            <select
              value={productProperties[p.name]}
              onChange={(e) => setProductProp(p.name, e.target.value)}
            >
              {p.values.map((v) => (
                <option value={v} key={v}>{v}</option>
              ))}
            </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1.5">
        <ReactSortable
          list={images}
          setList={updateImagesOrder}
          className="flex flex-wrap gap-1"
        >
          {!!images?.length &&
            images.map((link, i) => (
              <div key={i} className="h-24 shadow-md uploaded-img">
                <img src={link} alt="" className="rounded-lg border" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 shadow-sm btn-upload ">
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
          <div>Upload</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
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
      <button type="submit" className="btn-primary btn-general">
        Save
      </button>
    </form>
  );
}
