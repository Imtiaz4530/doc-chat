import express from "express";

import {
  getConfirmationRequest,
  postConfirmationRequest,
} from "../controllers/confirmationRequest.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, getConfirmationRequest);
router.post("/", protectRoute, postConfirmationRequest);

export default router;
