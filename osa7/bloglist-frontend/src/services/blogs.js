import axios from "axios";
const baseUrl = "/api/blogs";

let usertoken = null;

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const setToken = (token) => {
  usertoken = token;
};

const create = async (data) => {
  const config = { headers: { Authorization: "bearer " + usertoken } };
  const resp = await axios.post(baseUrl, data, config);
  return resp.data;
};

const update = async (blog) => {
  const resp = await axios.put(baseUrl + "/" + blog.id, {
    ...blog,
    user: blog.user.id,
  });
  return resp.data;
};

const deleteblog = async (blog) => {
  const config = { headers: { Authorization: "bearer " + usertoken } };
  await axios.delete(baseUrl + "/" + blog.id, config);
};

const addComment = async (blog, comment) => {
  const config = { headers: { Authorization: "bearer " + usertoken } };
  const body = { comment };
  const ret = await axios.post(`${baseUrl}/${blog.id}`, body, config);
  return ret.data;
};

const blogServices = {
  getAll,
  setToken,
  create,
  update,
  deleteblog,
  addComment,
};
export default blogServices;
