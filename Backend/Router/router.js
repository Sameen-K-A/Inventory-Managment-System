import { Router } from "express";
import Controller from "../Controller/controller.js";
import { verifyAccessToken } from "../Config/jwtConfig.js";

const router = Router();
const controller = new Controller();

// auth managment
router.post("/login", (req, res) => controller.login(req, res));
router.post("/register", (req, res) => controller.register(req, res));
router.get("/logout", (req, res) => controller.logout(req, res));

// stock management
router.get("/stock", verifyAccessToken, (req, res) => controller.getStock(req, res));
router.post("/stock", verifyAccessToken, (req, res) => controller.creatStock(req, res));
router.patch("/stock", verifyAccessToken, (req, res) => controller.editStock(req, res));
router.delete("/stock", verifyAccessToken, (req, res) => controller.deleteStock(req, res));

// stock search management
router.get('/search', verifyAccessToken, (req, res) => controller.searchStock(req, res));

// Customer management
router.get("/customer", verifyAccessToken, (req, res) => controller.getCustomer(req, res));
router.post("/customer", verifyAccessToken, (req, res) => controller.creatCustomer(req, res));
router.delete("/customer", verifyAccessToken, (req, res) => controller.deleteCustomer(req, res));

// Sales management
router.get("/sales", verifyAccessToken, (req, res) => controller.getSales(req, res))
router.post("/sales", verifyAccessToken, (req, res) => controller.createSale(req, res))

export default router;