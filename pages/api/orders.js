import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handlerOrders(req, res) {
    await mongooseConnect();
    res.json(await Order.find().sort({createdAt: -1}))
}