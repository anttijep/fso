import { useState } from "react";

import PropTypes from "prop-types";
import { Form, Button } from "react-bootstrap";

const CreateBlog = ({ onCreateBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const handleCreate = async (e) => {
    e.preventDefault();
    if (await onCreateBlog({ title, author, url })) {
      setTitle("");
      setAuthor("");
      setUrl("");
    }
  };

  return (
    <Form onSubmit={handleCreate}>
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          as="input"
          id="ctitle"
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Author</Form.Label>
        <Form.Control
          as="input"
          id="cauthor"
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Url</Form.Label>
        <Form.Control
          as="input"
          id="curl"
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </Form.Group>
      <Button id="csubmit" type="submit">
        create
      </Button>
    </Form>
  );
};

CreateBlog.propTypes = {
  onCreateBlog: PropTypes.func.isRequired,
};

export default CreateBlog;
