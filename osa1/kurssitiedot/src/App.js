
const Header = (props) => {
  console.log(props)
  return (
  <h1>{props.course}</h1>
  )
}

const Part = (props) => {
  return (
    <p>{props.part} {props.count}</p>
  )
}

const Content = (props) => {
  let p = props.parts
  return (
    <div>
      <Part part={p[0]['name']} count={p[0]['exercises']}/>
      <Part part={p[1]['name']} count={p[1]['exercises']}/>
      <Part part={p[2]['name']} count={p[2]['exercises']}/>
    </div>
  )
}
const Total = (props) => {
  let count = 0
  props.parts.forEach(p => count += p['exercises'])
  return (
    <p>Number of exercises {count}</p>
    )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default App
