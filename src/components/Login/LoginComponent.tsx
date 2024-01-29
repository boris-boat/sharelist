import React, { useState } from "react";
import "./loginComponentstyles.css";
import { loginUser } from "@/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { pb } from "@/lib/pb";
export const LoginComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const user = useSelector((state) => state.user.userData);

  const handleLogin = () => {
    dispatch(loginUser({ username, password }))
      .then((resultAction) => {
        if (resultAction?.payload?.token) {
          navigate("/home");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
      });
  };

  if (isLogin) {
    return (
      <div>
        <form className="form">
          <p className="form-title">Sign in to your account</p>
          <div className="input-container">
            <input
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="submit"
            onClick={(e) => {
              e.preventDefault();
              handleLogin();
              setPassword("");
              setUsername("");
            }}
          >
            Login
          </button>
          <p className="signup-link">
            No account?
            <a onClick={() => setIsLogin(false)}>Sign up</a>
          </p>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <form className="form">
          <p className="form-title">Create an account</p>
          <div className="input-container">
            <input
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="submit"
            onClick={async (e) => {
              e.preventDefault();
              const record = await pb
                .collection("users")
                .create({ username, password, passwordConfirm: password });
              console.log(record);
              if (record) {
                setIsLogin(true);
              }
              setPassword("");
              setUsername("");
            }}
          >
            Create
          </button>
          <p className="signup-link">
            Have an account?
            <a onClick={() => setIsLogin(true)}>Login</a>
          </p>
        </form>
      </div>
    );
  }
};
