import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { ALL_BOOKS, LOGIN, ME } from "../queries";

const Login = ({ show, setToken }) => {
  const [login, result] = useMutation(LOGIN, {
    refetchQueries: [{ query: ME }, { query: ALL_BOOKS }],
    onError: () => {},
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      localStorage.setItem("user-token", token);
      setUsername("");
      setPassword("");
      setToken(token);
    }
  }, [result.data]); // eslint-disable-line
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      login({
        variables: {
          username,
          password,
        },
      });
    } catch (ex) {
      console.log(ex);
    }
  };
  if (!show) return null;
  return (
    <div>
      <form onSubmit={handleLogin}>
        username{" "}
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        password{" "}
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <input type="submit" value="login" />
      </form>
    </div>
  );
};

export default Login;
