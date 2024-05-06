// src/app.js
const express = require('express');
// const { verifyTokenMiddleware } = require('./middlewares');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', routes);



app.get('/api/protected', (req, res) => {
    res.status(200).send('Welcome to hassan nadeem');
});

// app.get('/api/protected', verifyTokenMiddleware, (req, res) => {
//   res.status(200).send('Protected route');
// });

app.listen(3000, () => {
    console.log('Server 3000 port par chal raha hai');
});
