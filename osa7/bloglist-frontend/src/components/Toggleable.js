import { useState, useImperativeHandle, forwardRef } from "react";

import Button from "react-bootstrap/Button";

const Toggleable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  const Hide = () => setVisible(false);
  useImperativeHandle(ref, () => {
    return { Hide };
  });
  return (
    <div>
      <div style={hideWhenVisible}>
        <Button id="toggleshow" onClick={toggleVisibility}>
          show
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          variant="secondary"
          className="toggle-hide"
          onClick={toggleVisibility}
        >
          hide
        </Button>
      </div>
    </div>
  );
});

Toggleable.displayName = "Toggleable";
export default Toggleable;
