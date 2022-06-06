import { createSlice } from "@reduxjs/toolkit";
const errStyle = { color: "red" };
const defStyle = { color: "green" };

const notificationSlice = createSlice({
  name: "notification",
  initialState: { msg: "", style: defStyle },
  reducers: {
    showNotification(_state, action) {
      return action.payload;
    },
    emptyNotification(state) {
      return { ...state, msg: "" };
    },
  },
});

let timeoutret = null;

export const setNotification = (notification, isError = false) => {
  const { showNotification, emptyNotification } = notificationSlice.actions;
  return async (dispatch) => {
    dispatch(
      showNotification({
        msg: notification,
        style: isError ? errStyle : defStyle,
      })
    );
    clearInterval(timeoutret);
    timeoutret = setTimeout(() => {
      dispatch(emptyNotification());
    }, 5000);
  };
};

export default notificationSlice.reducer;
