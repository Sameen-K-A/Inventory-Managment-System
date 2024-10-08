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
         const newCustomerOwner = new Customer({
            owner: newUser._id,
         });
         const newSales = new Sale({
            owner: newUser._id,
         });

         await Promise.all([newUser.save(), newStockOwner.save(), newCustomerOwner.save(), newSales.save()]);
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
         const response = await Stock.findOne({ owner: req.user_id }, { stocks: 1, _id: 0 });
         res.status(200).json({ stocks: response.stocks });
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
            id: uuid().toString(),
            itemName: itemName,
            description: description,
            price: parseInt(price),
            quantity: parseInt(quantity),
         };
         const isCreated = await Stock.updateOne({ owner: req.user_id }, { $push: { stocks: newStock } });
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

   //================================================ Edit existing stock ========================================================//

   async editStock(req, res) {
      try {
         const { id, itemName, description, price, quantity } = req.body;
         const response = await Stock.updateOne(
            { owner: req.user_id, "stocks.id": id },
            {
               $set: {
                  "stocks.$.itemName": itemName,
                  "stocks.$.description": description,
                  "stocks.$.price": parseFloat(price),
                  "stocks.$.quantity": parseInt(quantity)
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
         const { productId } = req.body;
         const response = await Stock.updateOne({ owner: req.user_id }, { $pull: { stocks: { id: productId } } });
         if (response.modifiedCount === 1) {
            res.status(200).send("Success");
         } else {
            res.status(400).send("Failed to delete your stock");
         };
      } catch (error) {
         console.log("Delete stock error", error);
         res.status(500).send("Something went wrong, please try again later.");
      };
   };

   //================================================ Customer management ========================================================//
   //================================================ Get customer details ========================================================//

   async getCustomer(req, res) {
      try {
         const response = await Customer.findOne({ owner: req.user_id }, { customers: 1, _id: 0 });
         res.status(200).json({ customers: response.customers });
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
            id: uuid().toString(),
            customerName: customerName,
            customerAddress: customerAddress,
            customerPhone: customerPhone,
         };
         const isCreated = await Customer.updateOne({ owner: req.user_id }, { $push: { customers: newCustomer } });
         if (isCreated.modifiedCount === 1) {
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
         const { customerId } = req.body;
         const response = await Customer.updateOne({ owner: req.user_id }, { $pull: { customers: { id: customerId } } });
         if (response.modifiedCount === 1) {
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
         const response = await Sale.findOne({ owner: req.user_id }, { _id: 0, sales: 1 });
         res.status(200).json({ sales: response.sales });
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
            id: uuid().toString(),
            customerName: customerName,
            productName: productName,
            quantity: quantity,
            price: price,
            date: `${today.toLocaleTimeString()}, ${today.toLocaleDateString()}`
         };
         const [productUpdation, salesCreation] = await Promise.all([
            Stock.updateOne({ owner: req.user_id, 'stocks.id': productID }, { $inc: { 'stocks.$.quantity': -quantity } }),
            Sale.updateOne({ owner: req.user_id }, { $push: { sales: newSaleDetails } })
         ]);
         if (productUpdation.modifiedCount === 1 && salesCreation.modifiedCount === 1) {
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