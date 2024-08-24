import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {
  createAppointment,
  getAppointmentsForDoctor,
  getAppointmentsForUser,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", protectRoute, createAppointment);
router.get("/patient", protectRoute, getAppointmentsForUser);
router.get("/doctor", protectRoute, getAppointmentsForDoctor);

export default router;
