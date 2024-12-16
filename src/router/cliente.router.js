
const router = require('express').Router();
const {body, param, validationResult} = require('express-validator');
const { Op } = require('sequelize');
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const Clientes = require('../model/cliente.model')


// Clave secreta para firmar el token
const SECRET_KEY = "mi_clave_secreta"; // Cámbiala por una más segura en producción


function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
// Endpoint de inicio de sesión con JWT
router.post(
  "/login",
  [
      body("cliente_email").isEmail().withMessage("El email debe ser válido."),
      body("cliente_password")
          .notEmpty()
          .withMessage("La contraseña es obligatoria."),
      body("cliente_rol")
          .notEmpty()
          .withMessage("El rol del cliente es obligatorio."),
  ],
  handleValidationErrors,
  async (req, res) => {
      try {
          const { cliente_email, cliente_password, cliente_rol } = req.body;

          // Buscar el cliente por email, contraseña y rol
          const cliente = await Clientes.findOne({
              where: {
                  cliente_email,
                  cliente_password,
                  cliente_rol
              },
          });

          if (!cliente) {
              return res.status(404).json({
                  ok: false,
                  message: "Credenciales incorrectas o cliente no encontrado.",
              });
          }

          // Generar el token JWT
          const token = jwt.sign(
              {
                  cliente_id: cliente.cliente_id,
                  cliente_email: cliente.cliente_email,
                  cliente_nombre: cliente.cliente_nombre,
                  cliente_rol: cliente.cliente_rol,
              },
              SECRET_KEY, // Clave secreta desde el archivo .env
              {
                  expiresIn: process.env.JWT_EXPIRES_IN || "1h", // Tiempo de expiración del token
              }
          );

          // Inicio de sesión exitoso
          res.status(200).json({
              ok: true,
              message: "Inicio de sesión exitoso.",
              token,
              cliente: {
                  cliente_id: cliente.cliente_id,
                  cliente_nombre: cliente.cliente_nombre,
                  cliente_email: cliente.cliente_email,
                  cliente_telefono: cliente.cliente_telefono,
                  cliente_rol: cliente.cliente_rol,
                  cliente_notas: cliente.cliente_notas,
              },
          });
      } catch (error) {
          console.error("Error en el inicio de sesión:", error);
          res.status(500).json({
              ok: false,
              message: "Error en el inicio de sesión.",
          });
      }
  }
);

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
    body('cliente_rol').isString().withMessage("Debe ser una cadena de texto"),
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
        cliente_rol: dataCliente.cliente_rol,
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
    body('cliente_rol').isString().withMessage("Debe ser una cadena de texto"),
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
        cliente_rol: dataCliente.cliente_rol,
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