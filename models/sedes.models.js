const express = require("express");
const conexion = require("../config/conexion")
const config = require("../config/general")
const router = express.Router();

router.get(config.servidor + '/listarsedes', function (req, res) {
    const sql = "select * from t_sedes order by 1 asc "
    conexion.query(sql, function (err, rows) {
        if (!err) {
            res.status(200).send(rows)
        } else {
            res.json({
                message: "Error listando sedes : " + err,
                status: 500
            })
        }

    })
});
router.post(config.servidor + '/crearsede', function (req, res) {
    const { tx_sede } = req.body;
    const sql = "insert into t_sedes (tx_sede) values (?) "
    conexion.query(sql, [tx_sede], function (err, rows) {
        if (!err) {
            res.status(200).send(rows)
        } else {
            res.json({
                message: "Error creando sede : " + err,
                status: 500
            })
        }

    })
});

module.exports = router;
