/* eslint-disable react-refresh/only-export-components */
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import groupReducer from "./groupSlice";
import listsReducer from "./listsSlice";
import modalReducer from "./modalSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    group: groupReducer,
    lists: listsReducer,
    modal: modalReducer,
  },
});
