import mongoose, { model, Schema, models } from "mongoose"

const ProductSchema = new Schema({
    productName: {type: String, required: true},
    description: String,
    price: {type: Number, required: true},
    images: [{type: String}],
    category: {type: mongoose.Types.ObjectId, ref:'Category'},
    properties: {type: Object}
}, {
    timestamps: true,
})

export const Product = models.Product || model('Product', ProductSchema);

// Imports:

// We are importing three things from the mongoose library. Mongoose is a tool that helps us work with MongoDB (a type of database) in a more structured and user-friendly way.
// model: This is a function to create a new model. Think of a model as a blueprint or a template for the data you want to store.
// Schema: This helps us define the shape and content of the data we want to store.
// models: This is an object that keeps track of all models that have been defined.
// Schema Definition:

// We're defining a new schema (ProductSchema). This is like defining a form with fields that our data should have.
// productName: This is a field that is expected to be a string (a sequence of characters). The required: true means that every product must have this field filled.
// description: Another string field but it's not mandatory.
// price: A field to store numbers. It's required too.
// Model Definition:

// With the schema defined, we are now creating a model using the model function. This model will be our primary tool for interacting with the corresponding data in our database.
// The tricky part: models.Product || model('Product', ProductSchema);
// This line first checks if a model named 'Product' has already been defined (models.Product). If it exists, it just uses that.
// If not, it defines a new one using the model('Product', ProductSchema) part.
// The reason for this check is to avoid errors. In some scenarios, especially in development, our code might try to define the 'Product' model more than once. Since you can't have two models with the same name, we use this pattern to ensure we either use an existing 'Product' model or create a new one if it doesn't exist.
// In essence, this code is setting up the rules and tools for working with product data in a MongoDB database.