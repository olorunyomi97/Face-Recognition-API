const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'biggie',
      password : '',
      database : 'smart-brain'
    }
  });
 
const app = express();


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users)
})

// Sign In //
app.post('/signin', (req, res) => { signin.handleSignin (req, res, db, bcrypt)})

// Register //
app.post('/register', (req, res) =>  { register.handleRegister (req, res, db, bcrypt)})

// Get UserID //
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('Not found')
        }
    })
    .catch(err => res.status(400).json('error getting user'))
})


// Get Image ID //
app.put('/image', (req,res) => {
    const { id } = req.body; 
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
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