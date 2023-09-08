import { model, models, Schema } from "mongoose";

const EnquirySchema = new Schema(
  {
    name: String,
    phone: Number,
    email: String,
    enquiry: String,
  },
  {
    timestamps: true,
  }
);

export const Enquiry = models?.Enquiry || model('Enquiry', EnquirySchema)
