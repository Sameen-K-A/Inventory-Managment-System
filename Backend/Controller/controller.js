import Stock from "../Model/stockModel.js";
import User from "../Model/userModel.js";
import Customer from "../Model/customerModel.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { createAccessToken, createRefreshToken } from "../Config/jwtConfig.js";
import Sale from "../Model/salesModel.js";

class Controller {

   //================================================ Login ========================================================//

   async login(req, res) {
      try {
         const { email, password } = req.body;
         let response = await User.findOne({ email: email });
         if (!response) {
            return res.status(404).send("Email not found");
         };
         const comparePassword = await bcrypt.compare(password, response.password);
         if (comparePassword === true) {

            const userAccessToken = createAccessToken(response._id);
            const userRefeshToken = createRefreshToken(response._id);

            res.cookie("RefreshToken", userRefeshToken, {
               httpOnly: true,
               sameSite: 'none',
               secure: true,
               maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.cookie("AccessToken", userAccessToken, {
               httpOnly: true,
               sameSite: 'none',
               secure: true,
               maxAge: 15 * 60 * 1000,
            });

            res.status(200).send("Login successfully");
         } else {
            res.status(401).send("Entered password is wrong");
         };
      } catch (error) {
         console.log("Login error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

   //================================================ Register ========================================================//

   async register(req, res) {
      try {
         const { name, email, password } = req.body;
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

         await newUser.save();
         res.status(201).send("Registration completed");
      } catch (error) {
         console.log("Registration error", error);
         res.status(500).send("Something went wrong, please try again later.");
      }
   };

   //================================================ Stock management ========================================================//
   //================================================ Get stock ========================================================//

   async getStock(req, res) {
      try {
         const response = await Stock.find({ ownerID: req.user_id }, { _id: 0, ownerID: 0 });
         res.status(200).json(response);
      } catch (error) {
         console.log("Get stock error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

   //================================================ Create new stock ========================================================//

   async creatStock(req, res) {
      try {
         const { itemName, description, price, quantity } = req.body;
         const newStock = {
            ownerID: req.user_id,
            itemID: uuid().toString(),
            itemName: itemName,
            description: description,
            price: parseInt(price),
            quantity: parseInt(quantity),
         };
         const isCreated = await Stock.create(newStock);
         console.log(isCreated)
         if (isCreated) {
            delete newStock.ownerID;
            res.status(201).json(newStock);
         } else {
            res.status(400).send("Failed to create your stock");
         };
      } catch (error) {
         res.status(500).send("Something went wrong, please try again later.");
         console.log("Error occur while creating new stock", error);
      };
   };

   //================================================ Edit existing stock ========================================================//

   async editStock(req, res) {
      try {
         const { itemID, itemName, description, price, quantity } = req.body;
         const response = await Stock.updateOne(
            { itemID: itemID },
            {
               $set: {
                  itemName: itemName,
                  description: description,
                  price: parseFloat(price),
                  quantity: parseInt(quantity)
               },
            },
         );
         if (response.modifiedCount === 1) {
            res.status(200).send("Stock updated successfully");
         } else {
            res.status(400).send("Failed to update stock");
         };
      } catch (error) {
         console.log("Edit stock error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

   //================================================ Delete existing stock ========================================================//

   async deleteStock(req, res) {
      try {
         const { productId } = req.query;
         const response = await Stock.deleteOne({ itemID: productId });
         console.log(response)
         if (response.deletedCount === 1) {
            res.status(200).send("Success");
         } else {
            res.status(400).send("Failed to delete your stock");
         };
      } catch (error) {
         console.log("Delete stock error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

   //================================================ Search stocks in backend ========================================================//

   async searchStock(req, res) {
      try {
         const searchData = req.query.searchData;
         const response = await Stock.find({
            ownerID: req.user_id,
            $or: [
               { itemName: { $regex: searchData, $options: 'i' } },
               { description: { $regex: searchData, $options: 'i' } }
            ]
         });
         res.status(200).json(response);
      } catch (error) {
         console.error(error);
         res.status(500).send("Something went wrong, please try again later.");
      }
   }

   //================================================ Customer management ========================================================//
   //================================================ Get customer details ========================================================//

   async getCustomer(req, res) {
      try {
         const response = await Customer.find({ ownerID: req.user_id }, { _id: 0, ownerID: 0 });
         res.status(200).json(response);
      } catch (error) {
         console.log("Get customer error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

   //================================================ Create new customer ========================================================//

   async creatCustomer(req, res) {
      try {
         const { customerName, customerAddress, customerPhone } = req.body;
         const newCustomer = {
            ownerID: req.user_id,
            customerID: uuid().toString(),
            customerName: customerName,
            customerAddress: customerAddress,
            customerPhone: customerPhone,
         };
         const isCreated = await Customer.create(newCustomer);
         if (isCreated) {
            res.status(201).json(newCustomer);
         } else {
            res.status(400).send("Failed to create customer");
         };
      } catch (error) {
         console.log("Create customer error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

   //================================================ Delete existing customer ========================================================//

   async deleteCustomer(req, res) {
      try {
         const { customerId } = req.query;
         const response = await Customer.deleteOne({ customerID: customerId });
         if (response.deletedCount === 1) {
            res.status(200).send("Success");
         } else {
            res.status(400).send("Failed to delete customer");
         };
      } catch (error) {
         console.log("Delete customer error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

   //================================================ Sales mangement ========================================================//
   //================================================ Get sales list ========================================================//

   async getSales(req, res) {
      try {
         const response = await Sale.find({ ownerID: req.user_id }, { _id: 0, ownerID: 0 });
         res.status(200).json(response);
      } catch (error) {
         console.log("Get sales error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

   //================================================ Get sales list ========================================================//

   async createSale(req, res) {
      try {
         const { customerName, productName, productID, quantity, price } = req.body;
         const today = new Date();
         const newSaleDetails = {
            ownerID: req.user_id,
            saleID: uuid().toString(),
            customerName: customerName,
            productName: productName,
            quantity: parseInt(quantity),
            price: parseInt(price),
            date: `${today.toLocaleDateString()}, ${today.toLocaleTimeString()}`
         };
         const [productUpdation, salesCreation] = await Promise.all([
            Stock.updateOne({ itemID: productID }, { $inc: { quantity: -quantity } }),
            Sale.create(newSaleDetails)
         ]);
         if (productUpdation.modifiedCount === 1 && salesCreation) {
            res.status(200).json(newSaleDetails);
         } else {
            res.status(400).send("Failed to create new order");
         };
      } catch (error) {
         console.log("Get sales error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

   async logout(req, res) {
      try {
         res.clearCookie("AccessToken", { httpOnly: true });
         res.clearCookie("RefreshToken", { httpOnly: true });
         res.status(200).send('Logged out successfully');
      } catch (error) {
         console.log("Logout error", error);
         res.status(500).send("Something wrong please try again later")
      };
   };

};

export default Controller;