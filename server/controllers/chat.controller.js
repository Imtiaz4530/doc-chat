import mongoose from "mongoose";
import Chat from "../models/chat.model.js";

export const getChats = async (req, res) => {
  try {
    const { userId, doctorId } = req.query;

    if (!userId || !doctorId) {
      return res
        .status(400)
        .json({ error: "userId and doctorId are required" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(doctorId)
    ) {
      return res.status(400).json({ error: "Invalid userId or doctorId" });
    }

    const chat = await Chat.findOne({
      userId,
      doctorId,
    }).populate("messages.sender", "name");

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.status(200).json(chat || { messages: [] });
  } catch (e) {
    console.log("Error In Get Chats Controller ---> ", e.message);
    res.status(500).json({ error: "Internal server error!" });
  }
};

export const postChatMessage = async (req, res) => {
  try {
    const { userId, doctorId, sender, content } = req.body;

    if (!userId || !doctorId || !sender || !content) {
      return res
        .status(400)
        .json({ error: "userId, doctorId, sender, and content are required" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(doctorId) ||
      !mongoose.Types.ObjectId.isValid(sender)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid userId, doctorId, or sender" });
    }

    let chat = await Chat.findOne({
      userId,
      doctorId,
    });

    if (!chat) {
      chat = new Chat({
        userId,
        doctorId,
        messages: [],
      });
    }

    chat.messages.push({ sender, content });
    await chat.save();

    res.status(201).json(chat);
  } catch (e) {
    console.log("Error In Post Chat Message Controller ---> ", e.message);
    res.status(500).json({ error: "Internal server error!" });
  }
};
