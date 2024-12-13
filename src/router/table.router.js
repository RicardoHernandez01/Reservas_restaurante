const router = require('express').Router();
const {body, param, validationResult} = require('express-validator');
const { Op } = require('sequelize');
const upload = require('../utils/upload')
const Tables = require('../model/table.model')


function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
//async sirve para crear un tabla en caso que no este creado o hacer una inserción si la tabla ya existe

router.get('/tables',async(req,res)=>{
    // res.send("ver todas la mesas");
    const tables = await Tables.findAll();
    res.status(200).json({
        ok:true,
        status:200,
        body: tables || []
    });
});

router.get('/tables/:table_id',async (req,res)=>{
    // res.send('ver detalle de una mesa');
    const id = req.params.table_id;
    const table = await Tables.findOne({
        where:{
            table_id: id
        }
    });
    res.status(200).json({
        ok: true,
        status:200,
        body: table
    })
});

//listar mesas disponibles por fecha y hora
router.post('/tables',[
    
    body('table_capacidad').isInt({ min: 1 }).withMessage('table_capacidad debe ser un número entero positivo'),
    body('table_ubicacion').isString().notEmpty().withMessage('table_ubicacion es obligatorio y debe ser una cadena de texto'),
    body('table_tipo').optional().isString().withMessage('table_tipo debe ser una cadena de texto'),
    body('table_estado').optional().isString().withMessage('table_estado debe ser una cadena de texto'),
    body('table_descripcion').optional().isString().withMessage('table_descripcion debe ser una cadena de texto'),
    body('table_disponibilidad').isString().withMessage('table_disponibilidad debe ser string)'),
    handleValidationErrors
], upload.single('table_img'),async(req,res)=>{
   try {
     //res.send('crear nueva tabla');
     const dataTables = req.body;
     const imagePath = req.file ? '/src/uploads/$(req.file.filename' : null;
     await Tables.sync();
     
     const createTable = await Tables.create({
         table_numero: dataTables.table_numero,
         table_capacidad: dataTables.table_capacidad,
         table_ubicacion: dataTables.table_ubicacion,
         table_tipo: dataTables.table_tipo,
         table_estado: dataTables.table_estado,
         table_descripcion: dataTables.table_descripcion,
         table_disponibilidad: dataTables.table_disponibilidad,
         table_image: imagePath,
     });
     res.status(201).json({
         ok: true,
         status: 201,
         message: 'Created table'
     });
    
   } catch (error) {
    console.error("Error al ingresar una mesa:", error);
    res.status(500).json({ ok: false, error: "Error al ingresar una mesa" });
   }
});

router.put('/tables/:table_id',[
    param('table_id').isInt().withMessage('table_id debe ser un número entero'),
    body('table_numero')
    .optional()
    .isInt({ min: 1 }).withMessage('table_numero debe ser un número entero positivo')
    .custom(async (value, { req }) => {
        const table_id = req.params.table_id;
        const existingTable = await Tables.findOne({
            where: {
                table_numero: value,
                table_id: { [Op.ne]: table_id } // Excluye la mesa que se está actualizando
            }
        });
        if (existingTable) {
            throw new Error('El numero de mesa ya está registrado, elige otro número.');
        }
        return true;
    }),
    body('table_capacidad').optional().isInt({ min: 1 }).withMessage('table_capacidad debe ser un número entero positivo'),
    body('table_ubicacion').optional().isString().notEmpty().withMessage('table_ubicacion debe ser una cadena de texto'),
    body('table_tipo').optional().isString().withMessage('table_tipo debe ser una cadena de texto'),
    body('table_estado').optional().isString().withMessage('table_estado debe ser una cadena de texto'),
    body('table_descripcion').optional().isString().withMessage('table_descripcion debe ser una cadena de texto'),
    body('table_disponibilidad').optional().isString().withMessage('table_disponibilidad debe ser una fecha en formato ISO8601 (YYYY-MM-DD)'),
    handleValidationErrors
],async (req,res)=>{
   try {
     // res.send('modificar una mesa específica');
     const id = req.params.table_id;
     const dataTables = req.body;
 
     const imagePath = req.file ? '/src/uploads/$(req.file.filename' : null;
     const updateTable = await Tables.update({
         table_numero: dataTables.table_numero,
         table_capacidad: dataTables.table_capacidad,
         table_ubicacion: dataTables.table_ubicacion,
         table_tipo: dataTables.table_tipo,
         table_estado: dataTables.table_estado,
         table_descripcion: dataTables.table_descripcion,
         table_disponibilidad: dataTables.table_disponibilidad,
         ...Op(imagePath && {table_image: imagePath})
     },{
         where: {table_id: id}
     });
     res.status(200).json({
         ok:true,
         status:200,
         body: updateTable
     });
   } catch (error) {
    console.error("Error al actualizar la mesa:", error);
    res.status(500).json({ ok: false, error: "Error al actualizar la mesa" });
   }
});

router.delete('/tables/:table_id',async (req,res)=>{
    // res.send('Eliminar una tabla');
    const id = req.params.table_id;
    const deleteTable = await Tables.destroy({
        where: {
            table_id: id
        }
    });

    res.status(204).json({
        ok: true,
        status:204,
        body:deleteTable
    })
});

module.exports = router;

