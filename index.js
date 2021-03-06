require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

app.use(express.static("build"));
app.use(cors());

morgan.token("type", (req) => {
  return JSON.stringify(req.body);
});
app.use(express.json());
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length] :type")
);

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
  Person.find().then((person) => {
    res.json(person);
  });
});

app.get("/info", (req, res) => {
  Person.find().then((person) => {
    return res.send(
      `<p>Phonebook has info for ${
        person.length
      } people</p><p>${new Date()}</p>`
    );
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(id).then((person) => {
    if (person) {
      return res.json(person);
    } else {
      return req.status(404).end();
    }
  });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res) => {
  const personInfo = req.body;
  Person.updateOne({ _id: req.params.id }, { number: personInfo.number })
    .then(() => {
      return res.status(200).send("Person info updated successfully");
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
});

app.post("/api/persons", (req, res, next) => {
  const personInfo = req.body;
  if (!personInfo.name || !personInfo.number) {
    return res
      .status(400)
      .json({ error: "request must include name and number!" });
  } else {
    const person = new Person({
      name: personInfo.name,
      number: personInfo.number,
    });
    person
      .save()
      .then((result) => {
        res.json(person);
      })
      .catch((error) => next(error));
  }
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
