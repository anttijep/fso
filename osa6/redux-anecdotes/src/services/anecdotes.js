import axios from "axios";


const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const resp = await axios.get(baseUrl);
  return resp.data;
}

const create = async (content) => {
  const resp = await axios.post(baseUrl, {content, votes:0})
  return resp.data;
}

const vote = async (anecdote) => {
  const resp = await axios.put(`${baseUrl}/${anecdote.id}`, {content: anecdote.content, votes: anecdote.votes + 1});
  return resp.data;
}

const defexp = { getAll, create, vote };

export default defexp;

