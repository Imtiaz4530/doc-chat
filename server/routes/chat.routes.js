import express from "express";
import { getChats, postChatMessage } from "../controllers/chat.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getChats);
router.post("/", protectRoute, postChatMessage);

export default router;
