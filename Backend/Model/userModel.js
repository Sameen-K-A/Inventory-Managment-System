import { Schema, model } from "mongoose";

const userSchema = new Schema({
   name: {
      type: String
   },
   email: {
      type: String,
      unique: true
   },
   password: {
      type: String
   }
}, {
   versionKey: false,
});

const User = model("User", userSchema);
export default User;