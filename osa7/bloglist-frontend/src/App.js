import { useEffect, useRef } from "react";
import Blog from "./components/Blog";
import CreateBlog from "./components/CreateBlog";
import Toggleable from "./components/Toggleable";
import { useDispatch, useSelector } from "react-redux";
import Notification from "./components/Notification";
import {
  initBlogs,
  createBlog,
  likeBlog,
  deleteBlog,
} from "./reducers/blogsReducer";
import { initUser, userLogout } from "./reducers/userReducer";
import LoginForm from "./components/LoginForm";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { initUserList } from "./reducers/userListReducer";
import { useMatch, Link } from "react-router-dom";
import NavMenu from "./components/NavMenu";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Table } from "react-bootstrap";

const App = () => {
  const dispatch = useDispatch();
  const [blogs, user, userlist] = useSelector((s) => [
    s.blogs,
    s.user,
    s.userlist,
  ]);
  const navigate = useNavigate();
  const match = useMatch("/users/:id");
  const matchuser = match && userlist.find((u) => u.id === match.params.id);
  const matchb = useMatch("/blogs/:id");
  const matchblog = matchb && blogs.find((b) => b.id === matchb.params.id);

  useEffect(() => {
    dispatch(initBlogs());
    dispatch(initUser());
    dispatch(initUserList());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(userLogout());
  };

  const toggleHideRef = useRef();

  const handleCreate = (blog) => {
    dispatch(createBlog(blog, () => toggleHideRef.current.Hide()));
  };

  const handleLike = (blog) => {
    dispatch(likeBlog(blog));
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog));
      navigate("/");
    }
  };

  const blogroute = () => {
    return (
      <div>
        <div className="new-blog">
          <h3>create new</h3>
          <Toggleable ref={toggleHideRef}>
            <CreateBlog onCreateBlog={handleCreate} />
          </Toggleable>
        </div>
        <div className="all-blogs">
          <ListGroup>
            {blogs.map((blog) => (
              <ListGroupItem as="li" key={blog.id}>
                <Blog
                  blog={blog}
                  onLike={handleLike}
                  onDelete={handleDelete}
                  isDeletable={user.id === blog.user.id}
                />
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
      </div>
    );
  };

  if (user) {
    return (
      <div>
        <NavMenu handleLogout={handleLogout} />
        <h2>blog app</h2>
        <Notification />
        <Routes>
          <Route path="/" element={blogroute()} />
          <Route path="/blogs" element={<Navigate replace to="/" />} />
          <Route
            path="/users"
            element={
              <div>
                <Table>
                  <tbody>
                    <tr>
                      <th></th>
                      <th>blogs created</th>
                    </tr>
                    {userlist.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <Link to={`/users/${u.id}`}>{u.name}</Link>
                        </td>
                        <td>{u.blogs.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            }
          />
          <Route
            path="/users/:id"
            element={
              matchuser ? (
                <div>
                  <h2>{matchuser.name}</h2>
                  {(matchuser.blogs.length && (
                    <ul>
                      {matchuser.blogs.map((b) => (
                        <li key={b.id}>{b.title}</li>
                      ))}
                    </ul>
                  )) ||
                    null}
                </div>
              ) : null
            }
          />
          <Route
            path="/blogs/:id"
            element={
              matchblog ? (
                <Blog
                  blog={matchblog}
                  onLike={handleLike}
                  onDelete={handleDelete}
                  isDeletable={user.id === matchblog.user.id}
                  expand={true}
                />
              ) : null
            }
          />
        </Routes>
      </div>
    );
  }
  return (
    <div>
      <h1>Login</h1>
      <Notification style={{ color: "red" }} />
      <LoginForm />
    </div>
  );
};

export default App;
