import React from "react";
import "./loginComponentstyles.css";
import { loginUser } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export const LoginComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);

  const handleLogin = () => {
    dispatch(loginUser({ username: "boris", password: "12345678" }))
      .then((resultAction) => {
        if (resultAction?.payload?.token) {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  return (
    <div>
      <form className="form">
        <p className="form-title">Sign in to your account</p>
        <div className="input-container">
          <input placeholder="Enter email" />
          <span></span>
        </div>
        <div className="input-container">
          <input type="password" placeholder="Enter password" />
        </div>
        <button
          className="submit"
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          Login
        </button>
        <p className="signup-link">
          No account?
          <a href="">Sign up</a>
        </p>
      </form>
    </div>
  );
};
