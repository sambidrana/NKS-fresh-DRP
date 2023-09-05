import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require("stripe")(process.env.STRIPE_SK);
import { buffer } from "micro";

const endpointSecret = "whsec_1afe136207d16914a7730c3d10b39456c1ecda39588ea7ec199804b2a59c8654";

export default async function handlerWebhook(req, res) {
  await mongooseConnect();

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(await buffer(req) , sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const data= event.data.object;
      const orderId = data.metadata.orderId;
      const paid = data.payment_status === 'paid';
      if(orderId && paid ) {
        await Order.findByIdAndUpdate(orderId, {
            paid:true,
        })
      }

      // Then define and call a function to handle the event payment_intent.succeeded
      console.log(data)
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send('ok')
}

export const config = {
    api: {bodyParser:false}
}



//cozy-mighty-lawful-famous