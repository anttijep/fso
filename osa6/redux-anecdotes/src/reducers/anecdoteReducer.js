import { createSlice } from "@reduxjs/toolkit"
import anecService from "../services/anecdotes"
import { setNotification } from "../reducers/notificationReducer";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState : [],
  reducers: {
    addAnecdote(state, action) {
      state.push(action.payload);
    },
    incrementVote(state, action) {
      const newstate = state.map(a => a.id === action.payload ? {...a, votes: a.votes + 1} : a);
      newstate.sort((a, b) => b.votes - a.votes);
      return newstate;
    },
    setAnecdotes(_state, action) {
      action.payload.sort((a, b) => b.votes - a.votes);
      return action.payload;
    }
  }
})

export const { addAnecdote, incrementVote, setAnecdotes } = anecdoteSlice.actions

export const createAnecdote = content => {
  return async dispatch => {
    const ret = await anecService.create(content);
    dispatch(addAnecdote(ret));
    dispatch(setNotification(`created '${ret.content}'`, 5));
  }
}
export const voteAnecdote = anecdote => {
  return async dispatch => {
    await anecService.vote(anecdote);
    dispatch(incrementVote(anecdote.id));
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecService.getAll();
    dispatch(setAnecdotes(anecdotes));
  }
}
export default anecdoteSlice.reducer;
