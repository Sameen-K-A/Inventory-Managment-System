import { Schema, model } from "mongoose";

const unVerifiedUserSchema = new Schema({
   name: {
      type: String
   },
   email: {
      type: String,
      unique: true
   },
   password: {
      type: String
   },
   createdAt: {
      type: Date,
      default: Date.now,
      expires: 180
   }
}, {
   versionKey: false
});

const TempUser = model("unVerifiedUser", unVerifiedUserSchema);
export default TempUser;