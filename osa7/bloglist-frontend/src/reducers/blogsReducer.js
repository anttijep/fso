import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { setNotification } from "./notificationReducer";

const sortfunc = (b, b2) => {
  return b2.likes - b.likes;
};
const blogsReducer = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    addBlog(state, action) {
      const newstate = state.concat(action.payload);
      newstate.sort(sortfunc);
      return newstate;
    },
    setBlogs(state, action) {
      action.payload.sort(sortfunc);
      return action.payload;
    },
    likeBlog(state, action) {
      const newstate = state.filter((b) => b.id !== action.payload.id);
      newstate.push({ ...action.payload, likes: action.payload.votes + 1 });
      newstate.sort(sortfunc);
      return newstate;
    },
    removeBlog(state, action) {
      return state.filter((b) => b.id !== action.payload.id);
    },
    replaceBlog(state, action) {
      const newstate = state.filter((b) => b.id !== action.payload.id);
      newstate.push(action.payload);
      newstate.sort(sortfunc);
      return newstate;
    },
  },
});

const { addBlog, setBlogs, removeBlog, replaceBlog } = blogsReducer.actions;

export const initBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    return dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog, onSuccess) => {
  return async (dispatch) => {
    try {
      const resp = await blogService.create(blog);
      dispatch(addBlog(resp));
      dispatch(
        setNotification(`a new blog ${resp.title} by ${resp.author} added`)
      );
      onSuccess();
    } catch (exp) {
      dispatch(
        setNotification(`Failed to add new blog ${exp.response.data.error}`)
      );
    }
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    try {
      const editblog = { ...blog, likes: blog.likes + 1 };
      const resp = await blogService.update(editblog);
      dispatch(replaceBlog(resp));
    } catch (exp) {
      dispatch(setNotification(`Failed to like blog ${blog.title}`));
      if (exp.response.status === 404) {
        dispatch(removeBlog(blog));
      }
    }
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.deleteblog(blog);
      dispatch(removeBlog(blog));
      dispatch(setNotification(`Deleted blog ${blog.title} by ${blog.author}`));
    } catch (exp) {
      dispatch(setNotification(`Failed to delete blog ${blog.title}`));
      if (exp.response.status === 404) {
        dispatch(removeBlog(blog));
      }
    }
  };
};

export const addcomment = (blog, comment) => {
  return async (dispatch) => {
    try {
      const newblog = await blogService.addComment(blog, comment);
      dispatch(replaceBlog(newblog));
      dispatch(setNotification(`Added comment ${comment} to ${blog.title}`));
    } catch (ex) {
      dispatch(setNotification(`Failed to add comment ${comment}`, true));
      if (ex.response.status === 404) {
        dispatch(removeBlog(blog));
      }
    }
  };
};

export default blogsReducer.reducer;
