import mongoose, { now } from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderID: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "pending" },
  date: { type: Date, default: Date.now() },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
