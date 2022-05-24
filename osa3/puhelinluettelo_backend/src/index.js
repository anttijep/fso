const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.static("build"));

app.use(express.json());

var morgan = require("morgan");
morgan.token("data", (req, res) => {return JSON.stringify(req.body)});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

let database = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
];

app.get('/api/persons', (req, res) => {
    res.json(database);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = database.find(p => p.id === id);
    if (person) {
        res.json(person);
    }
    else {
        res.status(404).end();
    }
});

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${database.length} people<br/><br/> ${String(new Date())}</p>`);
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    database = database.filter(p => p.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const person = req.body;
    if (!person || !person.name || !person.number) {
        res.status(400).json({ error: "invalid data"});
        return;
    }
    if (database.find(p => p.name.toUpperCase() === person.name.toUpperCase())) {
        res.status(400).json({error: "name must be unique"});
        return;
    }
    const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const nperson = {...person, id:id};
    database.push(nperson);
    res.json(nperson);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


