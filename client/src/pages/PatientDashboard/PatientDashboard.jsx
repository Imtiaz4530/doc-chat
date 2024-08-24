// import {
//   Container,
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Box,
//   Divider,
//   Button,
// } from "@mui/material";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
// import LoadingSpinner from "../../components/Common/LoadingSpinner";
// import useFetchAppointments from "../../hooks/fetchAppointments/useFetchAppointments";
// import { useState } from "react";

// import ChatModal from "../../components/ChatModal/ChatModal";

// const statusStyles = {
//   pending: {
//     borderLeft: "5px solid orange",
//   },
//   confirmed: {
//     borderLeft: "5px solid green",
//   },
//   completed: {
//     borderLeft: "5px solid blue",
//   },
//   cancelled: {
//     borderLeft: "5px solid red",
//   },
// };

// const PatientDashboard = () => {
//   const { appointments, loading } = useFetchAppointments();
//   const [selectedDoctorId, setSelectedDoctorId] = useState(null);
//   const [open, setOpen] = useState(false);

//   const handleOpen = (doctorId) => {
//     setSelectedDoctorId(doctorId);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedDoctorId(null);
//   };

//   return (
//     <Container maxWidth="md">
//       <Typography variant="h4" component="h1" gutterBottom>
//         Your Appointments
//       </Typography>
//       {loading ? (
//         <LoadingSpinner />
//       ) : (
//         <Box maxHeight="60vh" overflow="auto">
//           {appointments.length === 0 ? (
//             <Typography variant="body1" color="textSecondary">
//               You have no appointments.
//             </Typography>
//           ) : (
//             <Grid container spacing={2}>
//               {appointments.map((appointment) => (
//                 <Grid item xs={12} key={appointment._id}>
//                   <Card elevation={3} style={statusStyles[appointment.status]}>
//                     <CardContent>
//                       <Box display="flex" alignItems="center" mb={2}>
//                         <AssignmentIndIcon
//                           color="primary"
//                           style={{ marginRight: 8 }}
//                         />
//                         <Typography variant="h6">{`Dr. ${appointment.doctor.name}`}</Typography>
//                       </Box>
//                       <Box display="flex" alignItems="center" mb={1}>
//                         <CalendarTodayIcon
//                           color="action"
//                           style={{ marginRight: 8 }}
//                         />
//                         <Typography variant="body2">
//                           {`Date: ${new Date(
//                             appointment.date
//                           ).toLocaleDateString()}`}
//                         </Typography>
//                       </Box>
//                       <Box display="flex" alignItems="center" mb={1}>
//                         <AccessTimeIcon
//                           color="action"
//                           style={{ marginRight: 8 }}
//                         />
//                         <Typography variant="body2">
//                           {`Time: ${appointment.time}`}
//                         </Typography>
//                       </Box>
//                       <Typography variant="body2">{`Status: ${appointment.status}`}</Typography>
//                       <Divider sx={{ mt: 2 }} />
//                       {appointment.status === "confirmed" && (
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           onClick={() => handleOpen(appointment.doctor._id)}
//                         >
//                           Start Chat
//                         </Button>
//                       )}
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </Box>
//       )}
//       <ChatModal
//         open={open}
//         handleClose={handleClose}
//         doctorId={selectedDoctorId}
//       />
//     </Container>
//   );
// };

// export default PatientDashboard;

import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Divider,
  Button,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import useFetchAppointments from "../../hooks/fetchAppointments/useFetchAppointments";
import { useEffect, useState } from "react";

import ChatModal from "../../components/ChatModal";
import axiosInstance from "../../api/axiosInstance";

const statusStyles = {
  pending: {
    borderLeft: "5px solid orange",
  },
  confirmed: {
    borderLeft: "5px solid green",
  },
  completed: {
    borderLeft: "5px solid blue",
  },
  cancelled: {
    borderLeft: "5px solid red",
  },
};

const PatientDashboard = () => {
  const { appointments, loading } = useFetchAppointments();
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmationRequests, setConfirmationRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const fetchConfirmationRequests = async () => {
      try {
        const { data } = await axiosInstance.get("/api/confirmationRequest");
        setConfirmationRequests([data]);
        setLoadingRequests(false);
      } catch (error) {
        console.error("Error fetching confirmation requests:", error);
        setLoadingRequests(false);
      }
    };

    fetchConfirmationRequests();
  }, []);
  console.log(Array.isArray(confirmationRequests), confirmationRequests);
  const handleOpen = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDoctorId(null);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Your Appointments
      </Typography>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ maxHeight: "60vh", overflow: "auto" }}>
          {appointments.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              You have no appointments.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {appointments.map((appointment) => (
                <Grid item xs={12} key={appointment._id}>
                  <Card elevation={3} style={statusStyles[appointment.status]}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <AssignmentIndIcon
                          color="primary"
                          style={{ marginRight: 8 }}
                        />
                        <Typography variant="h6">{`Dr. ${appointment.doctor.name}`}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <CalendarTodayIcon
                          color="action"
                          style={{ marginRight: 8 }}
                        />
                        <Typography variant="body2">
                          {`Date: ${new Date(
                            appointment.date
                          ).toLocaleDateString()}`}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <AccessTimeIcon
                          color="action"
                          style={{ marginRight: 8 }}
                        />
                        <Typography variant="body2">
                          {`Time: ${appointment.time}`}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{`Status: ${appointment.status}`}</Typography>
                      <Divider sx={{ mt: 2 }} />
                      {appointment.status === "confirmed" && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpen(appointment.doctor._id)}
                          sx={{ mt: 2 }}
                        >
                          Start Chat
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
      <ChatModal
        open={open}
        handleClose={handleClose}
        doctorId={selectedDoctorId}
      />
      <Typography variant="h4" component="h1" gutterBottom>
        Confirmation Requests
      </Typography>
      {loadingRequests ? (
        <LoadingSpinner />
      ) : (
        <Box maxHeight="60vh" overflow="auto">
          {Array.isArray(confirmationRequests) &&
          confirmationRequests.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              You have no confirmation requests.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {Array.isArray(confirmationRequests) &&
                confirmationRequests.map((request) => (
                  <Grid item xs={12} key={request._id}>
                    <Card elevation={3} style={statusStyles[request.status]}>
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <AssignmentIndIcon
                            color="primary"
                            style={{ marginRight: 8 }}
                          />
                          <Typography variant="h6">{`Dr. ${request.doctorId.name}`}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                          <CalendarTodayIcon
                            color="action"
                            style={{ marginRight: 8 }}
                          />
                          <Typography variant="body2">
                            {`Date: ${new Date(
                              request.createdAt
                            ).toLocaleDateString()}`}
                          </Typography>
                        </Box>
                        <Typography variant="body2">{`Status: ${request.status}`}</Typography>
                        <Divider sx={{ mt: 2 }} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )}
        </Box>
      )}
    </Container>
  );
};

export default PatientDashboard;
