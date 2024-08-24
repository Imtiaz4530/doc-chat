// import { Modal, Box, Typography, IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import ChatInterface from "../../pages/ChatInterface/ChatInterface";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "80%",
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   maxHeight: "80vh",
//   overflow: "auto",
// };

// // eslint-disable-next-line react/prop-types
// const ChatModal = ({ open, handleClose, doctorId }) => {
//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box sx={style}>
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           mb={2}
//         >
//           <Typography id="modal-modal-title" variant="h6" component="h2">
//             Chat with Doctor
//           </Typography>
//           <IconButton onClick={handleClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//         <ChatInterface doctorId={doctorId} />
//       </Box>
//     </Modal>
//   );
// };

// export default ChatModal;

import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import ChatInterface from "./ChatInterface";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflow: "auto",
  borderRadius: 1,
};

const ChatModal = ({ open, handleClose, doctorId }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Chat with Doctor
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <ChatInterface doctorId={doctorId} />
      </Box>
    </Modal>
  );
};

ChatModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  doctorId: PropTypes.string,
};

export default ChatModal;
