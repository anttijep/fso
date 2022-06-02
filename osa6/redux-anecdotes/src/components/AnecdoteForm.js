import { createAnecdote } from "../reducers/anecdoteReducer"
import { connect } from "react-redux";

const AnecdoteForm = props => {

  const createHandler = (e) => {
    e.preventDefault();
    props.createAnecdote(e.target.content.value);
  };
  
  return (
    <div>
      <form onSubmit={createHandler}>
        <div><input name="content"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  );
}

const dp = {
  createAnecdote
}

export default connect(null, dp)(AnecdoteForm);
