const mongoose = require("mongoose");
const url = `mongodb+srv://fso:${process.argv[2]}@cluster0.kbs2nga.mongodb.net/phonebook?retryWrites=true&w=majority`;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model("Person", personSchema);

switch(process.argv.length) {
    case 3:
        Person.find({}).then(r => {
            r.forEach(p => console.log(`${p.name} ${p.number}`));
        })
        .catch(e => console.log(e))
        .finally(() => mongoose.connection.close());
        break;
    case 5:
        {
            const name = process.argv[3];
            const number = process.argv[4];

            const person = new Person({name, number});
            person.save().then(r => console.log(`added ${name} number ${number} to phonebook`))
            .catch(e => console.log(e))
            .finally(() => mongoose.connection.close());
        }
        break;
    default:
        console.log("usage: node mongo.js [password] [name] [number]");
        break;
}
