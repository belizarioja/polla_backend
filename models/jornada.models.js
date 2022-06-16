const express = require("express");
const conexion = require("../config/conexion")
const config = require("../config/general")
const router = express.Router()
const moment = require('moment')

router.post(config.servidor + '/listarjornadas', function (req, res) {
    const { co_sede } = req.body;
    const sql = "select * from t_jornadas where co_sede = ? order by 1 asc"
    conexion.query(sql, [co_sede], function (err, rows) {
        if (!err) {
            res.status(200).send(rows)
        } else {
            res.json({
                message: "Error Listando jornada: " + err,
                status: 500
            })
        }

    })
});
router.post(config.servidor + '/crearjornada', function (req, res) {
    const { tx_jornada, co_sede } = req.body;
    const fe_jornada = moment().format('YYYY-MM-DD HH:mm:ss')
    const sql = "insert into t_jornadas (tx_jornada, fe_jornada, co_sede) values (?, ?, ?) "
    conexion.query(sql, [tx_jornada, fe_jornada, co_sede], function (err, rows) {
        if (!err) {
            res.status(200).send(rows)
        } else {
            res.json({
                message: "Error creando jornada : " + err,
                status: 500
            })
        }

    })
});
router.post(config.servidor + '/updateestatusjornada', function (req, res) {
    const { co_jornada, in_activa } = req.body;
    const update = "update t_jornadas "
    const set = " set in_activa = ? where co_jornada = ? "
    conexion.query(update + set, [in_activa, co_jornada], function (err, rows) {
        if (!err) {
            res.status(200).send(rows)
        } else {
            res.json({
                message: "Error actualizando jornada : " + err,
                status: 500
            })
        }

    })
});

module.exports = router;
