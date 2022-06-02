import { connect } from "react-redux";
import { setFilter } from "../reducers/filterReducer";

const Filter = props => {
  const handleChange = (event) => {
    // input-kentän arvo muuttujassa event.target.value
    props.setFilter(event.target.value);
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

const dispatchToProps = {
  setFilter
}

export default connect(null, dispatchToProps)(Filter);