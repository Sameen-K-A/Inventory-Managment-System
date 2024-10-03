import Stock from "../Model/stockModel.js";
import User from "../Model/userModel.js";
import bcrypt from "bcrypt";

class Controller {

   async login(req, res) {
      try {
         const { email, password } = req.body;
         let response = await User.findOne({ email: email });
         if (!response) {
            return res.status(404).send("Email not found");
         };
         const comparePassword = await bcrypt.compare(password, response.password);
         if (comparePassword === true) {
            res.status(200).send("Login successfully");
         } else {
            res.status(401).send("Entered password is wrong");
         };
      } catch (error) {
         console.log("Login error", error);
         res.status(500).send("Something went wrong, please try again later.");
      }
   }

   async register(req, res) {
      try {
         const { name, email, password } = req.body;
         console.log(name, email, password);

         const alreadyExist = await User.findOne({ email: email });
         if (alreadyExist) {
            console.log("Email already exists.");
            return res.status(409).send("Email already exists.");
         }

         const hashedPassword = await bcrypt.hash(password, 10);
         const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
         });
         const newStockOwner = new Stock({
            owner: newUser._id,
         });

         await Promise.all([newUser.save(), newStockOwner.save()]);
         console.log("User registered successfully:", newUser);
         res.status(201).send("Registration completed");
      } catch (error) {
         console.log("Registration error", error);
         res.status(500).send("Something went wrong, please try again later.");
      }
   };

   async getStock(req, res) {
      try {
         res.status(200).send("Success");
      } catch (error) {
         console.log("Get stock error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

   async creatStock(req, res) {
      try {
         const { itemName, description, price, quantity } = req.body;
         const user = await User.findOne({ email: "sameensameen60@gmail.com" });
         const newStock = {
            itemName: itemName,
            description: description,
            price: parseInt(price),
            quantity: parseInt(quantity),
         };
         const isCreated = await Stock.updateOne({ owner: user._id }, { $push: { stocks: newStock } });
         if (isCreated.modifiedCount === 1) {
            res.status(201).json(newStock);
         } else {
            res.status(400).send("Failed to create your stock");
         };
      } catch (error) {
         res.status(500).send("Something went wrong, please try again later.");
         console.log("Error occur while creating new stock", error);
      };
   };

   async editStock(req, res) {
      try {
         res.status(200).send("Success");
      } catch (error) {
         console.log("Edit stock error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

   async deleteStock(req, res) {
      try {
         res.status(200).send("Success");
      } catch (error) {
         console.log("Delete stock error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

}

export default Controller;