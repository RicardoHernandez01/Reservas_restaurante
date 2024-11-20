const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const cors = require('cors');




const tableRouter = require('../router/table.router');
const clienteRouter = require('../router/cliente.router');
const reservationsRouter = require('../router/reservation.router');
const reportRouter = require('../router/report.router');
const userRouter = require('../router/user.router');


const app = express();
app.use(cors());
app.use(morgan('dev'));



app.get('/', (req, res)=>{
    res.send('Bienvenidos a reservas de un restaurante');

});

//midelware
app.use(express.json());
app.use('/api', tableRouter);
app.use('/api',clienteRouter);
app.use('/api', reservationsRouter);
app.use('/api', userRouter);
app.use('/api',reportRouter);

module.exports = app;