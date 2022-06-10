const express = require("express");
const conexion = require("../config/conexion")
const config = require("../config/general")
const router = express.Router()

router.get(config.servidor + '/listarjornadas', function (req, res) {
    const sql = "select * from t_jornadas order by 1 asc"
    conexion.query(sql, function (err, rows) {
        if (!err) {
            res.status(200).send(rows)
        } else {
            res.json({
                message: "Error Listando : " + err,
                status: 500
            })
        }

    })
});

module.exports = router;
