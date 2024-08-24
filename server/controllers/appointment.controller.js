import { body, validationResult } from "express-validator";
import Appointment from "../models/appointment.model.js";

export const createAppointment = async (req, res) => {
  await body("patient")
    .isString()
    .notEmpty()
    .withMessage("Patient ID is required")
    .run(req);
  await body("doctor")
    .isString()
    .notEmpty()
    .withMessage("Doctor ID is required")
    .run(req);
  await body("date").isISO8601().withMessage("Valid date is required").run(req);
  await body("time")
    .isString()
    .notEmpty()
    .withMessage("Time is required")
    .run(req);
  await body("reason").isString().optional().run(req);

  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { patient, doctor, date, time, reason } = req.body;
    // Validate date and time
    const appointmentDate = new Date(date);
    const appointmentTime = new Date(`${date}T${time}`);

    // Check if date is in the past
    if (appointmentDate < new Date()) {
      return res
        .status(400)
        .json({ error: "Cannot schedule appointments for past dates." });
    }
    // Optionally, check if time is in the past
    if (appointmentTime < new Date()) {
      return res
        .status(400)
        .json({ error: "Cannot schedule appointments for past times." });
    }

    const appointment = new Appointment({
      patient,
      doctor,
      date,
      time,
      reason,
    });

    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
  } catch (e) {
    console.log("Error In Create Appointment Controller ---> ", e.message);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getAppointmentsForUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const appointments = await Appointment.find({
      patient: userId,
    }).populate("doctor", "name");
    res.status(200).json(appointments);
  } catch (e) {
    console.log(
      "Error In Get Appointment For User Controller ---> ",
      e.message
    );
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const getAppointmentsForDoctor = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const appointments = await Appointment.find({
      doctor: doctorId,
    }).populate("patient", "name");
    res.status(200).json(appointments);
  } catch (e) {
    console.log(
      "Error In Create Appointment For User Controller ---> ",
      e.message
    );
    res.status(500).json({ error: "Internal server error!" });
  }
};
