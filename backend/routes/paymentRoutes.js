// backend/routes/paymentRoutes.js
import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, email } = req.body;

    // Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Investment Payment",
            },
            unit_amount: amount * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/payment-success",
      cancel_url: "http://localhost:5173/payment-cancel",
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment error", error: err.message });
  }
});

export default router;
