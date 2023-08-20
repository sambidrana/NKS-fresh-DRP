import Layout from "@/components/Layout";
import { data } from "autoprefixer";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]); //for displaying categories
  const [parentCategory, setParentCategory] = useState(""); //for selecting existing category
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }

  const saveCategory = async function (e) {
    e.preventDefault();
    const payload = {
      name,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (parentCategory) {
      payload.parentCategory = parentCategory;
    }
    if (editedCategory) {
      payload._id = editedCategory._id;
      await axios.put("/api/categories", payload); //{...payload, _id:editedCategory._id}
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", payload);
    }
    setName("");
    setParentCategory("");
    fetchCategories();
  };

  const editCategory = function (category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  };

  const deleteCategory = function (category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        // when confirmed and promise resolved...
        const { _id } = category;
        if (result.isConfirmed) {
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
        console.log(result);
      })
      .catch((error) => {
        // when promise rejected...
        console.log(error);
      });
  };
  const addProperty = function () {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  };

  const handlePropertyNameChange = function (index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };
  const handlePropertyValuesChange = function (index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  };
  const removeProperty = function (indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((property, propertyIndex) => {
        return propertyIndex !== indexToRemove;
      });
    });
  };

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create New Category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No Parent Category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            className="btn-default text-sm mb-1"
            onClick={addProperty}
          >
            Add New Property
          </button>
          {properties.length > 0 &&
            properties.map((property, i) => (
              <div key={i} className="flex gap-1 mb-2">
                <input
                  type="text"
                  value={property.name}
                  className="mb-0"
                  onChange={(e) =>
                    handlePropertyNameChange(i, property, e.target.value)
                  }
                  placeholder="property name (eg: color)"
                ></input>
                <input
                  type="text"
                  value={property.values}
                  className="mb-0"
                  onChange={(e) =>
                    handlePropertyValuesChange(i, property, e.target.value)
                  }
                  placeholder="values, comma seperated"
                ></input>
                <button
                  type="button"
                  className="btn-default"
                  onClick={() => removeProperty(i)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              className="btn-default"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
              }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1 ">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
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
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      className="btn-primary mr-1.5"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => deleteCategory(category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);

// value={name} attribute in the input element does a few things:

// Controlled Component: It turns your input into a "controlled component". In React, a controlled component is an input element where the value of the input is controlled by state. By doing this, you ensure that the display of the input is always in sync with the state of your component.

// State Synchronization: It guarantees that the displayed value will always match the value held in the component's state (name in this case). If you ever change the state outside of the input's onChange (e.g., programmatically, or in response to some other event), the input will always reflect the current state.

// Predictable Data Flow: It provides a single source of truth. With controlled components, the React state is the single source of truth for the input value, making debugging and data flow more predictable.

// Easier Validation: You can easily apply input validation because you have a clear handle on the data at all times. For example, if you have logic that prevents certain characters or patterns in the input, the value property ensures that the visible value adheres to these constraints.

// Event Handling: By having a state variable (name in this case) and an event handler (onChange), you ensure that every time a user types something, the state is updated. Then, the updated state is rendered back to the input field, making the whole flow seamless and reactive.

// In summary, using value={name} combined with the onChange handler provides a consistent and controlled way of handling input data in React.
