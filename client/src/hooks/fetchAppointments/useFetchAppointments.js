import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";

const useFetchAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("/api/appointments/patient");
        const upcomingAppointments = response.data.filter(
          (appointment) =>
            appointment.status === "pending" ||
            appointment.status === "confirmed"
        );
        const pastAppointments = response.data.filter(
          (appointment) =>
            appointment.status === "completed" ||
            appointment.status === "cancelled"
        );
        const sortedUpcomingAppointments = upcomingAppointments.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        const sortedPastAppointments = pastAppointments.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        const sortedAppointments = [
          ...sortedUpcomingAppointments,
          ...sortedPastAppointments,
        ];
        setAppointments(sortedAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        toast.error("Failed to fetch appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return { appointments, loading };
};

export default useFetchAppointments;
