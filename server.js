const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const postgres = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'biggie',
      password : '',
      database : 'smart-brain'
    }
  });

  console.log(postgres.select('*').from('users'));
const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    // Dummy Database for now//
    users: [
        {
            id: '123',
            name: 'Cole',
            email: 'cole@gmail.com',
            password: 'bit',
            entries: 0,
            joined: new Date()
        },
        {
            id: '619',
            name: 'Chuck',
            email: 'chuck@gmail.com',
            password: 'bits',
            entries: 0,
            joined: new Date()
        },
    ],
    login: [
        {
            id: '305',
            hash: '',
            email: 'cole@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
})

// Sign In //
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
        res.json('success');
        // res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in')
    }
})


// Register //
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
  
    database.users.push({
        id: '511',
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

// Get UserID //
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if(!found) {
        res.status(400).json('user not found');
    }
})


// Get Image ID //
app.put('/image', (req,res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if(!found) {
        res.status(400).json('user not found');
    }
})


app.listen(3000, ()=> {
    console.log('App running on port 3000');
})


/*
/ Root Route --> res =this works
/ Sign In Route --> POST Request (because we're posting JSON) (success/fail)
/ Register --> POST Request (return new created user)
/Profile/:userID --> GET Request = user
/image --> PUT --> user
*/