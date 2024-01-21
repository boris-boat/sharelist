import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import userReducer from "./redux/userSlice";
import groupReducer from "./redux/groupSlice";
import listsReducer from "./redux/listsSlice";
import { LoginComponent } from "./components/Login/LoginComponent.tsx";
const store = configureStore({
  reducer: combineReducers({
    user: userReducer,
    group: groupReducer,
    lists: listsReducer,
  }),
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginComponent />,
  },
  {
    path: "/home",
    element: <App />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>
);
