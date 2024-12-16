const router = require('express').Router();
const {body, param, validationResult} = require('express-validator');
const { Op } = require('sequelize');

const Reservations = require('../model/reservation.model');


function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.get('/reservations',async (req,res)=>{
    const reservacion = await Reservations.findAll();
    res.status(200).json({
        ok:true,
        status:200,
        body: reservacion
    });

});

router.get('/reservations/:reservation_id',async(req,res)=>{
    const id = req.params.reservation_id;
    const reservacion = await Reservations.findOne({
        where: {
            reservation_id: id
        }
    });
    res.status(200).json({
        ok: true,
        status:200,
        body: reservacion                                                                                                                                                                                                                                                                                                                                                                                        
    })
});

//reservacion por cliente
router.get('/reservations/clientes/:cliente_id',async(req,res)=>{
    const id = req.params.cliente_id;
    const reservacion = await Reservations.findOne({                                                                                                                     
        where: {
            cliente_id: id
        }
    });
    res.status(200).json({
        ok: true,
        status:200,
        body: reservacion
    })
});

//obtener reservaciones por fecha:
//obtener reservaciones por estado.
//obtener reservaciones de un cliente específico

router.post('/reservations', [
    body('table_id').isInt().withMessage('El ID de la mesa debe ser un número entero'),
    body('cliente_id').isInt().withMessage('El ID del cliente debe ser un número entero'),
    body('reservacion_fecha').isISO8601().toDate().withMessage('Fecha de reservación inválida'),
    body('reservacion_hora').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Hora de reservación inválida'),
    body('reservacion_num_personas').isInt({ min: 1 }).withMessage('Número de personas debe ser al menos 1'),
    body('reservacion_status').isIn(['Pendiente', 'Confirmado', 'Cancelado']).withMessage('Estado de la reservación inválido')
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            status: 400,
            errors: errors.array(),
        });
    }

    const dataReservacion = req.body;

    try {
        // Verificar si ya existe una reserva para la misma mesa y fecha
        const existingReservation = await Reservations.findOne({
            where: {
                table_id: dataReservacion.table_id,
                reservacion_fecha: dataReservacion.reservacion_fecha,
            },
        });

        if (existingReservation) {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: 'Ya existe una reserva para esta mesa en la misma fecha.',
            });
        }

        // Crear una nueva reservación
        const createReservacion = await Reservations.create({
            table_id: dataReservacion.table_id,
            cliente_id: dataReservacion.cliente_id,
            reservacion_fecha: dataReservacion.reservacion_fecha,
            reservacion_hora: dataReservacion.reservacion_hora,
            reservacion_num_personas: dataReservacion.reservacion_num_personas,
            reservacion_comentarios: dataReservacion.reservacion_comentarios,
            reservacion_alergias: dataReservacion.reservacion_alergias,
            reservacion_status: dataReservacion.reservacion_status,
        });

        return res.status(201).json({
            ok: true,
            status: 201,
            message: 'Reservación creada exitosamente',
            data: createReservacion,
        });

    } catch (error) {
        console.error('Error al procesar la reservación:', error);
        return res.status(500).json({
            ok: false,
            status: 500,
            message: 'Error interno del servidor',
            error: error.message,
        });
    }
});

router.put('/reservations/:reservation_id', [
    param('reservation_id').isInt().withMessage('El ID de la reservación debe ser un número entero'),
    body('table_id').optional().isInt().withMessage('El ID de la mesa debe ser un número entero'),
    body('cliente_id').optional().isInt().withMessage('El ID del cliente debe ser un número entero'),
    body('reservacion_fecha').optional().isISO8601().toDate().withMessage('Fecha de reservación inválida'),
    body('reservacion_hora').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Hora de reservación inválida'),
    body('reservacion_num_personas').optional().isInt({ min: 1 }).withMessage('Número de personas debe ser al menos 1'),
    body('reservacion_status').optional().isIn(['Pendiente', 'Confirmado', 'Cancelado']).withMessage('Estado de la reservación inválido')
],
handleValidationErrors,
async(req,res)=>{
    const id = req.params.reservation_id;
    const dataReservacion = req.body;

    //varificar si no hay una reservación para la mesa a la que quieren cambiar o fecha.
    if (dataReservacion.table_id && dataReservacion.reservacion_fecha && dataReservacion.reservacion_hora) {
        const existingReservation = await Reservations.findOne({
            where: {
                table_id: dataReservacion.table_id,
                reservacion_fecha: dataReservacion.reservacion_fecha,
                reservacion_hora: dataReservacion.reservacion_hora,
                reservation_id: { [Op.ne]: id } // Excluir la reservación actual de la búsqueda
            }
        });

        if (existingReservation) {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: 'Ya existe una reserva para esta mesa en la fecha y hora seleccionadas.'
            });
        }
    }


    const updateReservacion = await Reservations.update({
        table_id: dataReservacion.table_id,
        cliente_id:dataReservacion.cliente_id,
        reservacion_fecha: dataReservacion.reservacion_fecha,
        reservacion_hora: dataReservacion.reservacion_hora,
        reservacion_num_personas: dataReservacion.reservacion_num_personas,
        reservacion_comentarios: dataReservacion.reservacion_comentarios,
        reservacion_alergias: dataReservacion.reservacion_alergias,
        reservación_status: dataReservacion.reservacion_status,
    },{
        where: {reservation_id: id}
    });
    res.status(200).json({
        ok:true,
        status:200,
        body: updateReservacion
    });
});

router.delete('/reservations/:reservation_id', async (req, res) => {
    const id = req.params.reservation_id; // Usa el nombre correcto
    try {
        const deleteReservacion = await Reservations.destroy({
            where: {
                reservation_id: id, // Asegúrate de usar el campo correcto
            },
        });

        if (deleteReservacion === 0) {
            return res.status(404).json({
                ok: false,
                message: "No se encontró la reservación para eliminar.",
            });
        }

        res.status(204).json({
            ok: true,
            status: 204,
        });
    } catch (error) {
        console.error("Error al eliminar la reservación:", error);
        res.status(500).json({
            ok: false,
            message: "Error al eliminar la reservación.",
            error: error.message,
        });
    }
});

module.exports = router;