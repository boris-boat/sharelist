import React, { useEffect } from "react";
import { pb } from "@/lib/pb";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const AuthContext = ({ children }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (!user?.token || !pb.authStore.isValid) {
      navigate("/");
    }
  }, []);

  return children;
};
