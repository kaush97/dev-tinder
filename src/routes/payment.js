const { userAuth } = require("../middlewares/auth");
const RazorpayInstance = require("../utils/razorpay");
const express = require("express");
const paymentRouter = express.Router();
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const { validateWebhookSignature } = require("razorpay");
const User = require("../models/user");
paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.user;
   
    const { membershipType } = req.body;
    var options = {
      amount: membershipAmount[membershipType] * 100, // Amount is in currency subunits.
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        membershipType: membershipType,
      },
    };
    

    const order = await RazorpayInstance.orders.create(options);
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();
    res.json({
      ...savedPayment.toJSON(),
      keyId: process.env.RAZOR_PAY_API_KEY,
    });
  } catch (error) {
    //
    res.status(400).send(error.message);
  }
});

// paymentRouter.post("/payment/webhook", async (req, res) => {
//   const webhookSignature = req.get["X-Razorpay-Signature"];

//   const isWebHookValid = validateWebhookSignature(
//     JSON.stringify(req.body),
//     webhookSignature,
//     process.env.RAZOR_PAY_WEBHOOK_SECRET_KEY,
//   );
//   if (!isWebHookValid) {
//     return res.status(400).json({ message: "webhook signature is invalid" });
//   }

//   const paymentDetails = req.body.payload.payment.entity;
//   const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
//   payment.status = paymentDetails.status;
//   await payment.save();
//   const user = User.findOne({ _id: payment.userId });
//   user.isPremium = true;
//   user.membershipType = payment.notes.membershipType;
//   await user.save();
//   if (req.body.event == "payment.captured") {
//   }
//   if (req.body.event == "payment.failed") {
//   }
// });
module.exports = paymentRouter;
