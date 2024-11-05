import { Schema, model } from "mongoose";

const stockSchema = new Schema({
   ownerID: {
      type: Schema.ObjectId,
      ref: "User",
   },
   itemID: {
      type: String,
   },
   itemName: {
      type: String
   },
   description: {
      type: String
   },
   quantity: {
      type: Number
   },
   price: {
      type: Number
   }
}, {
   versionKey: false,
});

const Stock = model("Stock", stockSchema);
export default Stock;