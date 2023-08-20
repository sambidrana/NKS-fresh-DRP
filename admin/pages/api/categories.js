import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handlerCategories(req, res) {
  const method = req.method; // {method} = req
  await mongooseConnect();
  if (method === "GET") {
    const allCategories = await Category.find().populate("parent");
    res.json(allCategories);
  }
  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory,
      properties,
    });
    res.json(categoryDoc);
  }
  if (method === "PUT") {
    //properties will be an array of objects and each obj will have a name and values which will be a string
    const { name, parentCategory, properties, _id } = req.body;
    // below we first  want to specify an obj of what we want to update, then the obj of data that we want to update with
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory,
        properties,
      }
    );
    res.json(categoryDoc);
  }
  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("ok");
  }
}
