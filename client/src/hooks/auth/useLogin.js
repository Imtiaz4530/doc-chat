import { useState } from "react";
import { useStoreActions } from "easy-peasy";

import axiosInstance from "../../api/axiosInstance";

const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const setUser = useStoreActions((actions) => actions.user.setUser);
  const login = async (data, reset) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/login", data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      reset();
    } catch (e) {
      if (e.response) {
        const errorMessage =
          e.response.data?.message ||
          e.response.data?.error ||
          e.response.statusText ||
          "An error occurred";
        console.log(`Error: ${e.response.status} - ${errorMessage}`);
      } else if (e.request) {
        console.log("No response from server. Please try again later.");
      } else {
        console.log(`Error: ${e.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;
