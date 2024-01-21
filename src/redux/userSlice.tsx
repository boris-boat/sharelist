import { pb } from "@/lib/pb";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ username, password }) => {
    const user = await pb
      .collection("users")
      .authWithPassword(username, password);
    return user;
  }
);
export const userSlice = createSlice({
  name: "user",
  initialState: { userData: {} },
  reducers: {
    setUser(state, action) {
      state = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.userData = action.payload;
    });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
