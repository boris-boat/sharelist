import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import groupReducer from "./groupSlice";
import listsReducer from "./listsSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    group: groupReducer,
    lists: listsReducer,
  },
});