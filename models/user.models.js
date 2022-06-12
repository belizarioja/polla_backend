const express = require("express");
const conexion = require("../config/conexion")
const config = require("../config/general")
const router = express.Router();
const moment = require('moment')

router.get(config.servidor + '/', function (req, res) {
    res.json({
        message: 'Conexion válida.',
        status: 200
    })
});
router.post(config.servidor + '/login', function (req, res) {
    const { usuario, clave } = req.body;
    const fe_ult_acceso = moment().format('YYYY-MM-DD HH:mm:ss')
    const sql = "select a.co_usuario, a.tx_nombre, a.tx_usuario, a.tx_clave, a.co_rol, b.tx_rol, a.in_activa ";
    const from = " from t_usuarios a, t_roles b ";
    const where = " where a.co_rol = b.co_rol and a.tx_usuario = '" + usuario + "' and a.tx_clave = '" + clave + "'";
    conexion.query(sql + from + where, function (err, rows) {
        if (!err) {
            res.status(200).send(rows)
        } else {
            res.json({
                message: "Error Autenticando : " + err,
                status: 500
            })
        }

    })
});
router.post(config.servidor + '/cambiarclave', function (req, res) {
    const { usuario, claveactual, nuevaclave } = req.body;
    if (usuario.length === 0 || claveactual.length === 0 || nuevaclave.length === 0) {
        res.json({
            message: "Debe agregar todos los datos",
            status: 500
        });
    } else {
        const sql1 = "select * from usuarios where usuario ='" + usuario + "' and clave = '" + claveactual + "'"
        const resp1 = conexion.query(sql1, function (err, rows) {
            if (!err) {
                if (rows.length > 0) {
                    const update = "update usuarios set clave = ? ";
                    const where = " where usuario = ? ";
                    conexion.query(update + where, [nuevaclave, usuario], function (err) {
                        if (!err) {
                            res.status(200).send("Clave de usuario, actualizado")
                        } else {
                            res.json({
                                message: "Error ACTUALIZANDO CLAVE : " + err,
                                status: 500
                            });
                        }
                    });
                } else {
                    res.json(rows)
                }
            } else {
                res.json({
                    message: "Error CONSULTANDO PARA CAMBIAR CLAVE : " + err,
                    status: 500
                });
            }
        })
    }
});
router.post(config.servidor + '/addUser', function (req, res) {
    const { usuario, nombre } = req.body;
    const sql = "select * from usuarios where usuario ='" + usuario + "'"
    const resp = conexion.query(sql, function (err, rows) {
        if (!err) {
            if (rows.length === 0) {
                const idsucursal = 'S00001'
                const sql2 = "insert into usuarios (usuario, clave, nombre, idsucursal, idrol, status) "
                const values = " values ( ?, ?, ?, ?, ?, ?)"
                conexion.query(sql2 + values, [usuario, usuario, nombre, idsucursal, 4, 1], function (err, rows) {
                    if (!err) {
                        // console.log("Insertando ", rows.insertId)
                        const arreglo = []
                        const obj = {}
                        obj.id = rows.insertId
                        obj.idrol = 4
                        obj.idsucursal = idsucursal
                        obj.nombre = nombre
                        obj.rol = "Cliente"
                        obj.usuario = usuario
                        obj.status = 1
                        obj.fe_ult_acceso = null
                        obj.fe_ult_get = null
                        obj.uuid = null
                        arreglo.push(obj)
                        res.json(arreglo)
                    } else {
                        res.json({
                            message: "Error insertando usuario cliente : " + err,
                            status: 500
                        });
                    }
                });
            } else {
                res.json(rows)
            }
        }
    });

});
router.get(config.servidor + '/usuarios', function (req, res) {
    const sql = "select * from usuarios WHERE usuario != 'soporte'";
    const resp = conexion.query(sql, function (err, rows) {
        if (!err) {
            res.json(rows);
        } else {
            res.json({
                message: "Error al consultar para listar usuario : " + err,
                status: 500
            });
        }
    })

});

module.exports = router;
