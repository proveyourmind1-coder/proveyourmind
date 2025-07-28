import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// ✅ Require instead of import (for Razorpay + CORS compatibility)
const Razorpay = require("razorpay");
const cors = require("cors")({ origin: true });

setGlobalOptions({ maxInstances: 10 });

const razorpay = new Razorpay({
  key_id: "rzp_live_uJDC9v48N3eYao",
  key_secret: "I7Z4AQIvK7BP2krfDgAAxM3o",
});

export const createRazorpayOrder = onRequest((req, res) => {
  return new Promise((resolve) => {
    cors(req, res, async () => {
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return resolve(undefined);
      }

      const { amount, currency = "INR", receipt } = req.body;
      const options = {
        amount: amount * 100,
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
      };

      try {
        const order = await razorpay.orders.create(options);
        logger.info("✅ Razorpay order created", order);
        res.status(200).json(order);
      } catch (err) {
        logger.error("❌ Razorpay error", err);
        res.status(500).send("Order creation failed");
      }

      resolve(undefined); // ✅ Explicit return to satisfy TS
    });
  });
});
