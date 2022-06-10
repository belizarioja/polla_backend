const express = require("express");
const conexion = require("../config/conexion")
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();
const moment = require('moment')

router.get(config.servidor + '/listar', function (req, res) {
    const sql = "select * from tclientesa ";
    const orderby = " order by 3 asc "
    // const limit =" limit 50 "
    conexion2.query(sql + orderby, function (err, rows) {
        if (!err) {
            res.send(rows);
        } else {
            res.json({
                message: "Error listando clientes",
                resp: err,
                status: 500
            });
        }
    })
});
router.post(config.servidor + '/setupcarrito', async function (req, res) {
    const { idusuario, idcliente, nombrecliente, rifcliente } = req.body;
    const fecha = moment().format('YYYY-MM-DD HH:mm:ss')
    const sql = "select * from holds where idusuario = ? and status = ? "
    conexion.query(sql, [idusuario, 1], async function (err, rows) {
        if (!err) {
            // console.log(rows)
            // console.log(rows.length)
            if (rows.length === 0) {
                const select = "insert into holds (idusuario, fecha, idcliente, nombrecliente, rifcliente, status) ";
                const values = " values ( ?, ?, ?, ?, ?, ?)";
                // console.log(select + values)
                await conexion.query(select + values, [idusuario, fecha, idcliente, nombrecliente, rifcliente, 1], function (err, rows) {
                    if (!err) {
                        // console.log(rows)
                        res.json({
                            message: "Holds creado",
                            status: 200
                        });
                    } else {
                        res.json({
                            message: "Error creando holds",
                            resp: err,
                            status: 500
                        });
                    }
                })
            } else {
                const update = "update holds set idcliente = ?, fecha = ?, nombrecliente = ? , rifcliente = ? ";
                const where = " where idusuario = ? and status = ?";
                // console.log(update + where + nombrecliente)
                await conexion.query(update + where, [idcliente, fecha, nombrecliente, rifcliente, idusuario, 1], function (err, rows) {
                    if (!err) {
                        res.json({
                            message: "Holds Actualizado",
                            status: 200
                        });
                    } else {
                        console.log(err)
                        res.json({
                            message: "Error actualizando holds",
                            resp: err,
                            status: 500
                        });
                    }
                });
            }
        } else {
            res.json({
                message: "Error consultando Holds",
                resp: err,
                status: 500
            });
        }
    })
});
router.post(config.servidor + '/getholds', function (req, res) {
    const { idusuario } = req.body;
    const sql = "select * from holds where idusuario = ?";
    conexion.query(sql, [idusuario], function (err, rows) {
        if (!err) {
            res.send(rows);
        } else {
            res.json({
                message: "Error listando carritos",
                resp: err,
                status: 500
            });
        }
    })
});
router.post(config.servidor + '/getitemsholds', function (req, res) {
    const { idusuario } = req.body;
    const sql = "select a.* from hold_items a, holds b where b.idusuario = ? and a.idhold = b.id ";
    conexion.query(sql, [idusuario, 1], function (err, rows) {
        if (!err) {
            res.send(rows)
        } else {
            res.json({
                message: "Error listando items de carritos" + err,
                status: 500
            });
        }
    })
});
router.post(config.servidor + '/getcxchold', function (req, res) {
    const { idusuario, idcliente } = req.body;
    let sql = "select PCXCV_NUMEDOCU as id, "
    sql += " ( CASE WHEN PCXCD_FECHAEC is null THEN PCXCD_FECHA ELSE PCXCD_FECHAEC END ) as fecha, "
    sql += " PCXCN_MONTOEXT as monto, PCXCN_SALDOEXT as saldo ";
    sql += " from tpendcxc where PCXCV_IDCLIENTE = '" + idcliente + "'";
    // if (idusuario !== 'ADMIN' && idusuario !== 'SOPORTE') {
    sql += " and PCXCV_IDVENDEDOR = '" + idusuario + "'";
    // }
    const orderby = " order by 2 desc "
    conexion2.query(sql, function (err, rows) {
        if (!err) {
            res.send(rows);
        } else {
            res.json({
                message: "Error listando cuentas por cobrar",
                resp: err,
                status: 500
            });
        }
    })
});

router.post(config.servidor + '/getcxc', function (req, res) {
    const { idusuario, idrol } = req.body;
    let sql = "select a.CLIEV_IDCLIENTE as idcliente, a.CLIEV_RIF as rifcliente, b.PCXCV_TIPODOCU as tipodoc, "
    sql += " a.CLIEV_NOMBFISCAL as nombrecliente, c.VENDV_NOMBRE as nombrevendedor, b.PCXCV_IDVENDEDOR as idvendedor, "
    sql += " b.PCXCV_NUMEDOCU as id, b.PCXCN_MONTOEXT as monto, b.PCXCN_SALDOEXT as saldo, "
    sql += " ( CASE WHEN b.PCXCD_FECHAEC is null THEN b.PCXCD_FECHA ELSE b.PCXCD_FECHAEC END ) as fecha "
    const from = " from tclientesa a, tpendcxc b, tvendedores c ";
    let where = " where a.CLIEV_IDCLIENTE=b.PCXCV_IDCLIENTE and b.PCXCN_SALDO > 0 and b.PCXCV_IDVENDEDOR = c.VENDV_IDVENDEDOR"
    if (idrol !== 1) {
        where += " and b.PCXCV_IDVENDEDOR = '" + idusuario + "' "
    }
    const orderby = " order by nombrecliente asc, fecha asc "
    // console.log(sql + from + where + orderby )
    const resp = conexion2.query(sql + from + where + orderby, function (err, rows) {
        if (!err) {
            res.send(rows)
        } else {
            res.json({
                message: "Error listando Clientes con deudas del Vendedor",
                resp: err,
                status: 500
            });
        }
    })
});

module.exports = router;
