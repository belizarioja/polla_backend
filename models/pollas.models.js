const express = require("express");
const conexion = require("../config/conexion")
const config = require("../config/general")
const router = express.Router()

router.post(config.servidor + '/mostrarpollas', function (req, res) {
    const { jornada } = req.body;

    const sql = "select * from t_jugadas where co_jornada = " + jornada + "  order by co_jugada asc"
    conexion.query(sql, [jornada], function (err, rows) {
        if (!err) {
            res.status(200).send(rows)
        } else {
            res.json({
                message: "Error Listando POLLAS : " + err,
                status: 500
            })
        }

    })
});
router.post(config.servidor + '/mostrarresultados', function (req, res) {
    const { jornada } = req.body;

    const sql = "select * from t_resultados where co_jornada = " + jornada + "  order by co_resultado asc"
    conexion.query(sql, [jornada], function (err, rows) {
        if (!err) {
            res.status(200).send(rows)
        } else {
            res.json({
                message: "Error Listando resultados : " + err,
                status: 500
            })
        }

    })
});
router.post(config.servidor + '/crearpolla', function (req, res) {
    const { jornada, jugador, carrera1, carrera2, carrera3, carrera4, carrera5, carrera6, usuario } = req.body;

    const sql = "insert into t_jugadas (co_jornada, co_usuario, tx_jugador, nu_carrera1, nu_carrera2, nu_carrera3, nu_carrera4, nu_carrera5, nu_carrera6) "
    const values = " values (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    conexion.query(sql + values, [jornada, usuario, jugador, carrera1, carrera2, carrera3, carrera4, carrera5, carrera6], function (err, rows) {
        if (!err) {
            res.status(200).send(rows)
        } else {
            res.json({
                message: "Error Creando POLLAS : " + err,
                status: 500
            })
        }

    })
});
router.post(config.servidor + '/crearresultado', function (req, res) {
    const { jornada, carrera, lugar1, lugar2, lugar3 } = req.body;

    const sql = "insert into t_resultados (co_jornada, nu_carrera, nu_lugar1, nu_lugar2, nu_lugar3) "
    const values = " values (?, ?, ?, ?, ?)"
    conexion.query(sql + values, [jornada, carrera, lugar1, lugar2, lugar3], function (err, rows) {
        if (!err) {
            res.status(200).send(rows)
        } else {
            res.json({
                message: "Error Creando Resultados : " + err,
                status: 500
            })
        }

    })
});

module.exports = router;
