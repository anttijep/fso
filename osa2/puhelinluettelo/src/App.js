import { useState } from 'react'

const Number = ({name, number}) => <p>{name} {number}</p>
const Filter = ({target, handler}) => <div>filter shown with <input value={target} onChange={handler}/></div>
const AllNumbers = ({persons, filter}) => persons.filter(p => p.name.toUpperCase().match(filter.toUpperCase())).map(p => <Number name={p.name} number={p.number} key={p.name}/>) 
const NumForm = ({newName, newNameHandler, newNumber, newNumberHandler, submitHandler}) =>
  <form>
    <div>
      name: <input value={newName} onChange={newNameHandler}/>
    </div>
    <div>number: <input value={newNumber} onChange={newNumberHandler}/></div>
    <div>
      <button type="submit" onClick={submitHandler}>add</button>
    </div>
  </form>

const App = () => {
   const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const click = (e) => {
    e.preventDefault();
    // tyhjät nimet / numerot?
    if (persons.find(e => e.name.toUpperCase() === newName.toUpperCase())) {
      alert(`${newName} is already added to phonebook`, newName);
      return;
    }
    setPersons(persons.concat({name:newName, number:newNumber}))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter target={filter} handler={(e) => setFilter(e.target.value)} />
      <h2>add a new</h2>
      <NumForm newName={newName} 
        newNameHandler={e => setNewName(e.target.value)}
        newNumber={newNumber} 
        newNumberHandler={e => setNewNumber(e.target.value)}
        submitHandler={click}/>
      <h2>Numbers</h2>
      <AllNumbers persons={persons} filter={filter}/>
    </div>
  )

}

export default App

