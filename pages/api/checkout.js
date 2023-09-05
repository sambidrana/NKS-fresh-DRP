import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import Cors from "cors";
const stripe = require("stripe")(process.env.STRIPE_SK);

// Initializing the cors middleware
const cors = Cors({
  origin: "http://localhost:3001", // specify the origin you want to allow
  methods: ["POST"], // specify the methods you want to allow
});

// Helper to promisify the middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handlerCheckout(req, res) {
  await runMiddleware(req, res, cors);
  await mongooseConnect();

  if (req.method !== "POST") {
    res.json("should be a POST requst");
    return;
  }

  const { name, phone, email, address, city, postalCode, territory, products } =
    req.body;
  const productsIds = products;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({ _id: uniqueIds });

  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(
      (p) => p._id.toString() === productId
    );
    const quantity = productsIds.filter((id) => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: "AUD",
          product_data: { name: productInfo.productName },
          unit_amount: productInfo.price * 100,
        },
      });
    }
  }
  //   res.json({ line_items });
  const orderDoc = await Order.create({
    line_items,
    name,
    phone,
    email,
    address,
    city,
    postalCode,
    territory,
    paid: false,
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    customer_email: email,
    success_url: process.env.PUBLIC_URL + "/cart?success=1",
    cancel_url: process.env.PUBLIC_URL + "/cart?canceled=1",
    metadata: { orderId: orderDoc._id.toString(),test:'ok' },
  });

  res.json({
    url: session.url,
  });
}
