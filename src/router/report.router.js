//reporte de reservas por fecha.
//reporte de ocupacion de mesas 
//reporte de clientes frecuentes.

const router = require('express').Router();
const {body, param, validationResult} = require('express-validator');
const { Op } = require('sequelize');

const Report = require('../model/report.model');

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

//reporte de reservas por fecha
router.get('/reports/:reservation_id',(req,res)=>{

});

//reporte de ocupacion de mesas
router.get('/reports/:tabla_id',(req,res)=>{

});
//reporte de clientes frecuentes
router.get('/reports/:cliente_id',(req,res)=>{
    
});

module.exports = router;