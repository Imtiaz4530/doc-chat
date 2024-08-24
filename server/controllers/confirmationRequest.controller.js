import ConfirmationRequest from "../models/confirmationRequest.model.js";

export const getConfirmationRequest = async (req, res) => {
  try {
    const requests = await ConfirmationRequest.findOne({
      patientId: req.user._id,
    }).populate("doctorId", "name");
    res.status(200).json(requests);
  } catch (e) {
    console.log(
      "Error In Get Confirmation Request Controller ---> ",
      e.message
    );
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const postConfirmationRequest = async (req, res) => {
  const { doctorId, appointmentId } = req.body;

  if (!doctorId || !appointmentId) {
    return res
      .status(400)
      .json({ error: "doctorId and appointmentId are required" });
  }

  try {
    const newRequest = new ConfirmationRequest({
      patientId: req.user._id,
      doctorId,
      appointmentId,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (e) {
    console.log(
      "Error In Post Confirmation Request Controller ---> ",
      e.message
    );
    res.status(500).json({ error: "Internal server error!" });
  }
};
