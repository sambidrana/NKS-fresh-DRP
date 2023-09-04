import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema({
  line_items: Object,
  name: String,
  phone: Number,
  email: String,
  address: String,
  city: String,
  postalCode: Number,
  territory: String,
  paid: Boolean,
}, {
    timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema)