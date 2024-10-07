import { Schema, model } from "mongoose";

const customerSchema = new Schema({
   owner: {
      type: Schema.ObjectId,
      ref: "User",
   },
   customers: [{
      id: {
         type: String
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
   }]
}, {
   versionKey: false,
});

const Customer = model("Customer", customerSchema);
export default Customer;