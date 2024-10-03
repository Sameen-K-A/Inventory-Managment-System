import { Schema, model } from "mongoose";

const stockSchema = new Schema({

   owner: {
      type: Schema.ObjectId,
      ref: "User",
   },
   stocks: [{
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
   }]
}, {
   versionKey: false,
});

const Stock = model("Stock", stockSchema);
export default Stock;