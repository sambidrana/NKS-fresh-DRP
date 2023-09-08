import { mongooseConnect } from "@/lib/mongoose";
import { Enquiry } from "@/models/Enquiry";
import Cors from "cors";

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

export default async function handlerEnquiry(req, res) {
  await runMiddleware(req, res, cors);

  await mongooseConnect();
  const { method } = req;

  if (method === "POST") {
    try {
      const { name, phone, email, enquiry } = req.body;
      const enquiryDoc = await Enquiry.create({ name, phone, email, enquiry });
      res.status(201).json(enquiryDoc);
    } catch (error) {
      res.status(500).json({ error: "Failed to save the enquiry." });
    }
  }
  if (method === "GET") {
    try {
      res.json(await Enquiry.find().sort({ createdAt: -1 }));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch enquiries." });
    }
  }
}
