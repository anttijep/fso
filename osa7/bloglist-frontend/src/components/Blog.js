import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { addcomment } from "../reducers/blogsReducer";
import { useDispatch } from "react-redux";
import { useState } from "react";

import Button from "react-bootstrap/Button";
import { Container, ListGroup } from "react-bootstrap";

const Blog = ({ blog, onLike, onDelete, isDeletable, expand = false }) => {
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const small = () => {
    return (
      <Link id={`link${blog.id}`} to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    );
  };

  const deleteButton = (blog) => (
    <Button
      variant="danger"
      id={blog.id + "remove"}
      onClick={() => onDelete(blog)}
    >
      remove
    </Button>
  );

  const handleAdd = () => {
    dispatch(addcomment(blog, comment));
    setComment("");
  };

  const showcomments = () => {
    return (
      <div>
        <ListGroup>
          {blog.comments.map((c, i) => (
            <ListGroup.Item as="li" key={i}>
              {c}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  };

  const all = () => {
    return (
      <Container>
        <div className="blogs">
          <h2>
            {blog.title} {blog.author}
          </h2>
          <div className="blog-info">
            <div>
              <a href={blog.url}>{blog.url}</a>
            </div>
            <div>
              likes {blog.likes}{" "}
              <Button id={blog.id + "like"} onClick={() => onLike(blog)}>
                like
              </Button>
            </div>
            <div>added by {blog.user.name}</div>
            <div>{isDeletable && deleteButton(blog)}</div>
          </div>
          <h2>comments</h2>
          <div>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ marginRight: 3 }}
            />
            <Button onClick={handleAdd}>add comment</Button>
          </div>
          {(blog.comments && blog.comments.length && showcomments()) || null}
        </div>
      </Container>
    );
  };

  return <div>{(expand && all()) || small()}</div>;
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeletable: PropTypes.bool.isRequired,
};

export default Blog;
