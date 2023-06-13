const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const Users = require('./models/Users');

require('dotenv').config();

mongoose.connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

async function createUser() {
    const firstName = faker.person.firstName();

    const newUser = new Users({
        firstName,
        lastName: faker.person.lastName(),
        email: faker.internet.email({ firstName }),
        password: faker.internet.password({ length: 10 }),
        profilePicture: faker.image.avatar(),
    });

    await newUser.save();
    console.log(newUser);
}

createUser();
