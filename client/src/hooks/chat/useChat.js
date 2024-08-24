import { useState, useEffect, useRef } from "react";
import { useStoreState } from "easy-peasy";
import io from "socket.io-client";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

const useChat = (doctorId) => {
  const { user } = useStoreState((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");

    const fetchMessages = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/chats?userId=${user._id}&doctorId=${doctorId}`
        );
        setMessages(data.messages);
      } catch (e) {
        toast.error(e.message);
        console.log(e);
      }
    };

    fetchMessages();

    // Handle incoming messages
    socketRef.current.on("chatMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [doctorId, user._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        userId: user._id,
        sender: user._id,
        content: message,
        doctorId,
      };

      // Emit message to the Socket.io server
      socketRef.current.emit("chatMessage", newMessage);

      try {
        await axiosInstance.post("/api/chats", newMessage);
      } catch (e) {
        toast.error(e.message);
        console.error("Error sending message:", e);
      }

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    }
  };

  return {
    messages,
    message,
    setMessage,
    sendMessage,
    messagesEndRef,
    user,
  };
};

export default useChat;
