import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";

const Notification = () => {
  const notification = useSelector((s) => s.notification);
  if (notification.msg) {
    return (
      <Alert id="message" style={notification.style}>
        {notification.msg}
      </Alert>
    );
  }
  return <></>;
};

export default Notification;
