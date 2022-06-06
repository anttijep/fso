import { createSlice } from "@reduxjs/toolkit";
import getUserList from "../services/users";

const userListSlice = createSlice({
  name: "userlist",
  initialState: [],
  reducers: {
    setUserList(_state, action) {
      return action.payload;
    },
  },
});

const { setUserList } = userListSlice.actions;

export const initUserList = () => {
  return async (dispatch) => {
    const users = await getUserList();
    dispatch(setUserList(users));
  };
};

export default userListSlice.reducer;
