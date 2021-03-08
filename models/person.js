const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);

// if (process.argv.length > 3) {
//   const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4],
//   });

//   person.save().then((result) => {
//     console.log(
//       `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
//     );
//     mongoose.connection.close();
//   });
// } else {
//   Person.find({}).then((result) => {
//     result.forEach((person) => {
//       console.log(`phonebook:
//       ${person.name} ${person.number}`);
//     });
//     mongoose.connection.close();
//   });
// }
