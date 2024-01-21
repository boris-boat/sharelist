import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { pb } from "@/lib/pb";

export const getGroups = createAsyncThunk(
  "group/getGroups",
  async (arg, { getState }) => {
    const currentState = getState();
    const userGroups = await pb.collection("listGroups").getFullList({
      filter: pb.filter(`usersParticipating.username ?= {:username}`, {
        username: currentState.user.userData.record.username,
      }),
    });
    return userGroups;
  }
);

export const groupSlice = createSlice({
  name: "group",
  initialState: {},
  reducers: {
    setCurrentGroup(state, action) {
      console.log("payload", action.payload);
      state.currentGroup = action.payload;
    },
    updateCurrentGroup(state, action) {
      state.currentGroup.lists = action.payload.lists;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGroups.pending, (state, action) => {})
      .addCase(getGroups.fulfilled, (state, action) => {
        state.userGroups = action.payload;
      })
      .addCase(getGroups.rejected, (state, action) => {});
  },
});

export const { setCurrentGroup, updateCurrentGroup } = groupSlice.actions;

export default groupSlice.reducer;
