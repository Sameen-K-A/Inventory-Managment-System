import { Router } from "express";
import Controller from "../Controller/controller.js";
const router = Router();
const controller = new Controller();

router.post("/login", (req, res) => controller.login(req, res));
router.post("/register", (req, res) => controller.register(req, res));

// stock management
router.get("/stock", (req, res) => controller.getStock(req, res));
router.post("/stock", (req, res) => controller.creatStock(req, res));
router.patch("/stock", (req, res) => controller.editStock(req, res));
router.delete("/stock", (req, res) => controller.deleteStock(req, res));

export default router;