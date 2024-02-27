import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pb } from "@/lib/pb";

export const getLists = createAsyncThunk(
  "lists/getlists",
  async (arg, { getState }) => {
    const currentState = getState();
    if (currentState.group?.currentGroup?.lists.length === 0) {
      return [];
    }
    if (currentState.group.currentGroup.lists) {
      const lists = await pb.collection("list").getFullList({
        filter: currentState.group?.currentGroup?.lists
          .map((listId) => `id = '${listId}'`)
          .join("||"),
      });
      return lists;
    }
    return;
  }
);

export const listsSlice = createSlice({
  name: "lists",
  initialState: {},
  reducers: {
    setLists(state, action) {
      state.lists = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLists.fulfilled, (state, action) => {
        state.lists = action.payload;
      })
      .addCase(getLists.rejected, (state, action) => {});
  },
});

export const { setLists } = listsSlice.actions;

export default listsSlice.reducer;
