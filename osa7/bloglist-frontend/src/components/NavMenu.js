import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import { Navbar, Nav, Container } from "react-bootstrap";

const NavMenu = ({ handleLogout }) => {
  const user = useSelector((s) => s.user);

  const loggedin = () => {
    return (
      <span>
        {`${user.name} logged in `}
        <Button onClick={handleLogout}>logout</Button>
      </span>
    );
  };

  return (
    <Navbar bg="light">
      <Container>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={"/"}>
              blogs
            </Nav.Link>
            <Nav.Link as={Link} to={"/users"}>
              users
            </Nav.Link>
          </Nav>
          {user && loggedin()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavMenu;
