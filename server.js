const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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


// const database = {
//     // Dummy Database for now/
//     users: [
//         {
//             id: '123',
//             name: 'Cole',
//             email: 'cole@gmail.com',
//             password: 'bit',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '619',
//             name: 'Chuck',
//             email: 'chuck@gmail.com',
//             password: 'bits',
//             entries: 0,
//             joined: new Date()
//         },
//     ],
//     login: [
//         {
//             id: '305',
//             hash: '',
//             email: 'cole@gmail.com'
//         }
//     ]
// }

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users)
})

// Sign In //
app.post('/signin', (req, res) => {
   db.select('email', 'hash').from('login')
   .where('email', '=' , req.body.email)
   .then(data => {
       const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
           return db.select('*').from('users')
           .where('email', '=', req.body.email)
           .then(user => {
            res.json(user[0])
           })
           .catch(err => res.status(400).json('unable to get user'))
       } else {
            res.status(400).json('wrong password')
       }
   })
   .catch(err => res.status(400).json('wrong credentials'))
})


// Register //
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('email and password already esixts'))
})

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
    // if(!found) {
    //     res.status(400).json('user not found');
    // }
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