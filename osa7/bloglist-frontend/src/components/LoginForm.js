import { useState } from "react";
import { useDispatch } from "react-redux";
import { userLogin } from "../reducers/userReducer";
import Button from "react-bootstrap/Button";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(userLogin({ username, password }));
    setPassword("");
    setUsername("");
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button id="loginbutton" type="submit">
        login
      </Button>
    </form>
  );
};

export default LoginForm;
