const router = require('express').Router();
const {body, param, validationResult} = require('express-validator');
const { Op } = require('sequelize');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const Users = require('../model/user.model')

//clave secreta para firmal el token

const SECRET_KEY ="mi_clave_secreta_usuario";

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

router.get('/users',async (req,res)=>{
    const users = await Users.findAll();
    res.status(200).json({
        ok:true,
        status:200,
        body:users || []
    });
});

router.get('/users/:usuario_id',async (req,res)=>{
    const id = req.params.user_id;
    const user = await Users.findOne({
        where: {
            usuario_id: id
        }
    });
    res.status(200).json({
        ok:true,
        status:200,
        body: user
    });
});

router.post('/users',[
  body('usuario_nombre').isString().withMessage("l nombre es obligatorio y debe ser una cadena de texto"),
  body('usuario_email').isEmail().withMessage("Debe proprocionar un correo electronico valido"),
  body('usuario_password').isLength({min:4}).withMessage('la contraseña debe tener minimo 4 caracteres'),
  body('usuario_telefono').isLength({min: 10, max:12}),
  body('usuario_rol').isString().withMessage('Debe ingresar cadena de texto'),
  handleValidationErrors

], async (req,res)=>{
    const dataUser = req.body;
    await Users.sync();
    const createUsers = await Users.create({
        usuario_nombre: dataUser.usuario_nombre,
        usuario_email: dataUser.usuario_email,
        usuario_password: dataUser.usuario_password,
        usuario_telefono: dataUser.usuario_telefono,
        usuario_rol: dataUser.usuario_rol,
    });
    res.status(201).json({
        ok:true,
        status:201,
        message:"create user"
    })
});

router.put('/users/:usuario_id',async(req,res)=>{
    const id = req.params.usuario_id;
    const dataUser = req.body;
    const updateUser = await Users.update({
        usuario_nombre: dataUser.usuario_nombre,
        usuario_email: dataUser.usuario_email,
        usuario_password: dataUser.usuario_password,
        usuario_rol: dataUser.usuario_rol,
    },{
        where: {usuario_id: id}
    });
    res.status(200).json({
        ok:true,
        status:200,
        body: updateUser
    });

});

router.delete('/users/:usuario_id',async (req,res)=>{
    const id = req.params.usuario_id;
    const deleteUsers = await Users.destroy({
        where:{
            usuario_id: id
        }
    });

    res.status(204).json({
        ok: true,
        status: 204,
        message: "delete user"
    })
});

module.exports= router;