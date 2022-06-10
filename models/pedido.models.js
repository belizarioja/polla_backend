const express = require("express");
const conexion = require("../config/conexion")
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();
const moment = require('moment')

router.post(config.servidor + '/setitemcarrito', async function (req, res) {
    const { idhold, idproducto, nombreproducto, precio, cantidad, subtotal, preciocaj, unixcaja, costoactu, porciva, porkilos } = req.body;
    // console.log ( idhold, idproducto, nombreproducto, precio, cantidad, subtotal, preciocaj, unixcaja, costoactu, porciva, porkilos )
    const select = "select * from hold_items "
    const where = " where idhold = ? and idproducto = ? "
    await conexion.query(select + where, [idhold, idproducto], function (err, rows) {
        if (!err) {
            // console.log(rows)
            if (rows.length > 0) {
                const cantidadnew = parseInt(rows[0].cantidad) + parseInt(cantidad)
                const subtotalnew = cantidadnew * rows[0].precio
                const update = "update hold_items "
                const set = " set cantidad = ?, subtotal = ? where idhold = ? and idproducto = ? "
                conexion.query(update + set, [cantidadnew, subtotalnew, idhold, idproducto], function (err, rows) {
                    if (!err) {
                        // console.log(rows)
                        res.json({
                            message: "Item de Holds actualizado",
                            status: 200
                        });
                    } else {
                        res.json({
                            message: "Error creando Item holds",
                            resp: err,
                            status: 500
                        });
                    }
                })
            } else {
                const insert = "insert into hold_items (idhold, idproducto, nombreproducto, precio, cantidad, subtotal, preciocaj, unixcaja, costoactu, porciva, porkilos) ";
                const values = " values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                // console.log(select + values)
                conexion.query(insert + values, [idhold, idproducto, nombreproducto, precio, cantidad, subtotal, preciocaj, unixcaja, costoactu, porciva, porkilos], function (err, rows) {
                    if (!err) {
                        // console.log(rows)
                        res.json({
                            message: "Item de Holds creado",
                            status: 200
                        });
                    } else {
                        res.json({
                            message: "Error creando Item holds",
                            resp: err,
                            status: 500
                        });
                    }
                })
            }
        } else {
            res.json({
                message: "Error consultando Item holds",
                resp: err,
                status: 500
            });
        }
    });
});
/* router.post(config.servidor + '/getitemcarrito', async function (req, res) {
    const { idhold } = req.body;
    const sql = "select * from hold_items where idhold = ?";
    await conexion.query(sql, [idhold], function (err, rows) {
        if (!err) {
            res.send(rows);
        } else {
            res.json({
                message: "Error consultando Item holds",
                resp: err,
                status: 500
            });
        }
    })
}); */
router.post(config.servidor + '/setpedido', async function (req, res) {
    const {
        idusuario, usuario, idcliente, nombrecliente, rifcliente, total, idsucursal, itemsPedido, comentario
    } = req.body;
    // console.log(idusuario, usuario, idcliente, nombrecliente, rifcliente, total, idsucursal, itemsPedido, comentario)
    const fecha = moment().format('YYYY-MM-DD HH:mm:ss')
    const sql = "insert into pedidos (idusuario, usuario, fecha, idcliente, nombrecliente, rifcliente, total, comentario) "
    const valores = " values (?, ?, ?, ?, ?, ?, ?, ?) "
    await conexion.query(sql + valores, [idusuario, usuario, fecha, idcliente, nombrecliente, rifcliente, total, comentario], function (err, rows) {
        if (!err) {
            // console.log(rows)
            const idpedido = rows.insertId.toString()
            const pediv_numedocu = 'P' + idpedido.padStart(9, '0')
            // console.log(pediv_numedocu)
            const pediv_tipodocu = "PE"
            const pediv_idcliente = idcliente
            const pediv_idvendedor = usuario
            const pediv_idsucursal = idsucursal
            const pediv_razosoci = nombrecliente
            const pediv_rif = rifcliente
            const pediv_cedula = rifcliente
            const pedin_totalbruto = total
            const pedin_subtotal = total
            const pedin_gravado = total
            const pedin_impualic = 16
            const pedin_exento = 0
            const pedin_totaimpu = parseFloat(total * pedin_impualic / 100)
            const pedin_total = parseFloat(pedin_subtotal) + parseFloat(pedin_totaimpu)
            const pediv_idpvesta = 'E01'
            const pedin_costo = 0
            const pedid_emision = moment().format('YYYY-MM-DD')
            const pediv_hora = moment().format('HH:mm:ss')
            const pedin_diascred = 1
            const pedid_vencimiento = moment().add(pedin_diascred, 'd').format('YYYY-MM-DD')
            const pedin_porcdesc1 = 0
            const pedin_porcdesc2 = 0
            const pedin_montodesc1 = 0
            const pedin_montodesc2 = 0
            const pediv_idcarga = ''
            const pediv_comentario = comentario
            const pediv_status = 'PENDIENTE'
            const pedin_latitud = 0
            const pedin_longitud = 0
            const pedin_control = 111
            const pedin_lisaea1 = 0
            const pedin_lisaea2 = 0
            const pediv_idusuario = 'FACT'
            const pediv_motivonula = ''
            const pediv_devuelta = ''
            // const pedin_impresa = null
            const pedin_montafec = 0
            const pediv_origen = 'APP'
            const pediv_factafec = ''
            const pedid_fechafec = null
            const pedin_docsinrec = 0
            // const pediv_statusadm = null
            const pediv_idmotivodev = ''
            const pedin_lisaea3 = 0
            const pedin_factor = 0
            // const pediv_idequipo = null
            // const pediv_valido = null
            let insert = "insert into tpedven_enc ";
            insert += "(PEDIV_TIPODOCU, PEDIV_NUMEDOCU, PEDIV_IDCLIENTE, PEDIV_IDSUCURSAL, PEDIV_IDVENDEDOR, "
            insert += " PEDIV_IDPVESTA, PEDIV_RIF, PEDIV_CEDULA, PEDIV_RAZOSOCI, PEDID_EMISION, PEDIV_HORA, PEDIN_DIASCRED, PEDID_VENCIMIENTO, PEDIN_TOTALBRUTO, "
            insert += " PEDIN_PORCDESC1, PEDIN_PORCDESC2, PEDIN_MONTODESC1, PEDIN_MONTODESC2, PEDIN_SUBTOTAL, PEDIN_IMPUALIC, "
            insert += " PEDIN_TOTAIMPU, PEDIN_GRAVADO, PEDIN_EXENTO, PEDIN_LISAEA1, PEDIN_LISAEA2, PEDIN_TOTAL, PEDIN_COSTO, PEDIV_COMENTARIO, PEDIV_IDCARGA, "
            insert += " PEDIV_STATUS, PEDIN_LATITUD, PEDIN_LONGITUD, PEDIN_CONTROL, PEDIV_IDUSUARIO, PEDIV_MOTIVONULA, PEDIV_DEVUELTA, PEDIN_MONTAFEC, "
            insert += " PEDIV_ORIGEN, PEDIV_FACTAFEC, PEDID_FECHAFEC, PEDIN_DOCSINREC, PEDIV_IDMOTIVODEV, PEDIN_LISAEA3, PEDIN_FACTOR) "
            const arrayvalues = [pediv_tipodocu, pediv_numedocu, pediv_idcliente, pediv_idsucursal, pediv_idvendedor, pediv_idpvesta, pediv_rif,
                pediv_cedula, pediv_razosoci, pedid_emision, pediv_hora, pedin_diascred, pedid_vencimiento, pedin_totalbruto,
                pedin_porcdesc1, pedin_porcdesc2, pedin_montodesc1, pedin_montodesc2, pedin_subtotal,
                pedin_impualic, pedin_totaimpu, pedin_gravado, pedin_exento, pedin_lisaea1, pedin_lisaea2, pedin_total, pedin_costo,
                pediv_comentario, pediv_idcarga, pediv_status, pedin_latitud, pedin_longitud, pedin_control, pediv_idusuario,
                pediv_motivonula, pediv_devuelta, pedin_montafec, pediv_origen, pediv_factafec, pedid_fechafec,
                pedin_docsinrec, pediv_idmotivodev, pedin_lisaea3, pedin_factor]
            let values = " values ("
            for (let i = 0; i < arrayvalues.length - 1; ++i) {
                values += " ?,"
            }
            values += " ?)"
            // console.log(insert)
            // console.log(values)
            conexion2.query(insert + values, arrayvalues, function (err, rows) {
                if (!err) {
                    //console.log(rows)
                    let subtotal = 0

                    for (const i in itemsPedido) {
                        const item = itemsPedido[i]
                        // console.log(item)
                        const pedrv_tipodocu = 'PE'
                        const pedrv_numedocu = pediv_numedocu
                        const pedrv_idarticulo = item.idproducto
                        // console.log(parseInt(item.cantidad), parseInt(item.unixcaja))
                        const pedrn_cajas = parseInt(item.cantidad) / parseInt(item.unixcaja)
                        const pedrn_unidades = parseInt(item.cantidad)
                        const pedrn_kilos = 0
                        // const pedrv_tipoprecio 
                        const pedrn_preciocaj = item.preciocaj
                        const pedrn_totabrut = parseFloat(pedrn_cajas) * parseFloat(item.preciocaj)
                        // const pedrn_totabrut = parseFloat(item.cantidad) * parseFloat(item.precio)  
                        const pedrn_descuento1 = 0
                        const pedrn_descuento2 = 0
                        const pedrn_montdesc1 = 0
                        const pedrn_montdesc2 = 0
                        const pedrn_montdesg1 = 0
                        const pedrn_montdesg2 = 0
                        const pedrn_subtotal = pedrn_totabrut
                        subtotal += parseFloat(item.subtotal)
                        const pedrn_alicimpu = item.porciva
                        const pedrn_totaimpu = parseFloat(pedrn_subtotal * pedrn_alicimpu / 100)
                        const pedrn_total = parseFloat(pedrn_totaimpu) + parseFloat(pedrn_subtotal)
                        // total += parseFloat(pedrn_total)
                        const pedrn_costo = item.costoactu * pedrn_cajas
                        // const pedrv_idcarga
                        const pedrv_status = pediv_status
                        const pedrv_idcaja = 'E01'
                        const pedrv_iddepo = '001'
                        const pedrn_utilidad = pedrn_subtotal - pedrn_costo
                        const pedrn_porcutil = 100 - (pedrn_costo / pedrn_subtotal * 100)
                        // const pedrv_comentario
                        const pedrv_idcliente = pediv_idcliente
                        const pedrv_idsucursal = pediv_idsucursal
                        const pedrd_emision = moment().format('YYYY-MM-DD')
                        const pedrv_idvendedor = pediv_idvendedor
                        const pedrv_descart = item.nombreproducto
                        const pedrn_preciouni = item.precio
                        const pedrn_cajasfact = 0
                        const pedrn_unidafact = 0
                        const pedrn_kilosfact = 0
                        const pedrn_lisaea1 = 0
                        const pedrn_lisaea2 = 0
                        const pedrn_lisaea3 = 0
                        const pedrn_cajascero = 1
                        let insertitem = "insert into tpedven_reg ";
                        insertitem += " (PEDRV_TIPODOCU, PEDRV_NUMEDOCU, PEDRV_IDARTICULO, PEDRN_CAJAS, PEDRN_UNIDADES, PEDRN_KILOS, "
                        insertitem += " PEDRN_PRECIOCAJ, PEDRN_TOTABRUT, PEDRN_DESCUENTO1, PEDRN_DESCUENTO2, "
                        insertitem += " PEDRN_MONTDESC1, PEDRN_MONTDESC2, PEDRN_MONTDESG1, PEDRN_MONTDESG2, PEDRN_SUBTOTAL, PEDRN_ALICIMPU, "
                        insertitem += " PEDRN_TOTAIMPU, PEDRN_TOTAL, PEDRN_COSTO, PEDRV_STATUS, PEDRV_IDCAJA, PEDRV_IDDEPO, PEDRN_UTILIDAD, "
                        insertitem += " PEDRN_PORCUTIL, PEDRV_IDCLIENTE, PEDRV_IDSUCURSAL, PEDRD_EMISION, PEDRV_IDVENDEDOR, "
                        insertitem += " PEDRV_DESCART, PEDRN_PRECIOUNI, PEDRN_CAJASFACT, PEDRN_UNIDAFACT, PEDRN_KILOSFACT, PEDRN_LISAEA1, "
                        insertitem += " PEDRN_LISAEA2, PEDRN_LISAEA3, PEDRN_CAJASCERO)"
                        const arrayvaluesitems = [
                            pedrv_tipodocu, pedrv_numedocu, pedrv_idarticulo, pedrn_cajas, pedrn_unidades, pedrn_kilos,
                            pedrn_preciocaj, pedrn_totabrut, pedrn_descuento1, pedrn_descuento2,
                            pedrn_montdesc1, pedrn_montdesc2, pedrn_montdesg1, pedrn_montdesg2, pedrn_subtotal, pedrn_alicimpu,
                            pedrn_total, pedrn_totaimpu, pedrn_costo, pedrv_status, pedrv_idcaja, pedrv_iddepo, pedrn_utilidad,
                            pedrn_porcutil, pedrv_idcliente, pedrv_idsucursal, pedrd_emision, pedrv_idvendedor,
                            pedrv_descart, pedrn_preciouni, pedrn_cajasfact, pedrn_unidafact, pedrn_kilosfact, pedrn_lisaea1,
                            pedrn_lisaea2, pedrn_lisaea3, pedrn_cajascero
                        ]
                        let valuesitems = " values ("
                        for (let i = 0; i < arrayvaluesitems.length - 1; ++i) {
                            valuesitems += " ?,"
                        }
                        valuesitems += " ?)"
                        // console.log(insertitem)
                        // console.log(valuesitems)
                        conexion2.query(insertitem + valuesitems, arrayvaluesitems, function (err, rows) {
                            if (err) {
                                res.json({
                                    message: "Error insertando item pedido SEUZ : ",
                                    resp: err,
                                    status: 500
                                })
                            }
                        });
                        let insertitem2 = "insert into pedido_items ";
                        insertitem2 += " (idpedido, idproducto, nombreproducto, precio, cantidad, subtotal )"
                        const arrayvaluesitems2 = [
                            idpedido, pedrv_idarticulo, pedrv_descart, pedrn_preciouni, pedrn_unidades, item.subtotal
                        ]
                        let valuesitems2 = " values ("
                        for (let i = 0; i < arrayvaluesitems2.length - 1; ++i) {
                            valuesitems2 += " ?,"
                        }
                        valuesitems2 += " ?)"
                        conexion.query(insertitem2 + valuesitems2, arrayvaluesitems2, function (err, rows) {
                            if (err) {
                                console.log(err)
                                res.json({
                                    message: "Error insertando item pedido App : ",
                                    resp: err,
                                    status: 500
                                })
                            }
                        });
                    } // fon del for
                    const update = "update pedidos set numedocu = ?, total = ?";
                    const where = " where id = ?";
                    conexion.query(update + where, [pediv_numedocu, subtotal, idpedido], function (err, rows) {
                        if (!err) {
                            res.json({
                                message: "Pedido actualizado y enviado a SEUZ",
                                status: 200
                            });
                        } else {
                            res.json({
                                message: "Error actualizando pedido",
                                resp: err,
                                status: 500
                            });
                        }
                    })
                } else {
                    res.json({
                        message: "Error creando pedido SEUZ : ",
                        resp: err,
                        status: 500
                    });
                }
            })
        } else {
            res.json({
                message: "Error creando pedido APP",
                resp: err,
                status: 500
            });
        }
    });
});
router.post(config.servidor + '/deletecarrito', async function (req, res) {
    const { idhold } = req.body;
    const sql = "delete FROM hold_items where idhold = ? ";
    await conexion.query(sql, [idhold], async function (err, rows) {
        if (!err) {
            const sql = "delete FROM holds where id = ? ";
            await conexion.query(sql, [idhold], function (err, rows) {
                if (!err) {
                    res.status(200).send("hold borrado con éxito")
                    ///res.send(rows);
                } else {
                    res.json({
                        message: "Error borrando hold",
                        resp: err,
                        status: 500
                    });
                }
            });
        } else {
            res.json({
                message: "Error borrando Item holds",
                resp: err,
                status: 500
            });
        }
    })
});
router.post(config.servidor + '/reportePedidos', async function (req, res) {
    const { usuario, ultnumedocu, idrol } = req.body
    let sql = "SELECT a.id, a.numedocu, a.fecha, a.idcliente, a.nombrecliente, a.usuario, "
    sql += " b.idproducto, b.nombreproducto, b.precio, b.cantidad, b.subtotal "
    const from = " FROM pedidos a, pedido_items b "
    let where = " WHERE a.id = b.idpedido "
    if (idrol !== 1) {
        where += " AND a.usuario = '" + usuario + "' "
    }
    if (ultnumedocu) {
        where += " AND a.numedocu > '" + ultnumedocu + "' "
    }
    const order = " ORDER by 3 asc "
    // console.log(sql + from + where + order)
    await conexion.query(sql + from + where + order, async function (err, rows) {
        if (!err) {
            res.send(rows)
        } else {
            res.json({
                message: "Error listando pedidos " + err,
                status: 500
            })
        }
    })
})
router.post(config.servidor + '/savePedido', async function (req, res) {
    const { hold, arreglopedido } = req.body;
    const fecha = moment().format('YYYY-MM-DD HH:mm:ss')
    if (hold.id) {
        const sql = "update holds set status = ?, idcliente = ?, fecha = ?, nombrecliente = ?, rifcliente = ? ";
        const where = " where id = ? ";
        await conexion.query(sql + where, [hold.status, hold.idcliente, fecha, hold.nombrecliente, hold.rifcliente, hold.id], function (err, rows) {
            if (!err) {
                for (const i in arreglopedido) {
                    const item = arreglopedido[i]
                    if (item.id) {
                        const update = "update hold_items "
                        const set = " set cantidad = ?, subtotal = ? where idhold = ? and idproducto = ? "
                        conexion.query(update + set, [item.cantidad, item.subtotal, hold.id, item.idproducto], function (err, rows) {
                            if (err) {
                                res.status(500).send("Error actualizando item de hold : " + err)
                            }
                        })
                    } else {
                        const insert = "insert into hold_items (idhold, idproducto, nombreproducto, precio, cantidad, subtotal, preciocaj, unixcaja, costoactu, porciva, porkilos) ";
                        const values2 = " values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        // console.log(select + values)
                        conexion.query(insert + values2, [hold.id, item.idproducto, item.nombreproducto, item.precio, item.cantidad, item.subtotal, item.preciocaj, item.unixcaja, item.costoactu, item.porciva, item.porkilos], function (err, rows) {
                            if (err) {
                                res.status(500).send("Error insertado item de hold : " + err)
                            }
                        })
                    }
                }// for
                res.status(200).send("Hold actualizado con éxito")
            } else {
                res.json({
                    message: "Error actualizando hold : " + err,
                    status: 500
                });
            }
        })
    } else { // si idhols es nulo
        const select = "insert into holds (idusuario, fecha, idcliente, nombrecliente, rifcliente, status) ";
        const values = " values ( ?, ?, ?, ?, ?, ?)";
        // console.log(select + values)
        await conexion.query(select + values, [hold.idusuario, fecha, hold.idcliente, hold.nombrecliente, hold.rifcliente, hold.status], function (err, rows) {
            if (!err) {
                const idhold = rows.insertId
                for (const i in arreglopedido) {
                    const item = arreglopedido[i]
                    const insert = "insert into hold_items (idhold, idproducto, nombreproducto, precio, cantidad, subtotal, preciocaj, unixcaja, costoactu, porciva, porkilos) ";
                    const values2 = " values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    // console.log(select + values)
                    conexion.query(insert + values2, [idhold, item.idproducto, item.nombreproducto, item.precio, item.cantidad, item.subtotal, item.preciocaj, item.unixcaja, item.costoactu, item.porciva, item.porkilos], function (err, rows) {
                        if (err) {
                            res.status(500).send("Error insertado item de hold nuevo : " + err)
                        }
                    })
                } // for
                res.status(200).send("Hold insertado con éxito")
            } else {
                res.status(500).send("Error insertado hold nuevo : " + err)
            }
        });
    }
});
router.post(config.servidor + '/checkoutSave', async function (req, res) {
    const { idhold, idusuario } = req.body;
    const update1 = "update holds set status = 0 ";
    const where = " where idusuario = ? and status = 1 ";
    await conexion.query(update1 + where, [idusuario], function (err, rows) {
        if (!err) {
            const update2 = "update holds set status = 1 ";
            const where = " where id = ? ";
            conexion.query(update2 + where, [idhold], function (err, rows) {
                if (!err) {
                    res.status(200).send("Hold enviado a carrito con éxito")
                } else {
                    res.json({
                        message: "Error checkout carrito holds",
                        resp: err,
                        status: 500
                    });
                }
            })
        } else {
            res.json({
                message: "Error guardando holds",
                resp: err,
                status: 500
            });
        }
    })
});
router.post(config.servidor + '/corregirClientesNull', async function (req, res) {
    const sql = "select * from pedidos where idcliente is null ";
    await conexion.query(sql, async function (err, rows) {
        if (!err) {
            if (rows.length > 0) {
                const numerror = rows.length
                for (i in rows) {
                    const numedocu = rows[i].numedocu
                    const rif = rows[i].rifcliente
                    const sql2 = "select CLIEV_IDCLIENTE from tclientesa where CLIEV_RIF = ? ";
                    // console.log(rif, numedocu)
                    await conexion2.query(sql2, [rif], async function (err, rows) {
                        if (!err) {
                            const idcliente = rows[0].CLIEV_IDCLIENTE
                            // console.log(idcliente, numedocu)
                            const update = "update tpedven_enc set PEDIV_IDCLIENTE = ? ";
                            const where = " where PEDIV_NUMEDOCU = ? ";
                            await conexion2.query(update + where, [idcliente, numedocu], async function (err, rows) {
                                if (!err) {
                                    const update2 = "update pedidos set idcliente = ? ";
                                    const where2 = " where numedocu = ? ";
                                    await conexion.query(update2 + where2, [idcliente, numedocu], function (err, rows) {
                                        if (err) {
                                            console.log(err)
                                        }
                                    })
                                } else {
                                    console.log(err)
                                }
                            })
                        }
                    })
                }
                res.status(200).send("Fueron corregidos " + numerror + " clientes NULL")
            } else {
                res.status(200).send("Enhorabuena no tiene clientes NULL!")
            }
        }
    })
});

module.exports = router;
