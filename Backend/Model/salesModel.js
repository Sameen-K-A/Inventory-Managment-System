import { Schema, model } from "mongoose";

const salesSchema = new Schema({
   owner: {
      type: Schema.ObjectId,
      ref: "User",
   },
   sales: [{
      id: {
         type: String
      },
      customerName: {
         type: String
      },
      productName: {
         type: String
      },
      quantity: {
         type: Number
      },
      price: {
         type: Number
      },
      date: {
         type: String
      }
   }]
}, {
   versionKey: false,
});

const Sale = model("Sale", salesSchema);
export default Sale;