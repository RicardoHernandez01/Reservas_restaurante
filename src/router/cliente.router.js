
const router = require('express').Router();
const {body, param, validationResult} = require('express-validator');
const { Op } = require('sequelize');

const Clientes = require('../model/cliente.model')


function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

router.get('/clientes',async (req,res)=>{
    const  clientes = await Clientes.findAll();
    res.status(200).json({
        ok:true,
        status:200,
        body: clientes
    })
});

router.get('/clientes/:cliente_id',async (req, res)=>{
    const id = req.params.cliente_id;
    const cliente = await Clientes.findOne({
        where:{
            cliente_id: id
        }
    });
    res.status(200).json({
        ok: true,
        status:200,
        body: cliente
    })
});

router.post('/clientes', [
    body('cliente_nombre').isString().withMessage('El nombre es obligatorio y debe ser una cadena de texto.'),
    body('cliente_email').isEmail().withMessage('Debe proporcionar un correo electrónico válido.'),
    body('cliente_password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('cliente_telefono').isMobilePhone().withMessage('Debe proporcionar un número de teléfono válido.'),
    body('cliente_notas').optional().isString().withMessage('Las notas deben ser una cadena de texto.'),
    handleValidationErrors
], async (req,res)=>{
    const dataCliente = req.body;
    await Clientes.sync();
    const createCliente = await Clientes.create({
        cliente_nombre: dataCliente.cliente_nombre,
        cliente_email: dataCliente.cliente_email,
        cliente_password: dataCliente.cliente_password,
        cliente_telefono: dataCliente.cliente_telefono,
        cliente_notas: dataCliente.cliente_notas,
        cliente_fecha_registro: dataCliente.cliente_fecha_registro
    });
    res.status(201).json({
        ok:true,
        status:201,
        message: 'Created table'
    })

});


router.put('/clientes/:cliente_id',[
    param('cliente_id').isInt({ gt: 0 }).withMessage('El cliente_id debe ser un número entero positivo.'),
    body('cliente_nombre').optional().isString().withMessage('El nombre debe ser una cadena de texto.'),
    body('cliente_email').optional().isEmail().withMessage('Debe proporcionar un correo electrónico válido.'),
    body('cliente_password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
    body('cliente_telefono').optional().isMobilePhone().withMessage('Debe proporcionar un número de teléfono válido.'),
    body('cliente_notas').optional().isString().withMessage('Las notas deben ser una cadena de texto.'),
    handleValidationErrors
],
async (req, res)=>{
    const id = req.params.cliente_id;
    const dataCliente = req.body;
    const updateCliente = await Clientes.update({
        cliente_nombre: dataCliente.cliente_nombre,
        cliente_email: dataCliente.cliente_email,
        cliente_password: dataCliente.cliente_password,
        cliente_telefono: dataCliente.cliente_telefono,
        cliente_notas: dataCliente.cliente_notas,
    },{
        where: {
            cliente_id: id
        }
    });
    res.status(200).json({
        ok:true,
        status:200,
        body: updateCliente
    });
});


router.delete('/clientes/:cliente_id',async(req, res)=>{
    const id = req.params.cliente_id;
    const deleteCliente = await Clientes.destroy({
        where: {
            cliente_id: id
        }
    });
    res.status(204).json({
        ok: true,
        status:204,
        body:deleteCliente
    });
});

module.exports = router;