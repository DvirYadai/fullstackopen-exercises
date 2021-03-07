const express = require("express");
const app = express();

app.use(express.json());

let phoneBook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  return res.json(phoneBook);
});

app.get("/info", (req, res) => {
  return res.send(
    `<p>Phonebook has info for ${
      phoneBook.length
    } people</p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const personInfo = phoneBook.find((info) => info.id === id);
  if (personInfo) {
    res.json(personInfo);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const personInfo = phoneBook.find((info) => info.id === id);
  if (personInfo) {
    phoneBook = phoneBook.filter((info) => info.id !== id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const personInfo = req.body;
  const personInfoObject = {
    id: idGenerator(),
    name: personInfo.name,
    number: personInfo.number,
  };

  phoneBook = phoneBook.concat(personInfoObject);
  res.json(personInfoObject);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function idGenerator() {
  return Math.floor(Math.random() * 1000) + 1;
}
