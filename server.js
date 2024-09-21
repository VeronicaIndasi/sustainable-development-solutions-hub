const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); 
const bcrypt = require('bcrypt');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Sustainable Development Solutions Hub!');
});

app.post('/register', (req, res) => {
    const { name, email, username, password } = req.body;

    if (!name || !email || !username || !password) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send({ error: 'Password hashing error' });
        }

        const sql = 'INSERT INTO Users (name, email, username, password) VALUES (?, ?, ?, ?)';
        db.query(sql, [name, email, username, hashedPassword], (err, result) => {
            if (err) {
                return res.status(500).send({ error: 'Database error' });
            }
            res.send({ id: result.insertId, name, email, username });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM Users WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err || result.length === 0) {
            return res.status(401).send({ error: 'Invalid username or password' });
        }

        const user = result[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).send({ error: 'Invalid username or password' });
            }

            res.send({ message: 'Login successful', userId: user.id });
        });
    });
});

app.get('/users/:id', (req, res) => {
    console.log(`Fetching user with ID: ${req.params.id}`); 
    const sql = 'SELECT * FROM Users WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }
        if (result.length === 0) {
            return res.status(404).send({ error: 'User not found' }); 
        }
        res.send(result[0]); 
    });
});


app.post('/solutions', (req, res) => {
    const { title, description, user_id } = req.body;
    const sql = 'INSERT INTO Solutions (title, description, user_id) VALUES (?, ?, ?)';
    db.query(sql, [title, description, user_id], (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }
        res.send({ id: result.insertId, title, description, user_id });
    });
});

app.get('/solutions', (req, res) => {
    const sql = 'SELECT * FROM Solutions';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }
        res.send(results);
    });
});

app.post('/upvote', (req, res) => {
    const { solution_id, user_id } = req.body;
    const sql = 'INSERT INTO Votes (solution_id, user_id) VALUES (?, ?)';
    db.query(sql, [solution_id, user_id], (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }
        res.send({ message: 'Upvote recorded!' });
    });
});

app.post('/comment', (req, res) => {
    const { solution_id, user_id, text } = req.body;
    const sql = 'INSERT INTO Comments (solution_id, user_id, text) VALUES (?, ?, ?)';
    db.query(sql, [solution_id, user_id, text], (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }
        res.send({ message: 'Comment added!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
