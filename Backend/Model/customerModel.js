import { Schema, model } from "mongoose";

const customerSchema = new Schema({
   ownerID: {
      type: Schema.ObjectId,
      ref: "User",
   },
   customerID: {
      type: String,
   },
   customerName: {
      type: String
   },
   customerAddress: {
      type: String
   },
   customerPhone: {
      type: String
   }
}, {
   versionKey: false,
});

const Customer = model("Customer", customerSchema);
export default Customer;