import Layout from "@/components/Layout";
import { data } from "autoprefixer";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]); //for displaying categories
  const [parentCategory, setParentCategory] = useState(""); //for selecting existing category
  const [editedCategory, setEditedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }

  const saveCategory = function (e) {
    e.preventDefault();
    const payload = { name };
    if (parentCategory) {
      payload.parentCategory = parentCategory;
    }
    if (editedCategory) {
      payload._id = editedCategory._id;
      axios.put("/api/categories", payload); //{...payload, _id:editedCategory._id}
      setEditedCategory(null);
    } else {
      axios
        .post("/api/categories", payload)
        .then(() => {
          setName("");
          fetchCategories();
        })
        .catch((error) => {
          console.error("Error saving category:", error);
        });
    }
    setName("");
    fetchCategories();
  };

  const editCategory = function (category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  };

  return (
    <Layout>
      <h1>Categories</h1>
      <label  >
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create New Category"}
      </label>
      <form className="flex gap-1" onSubmit={saveCategory}>
        <input
          className="mb-0"
          type="text"
          placeholder="Category Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <select
          className="mb-0"
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
        >
          <option value="">No Parent Category</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option value={category._id}>{category.name}</option>
            ))}
        </select>
        <button type="submit" className="btn-primary py-1 ">
          Save
        </button>
      </form>
      <table className="basic mt-4 ">
        <thead>
          <tr>
            <td>Category Name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    className="btn-primary mr-1.5"
                    onClick={() => editCategory(category)}
                  >
                    Edit
                  </button>
                  <button className="btn-primary">Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

// value={name} attribute in the input element does a few things:

// Controlled Component: It turns your input into a "controlled component". In React, a controlled component is an input element where the value of the input is controlled by state. By doing this, you ensure that the display of the input is always in sync with the state of your component.

// State Synchronization: It guarantees that the displayed value will always match the value held in the component's state (name in this case). If you ever change the state outside of the input's onChange (e.g., programmatically, or in response to some other event), the input will always reflect the current state.

// Predictable Data Flow: It provides a single source of truth. With controlled components, the React state is the single source of truth for the input value, making debugging and data flow more predictable.

// Easier Validation: You can easily apply input validation because you have a clear handle on the data at all times. For example, if you have logic that prevents certain characters or patterns in the input, the value property ensures that the visible value adheres to these constraints.

// Event Handling: By having a state variable (name in this case) and an event handler (onChange), you ensure that every time a user types something, the state is updated. Then, the updated state is rendered back to the input field, making the whole flow seamless and reactive.

// In summary, using value={name} combined with the onChange handler provides a consistent and controlled way of handling input data in React.
