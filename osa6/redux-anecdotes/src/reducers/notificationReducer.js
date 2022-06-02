import { createSlice } from "@reduxjs/toolkit";


const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    showNotification(_state, action) {
      return action.payload;
    },
    emptyNotification() {
       return "";
    }
  }
})

let timeoutret = null;

export const setNotification = (notification, seconds) => {
  return async dispatch => {
    dispatch(showNotification(notification));
    clearInterval(timeoutret);
    timeoutret = setTimeout(() => {
      dispatch(emptyNotification());
    }, seconds * 1000);
  }
}

export const { showNotification, emptyNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
