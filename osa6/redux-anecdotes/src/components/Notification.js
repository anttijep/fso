import { connect } from "react-redux"

const Notification = props => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return (
    <div style={style}>
      {props.notification}
    </div>
  )
}

const stateToProps = (state) => {
  return {
    notification: state.notification
  }
}

export default connect(stateToProps)(Notification);