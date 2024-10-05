import { Router } from "express";
import Controller from "../Controller/controller.js";
import { verifyAccessToken } from "../Config/jwtConfig.js";

const router = Router();
const controller = new Controller();

router.post("/login", (req, res) => controller.login(req, res));
router.post("/register", (req, res) => controller.register(req, res));

// stock management
router.get("/stock", verifyAccessToken, (req, res) => controller.getStock(req, res));
router.post("/stock", verifyAccessToken, (req, res) => controller.creatStock(req, res));
router.patch("/stock", verifyAccessToken, (req, res) => controller.editStock(req, res));
router.delete("/stock", verifyAccessToken, (req, res) => controller.deleteStock(req, res));

export default router;