import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handlerNewProduct(req, res) {
    const {method} = req;
    await mongooseConnect();
    
    if (method === 'GET') {
        if (req.query?.id) {
            // console.log(res)
            res.json(await Product.findOne({_id:req.query.id}));
        } else {
            res.json(await Product.find())
        }
    }
    if (method === 'POST') {
        const {productName, description, price, images} = req.body;
        const productDoc = await Product.create({
            productName, description, price, images
        })
        res.json(productDoc)
    }
    if (method === "PUT") {
        const {productName, description, price, images, _id} = req.body;
        // console.log({images})
        await Product.updateOne({_id}, {productName, description, price, images})
        res.json(true)
    }
    if (method === "DELETE") {
        if (req.query?.id) {
            await Product.deleteOne({_id:req.query?.id});
            res.json(true);
        }
         
    }

}

// In Next.js, the api folder within the pages directory is a special folder that allows you to create API routes without setting up an additional server or configuring routes as you would in traditional setups, like with Express.js. Each file inside the api folder corresponds to an API endpoint. These endpoints are essentially serverless functions that run on-demand.

// Imports:

// mongooseConnect is a function imported from "@/lib/mongoose". It probably helps in connecting to a MongoDB database using Mongoose.
// Product is a Mongoose model imported from "@/models/Product". It represents a product in the database.
// API Route:

// export default async function handlerNewProduct(req, res): This function is the default export for this API route. It's executed when a request is made to /api/products. Being an asynchronous function, it can handle promises natively, which is very common when dealing with databases.
// Request Method Handling:

// const {method} = req;: This extracts the HTTP method (like GET, POST, etc.) of the incoming request.

// await mongooseConnect();: Before handling any database operations, a connection to the MongoDB database is established using this function.

// if (method === 'GET'): If the HTTP method is GET, then it fetches all products from the database using the Product.find() method and sends them back in the response.

// if (method === 'POST'): If the HTTP method is POST, the function expects product details in the request body (productName, description, price). It then creates a new product in the database using Product.create(). Once the product is created, it returns the product's data in the response.

// This structure allows the /api/products endpoint to handle both fetching products and creating new ones, depending on the HTTP method of the request. It's a simple representation of a RESTful API where different methods have different behaviors.

//////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// In Next.js, the API routes provide a solution to build your API endpoints, making it easy to merge the frontend and the backend into a single entity. Here's a step-by-step explanation of how your code works:

// File Structure: The code you've provided appears to be in the pages/api directory. In Next.js, any file inside the pages/api directory is treated as an API route, and it won't be part of the React frontend bundle.

// Request & Response: Each API route exports a default function that receives two arguments:

// req: An instance of http.IncomingMessage, plus some pre-built middlewares.
// res: An instance of http.ServerResponse, plus some helper functions.
// Distinguishing Between Methods: Within the function, you're checking the HTTP method of the request (req.method). This way, you can define how your endpoint should respond to different methods (GET, POST, etc.).

// GET Request:

// If it's a GET request and there's an id in the query parameters (req.query?.id), you're querying the database for a specific product using Product.findOne({_id:req.query.id}).
// If there's no id in the query parameters, you're fetching all products from the database using Product.find().
// POST Request:

// If it's a POST request, you're extracting data from the request body (req.body). This is presumably the data sent from a client when they want to create a new product.
// Then, you're creating a new product in the database using the Product.create() method.
// Sending Response: After performing the database operations, you're sending the response back to the client using res.json(). This sends a JSON response with the given object.

// Actual Requests: This is the part that may seem a bit like "magic" if you're coming from a more traditional backend framework. In Next.js, the filename and its location in the pages/api directory directly correspond to the route that the API endpoint is accessible from. For example:

// If this file is named product.js and is directly inside the pages/api directory, the endpoint will be http://yourdomain.com/api/product.
// To make a GET request, a client would access http://yourdomain.com/api/product with a GET method.
// To make a POST request, a client would send a POST request with a body to the same endpoint.
// That's how API routes in Next.js work in a nutshell. They offer an easy way to build endpoints with Node.js, without the need for an external server or framework like Express (though you can use Express with Next.js if you'd like).