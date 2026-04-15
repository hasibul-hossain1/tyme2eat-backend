import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import stripe from "../lib/stripe.js";

export const webhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body as Buffer | string, // ✅ raw body from express.raw()
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;

        const orderId = session.metadata?.orderId;

        if (!orderId) break;

        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });

        // 🔁 Prevent duplicate update
        if (order?.isPaid) break;

        await prisma.order.update({
          where: { id: orderId },
          data: {
            isPaid: true,
            status: "CONFIRMED",
            paidAt: new Date(),
          },
        });

        console.log("✅ Payment success:", orderId);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;

        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: "CANCELLED",
            },
          });
        }

        console.log("❌ Payment failed");
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as any;

        const orderId = session.metadata?.orderId;

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" },
          });
        }

        console.log("⚠️ Session expired");
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).send("Server Error");
  }
};