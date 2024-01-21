import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pb } from "@/lib/pb";

export const getLists = createAsyncThunk(
  "lists/getlists",
  async (arg, { getState }) => {
    const currentState = getState();
    if (currentState.group?.currentGroup?.lists.length === 0) {
      return [];
    }

    const lists = await pb.collection("list").getFullList({
      filter: currentState.group?.currentGroup?.lists
        .map((listId) => `id = '${listId}'`)
        .join("||"),
    });
    return lists;
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
// const lists = await pb.collection("list").getFullList({
//   filter: userGroups[0].lists
//     .map((listId) => `id ~ "${listId}"`)
//     .join("||"),
// });
// setLists(lists);
