
const Header = ({ course }) => <h1>{course}</h1>
const Total = ({ sum }) => <b>Total of {sum} exercises</b>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>


const Course = (props) => {
  const {name, parts} = props.course;
  return (
    <>
    <Header course={name}/>
    {parts.map((i) => <Part part={i} key={i.id}/>)}
    <Total sum={parts.reduce((p, n) => p + n.exercises, 0)}/>
    </>
  )

}

export default Course
