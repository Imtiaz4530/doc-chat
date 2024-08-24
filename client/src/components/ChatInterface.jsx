// // src/components/ChatInterface.js
// import { useState, useEffect, useRef } from "react";
// import { useStoreState } from "easy-peasy";
// import io from "socket.io-client";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";
// import axiosInstance from "../../api/axiosInstance";
// import toast from "react-hot-toast";

// const socket = io("http://localhost:4000"); // Update this to your backend server URL

// // eslint-disable-next-line react/prop-types
// const ChatInterface = ({ doctorId }) => {
//   const { user } = useStoreState((state) => state.user);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const { data } = await axiosInstance.get(
//           `/api/chats?userId=${user._id}&doctorId=${doctorId}`
//         );
//         setMessages(data.messages);
//       } catch (e) {
//         toast.error(e.message);
//         console.log(e);
//       }
//     };

//     fetchMessages();

//     socket.on("chatMessage", (newMessage) => {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });

//     return () => {
//       socket.off("chatMessage");
//     };
//   }, [doctorId, user._id]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (message.trim()) {
//       const newMessage = {
//         userId: user._id,
//         sender: user._id,
//         content: message,
//         doctorId,
//       };

//       // Emit message to the Socket.io server
//       socket.emit("chatMessage", newMessage);

//       try {
//         await axiosInstance.post("/api/chats", newMessage);
//       } catch (e) {
//         toast.error(e.message);
//         console.error("Error sending message:", e);
//       }

//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//       setMessage("");
//     }
//   };

//   return (
//     <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
//       <Typography variant="h5" component="h2">
//         Chat
//       </Typography>
//       <Box
//         style={{ maxHeight: "400px", overflowY: "auto", marginBottom: "20px" }}
//       >
//         <List>
//           {messages.map((msg, index) => (
//             <ListItem key={index}>
//               <ListItemText
//                 primary={`${msg.sender === user._id ? "You" : "Doctor"}: ${
//                   msg.content
//                 }`}
//                 secondary={new Date(msg.timestamp).toLocaleTimeString()}
//               />
//             </ListItem>
//           ))}
//           <div ref={messagesEndRef} />
//         </List>
//       </Box>
//       <form onSubmit={sendMessage}>
//         <TextField
//           variant="outlined"
//           fullWidth
//           placeholder="Type a message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           style={{ marginTop: "10px" }}
//         >
//           Send
//         </Button>
//       </form>
//     </Paper>
//   );
// };

// export default ChatInterface;

import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import PropTypes from "prop-types";

import useChat from "../hooks/chat/useChat";

const ChatInterface = ({ doctorId }) => {
  const { messages, message, setMessage, sendMessage, messagesEndRef, user } =
    useChat(doctorId);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" component="h2">
        Chat
      </Typography>
      <Box
        sx={{
          maxHeight: "60vh",
          overflowY: "auto",
          mb: 2,
          "@media (max-width: 600px)": {
            maxHeight: "40vh",
          },
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${msg.sender === user._id ? "You" : "Doctor"}: ${
                  msg.content
                }`}
                secondary={new Date(msg.timestamp).toLocaleTimeString()}
              />
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>
      <form onSubmit={sendMessage}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-label="Type a message"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Send
        </Button>
      </form>
    </Paper>
  );
};

ChatInterface.propTypes = {
  doctorId: PropTypes.string,
};

export default ChatInterface;
