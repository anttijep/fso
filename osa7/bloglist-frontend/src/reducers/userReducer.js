import { createSlice } from "@reduxjs/toolkit";
import { setNotification } from "./notificationReducer";
import login from "../services/login";
import blogService from "../services/blogs";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(_state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const userLogin = (creds) => {
  return async (dispatch) => {
    try {
      const ret = await login(creds);
      dispatch(setUser(ret));
      blogService.setToken(ret.token);
      window.localStorage.setItem("user", JSON.stringify(ret));
    } catch (exp) {
      dispatch(setNotification("wrong username or password", true));
    }
  };
};

export const userLogout = () => {
  return async (dispatch) => {
    dispatch(setUser(null));
    window.localStorage.removeItem("user");
    blogService.setToken(null);
  };
};

export const initUser = () => {
  return async (dispatch) => {
    const u = window.localStorage.getItem("user");
    if (u) {
      const usr = JSON.parse(u);
      dispatch(setUser(usr));
      blogService.setToken(usr.token);
    }
  };
};

export default userSlice.reducer;
