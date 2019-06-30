import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({ handleFilter }) => (
  <div>
    filter shown with<input onChange={handleFilter} />
  </div>
)

const PersonForm = ({ addPerson, newName, handleNewName, newNumber, handleNewNumber }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNewName} /> <br />
      number: <input value={newNumber} onChange={handleNewNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Person = ({ person, handleDelete }) => (
  <div>
    {person.name} {person.number}
    <button onClick={() => handleDelete(person)}>delete</button>
  </div>
)

const Persons = ({ personsToShow, handleDelete }) => (
  personsToShow.map(person =>
    <Person key={person.name} person={person} handleDelete={handleDelete} />
  )
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const personsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)

  const handleFilter = (event) => {
    setFilter(event.target.value)
    setShowAll(false)
  }

  const handleNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const person = persons.find(person => person.name === newName)
    if (person !== undefined) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {

        const changedPerson = { ...person, number: newNumber }
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            setMessage(`Replaced ${returnedPerson.name}'s number`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setPersons(persons.filter(p => p.id !== person.id))
            setErrorMessage(`Information of ${person.name} has already been removed from server`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
      }
    }
    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage(`Added ${returnedPerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .del(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          setMessage(`Deleted ${person.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setPersons(persons.filter(p => p.id !== person.id))
          setErrorMessage(`Information of ${person.name} has already been removed from server`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={errorMessage} />
      <Filter handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNewName={handleNewName} newNumber={newNumber} handleNewNumber={handleNewNumber} />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App