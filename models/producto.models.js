const express = require("express")
const conexion = require("../config/conexion")
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router()
var fs = require('fs')

/* router.get(config.servidor + '/migrarproductos', function (req, res) {
    let sql = "SELECT a.ARTV_IDARTICULO as id, a.ARTV_DESCART as nombre, a.ARTN_PRECIOCAM as precio, b.EXDEV_UNIDADES as disponible, "
    sql += " a.ARTN_UNIXCAJA as unixcaja, a.ARTV_IDAGRUPAA as idcategoria, "
    sql += " a.ARTN_COSTOACTU as costoactu, a.ARTN_PORCIVA as porciva, a.ARTN_PRECIOCAJ as preciocaj, a.ARTN_PORKILOS as porkilos "
    sql += ", d.IMGV_IDARTICULO as imagen "
    const from = " FROM tarticulos a "
    let where = " LEFT JOIN texisdepo b ON a.ARTV_IDARTICULO = b.EXDEV_IDARTICULO ";
    // where += " LEFT JOIN tmarca c ON a.ARTV_IDMARCA = c.MARV_IDMARCA ";
    where += " LEFT JOIN tartimagen d ON a.ARTV_IDARTICULO = d.IMGV_IDARTICULO ";
    where += " WHERE b.EXDEV_UNIDADES > 0 ";
    where += " LIMIT 50";
    // const order = " ORDER BY 2 ASC ";
    const sql2 = "TRUNCATE TABLE productos "
    conexion.query(sql2, function (err, rows) {
        if (!err) {
            conexion2.query(sql + from + where, function (err, rows) {
                if (!err) {
                    rows.forEach(function (dataElement) {
                        const id = dataElement.id
                        const nombre = dataElement.nombre
                        const precio = dataElement.precio
                        const disponible = dataElement.disponible
                        const unixcaja = dataElement.unixcaja
                        const idcategoria = dataElement.idcategoria
                        const costoactu = dataElement.costoactu
                        const porciva = dataElement.porciva
                        const preciocaj = dataElement.preciocaj
                        const porkilos = dataElement.porkilos
                        const imagen = dataElement.imagen

                        const insert = "insert into productos (id, nombre, precio, disponible, unixcaja, idcategoria, costoactu, porciva, preciocaj, porkilos, imagen) "
                        const values = " values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                        conexion.query(insert + values, [id, nombre, precio, disponible, unixcaja, idcategoria, costoactu, porciva, preciocaj, porkilos, imagen], function (err, rows) {
                            if (err) {
                                console.log(err)
                                res.json({
                                    message: "Error insertando productos " + err,
                                    status: 500
                                });
                            }
                        });
                    })
                    res.send(rows)
                } else {
                    res.json({
                        message: "Error listando productos " + err,
                        status: 500
                    });
                }
            })
        }
    })
}); */
router.post(config.servidor + '/listarproductos', function (req, res) {
    let sql = "SELECT a.ARTV_IDARTICULO as id, a.ARTV_DESCART as nombre, b.EXDEV_UNIDADES as disponible, "
    sql += " a.ARTN_UNIXCAJA as unixcaja, a.ARTN_PRECIOCAM as precio, a.ARTV_IDAGRUPAA as idcategoria, "
    sql += " a.ARTN_COSTOACTU as costoactu, a.ARTN_PORCIVA as porciva, a.ARTN_PRECIOCAJ as preciocaj, a.ARTN_PORKILOS as porkilos "
    const from = " FROM tarticulos a "
    let where = " LEFT JOIN texisdepo b ON a.ARTV_IDARTICULO = b.EXDEV_IDARTICULO "
    where += " WHERE b.EXDEV_UNIDADES > 0 "
    const order = " ORDER BY 2 ASC "
    conexion2.query(sql + from + where + order, function (err, rows) {
        if (!err) {
            res.send(rows)
        } else {
            res.status(500).send("Error listando productos " + err)
        }
    })
});
router.post(config.servidor + '/listarproductosimg', function (req, res) {
    // const { categoria } = req.body;    
    let sql = "SELECT a.ARTV_IDARTICULO as id, a.ARTV_DESCART as nombre, b.EXDEV_UNIDADES as disponible, "
    sql += " a.ARTN_UNIXCAJA as unixcaja, a.ARTV_DESCART as nombre, a.ARTN_PRECIOCAM as precio, a.ARTV_IDAGRUPAA as idcategoria, "
    sql += " a.ARTN_COSTOACTU as costoactu, a.ARTN_PORCIVA as porciva, a.ARTN_PRECIOCAJ as preciocaj, a.ARTN_PORKILOS as porkilos "
    sql += ", d.IMGV_IDARTICULO as imagen "
    const from = " FROM tarticulos a "
    let where = " LEFT JOIN texisdepo b ON a.ARTV_IDARTICULO = b.EXDEV_IDARTICULO ";
    where += " LEFT JOIN tartimagen d ON a.ARTV_IDARTICULO = d.IMGV_IDARTICULO ";
    where += " WHERE b.EXDEV_UNIDADES > 0 "
    const order = " ORDER BY 2 ASC ";
    conexion2.query(sql + from + where + order, function (err, rows) {
        if (!err) {
            res.send(rows)
        } else {
            res.status(202).send("Error listando productos con img : " + err)
        }
    })
});
router.post(config.servidor + '/getimagenproducto', function (req, res) {
    const { idproducto } = req.body;
    const sql = "SELECT IMGV_IMAGEN1 as imagen "
    const from = " FROM tartimagen "
    const where = " WHERE IMGV_IDARTICULO = '" + idproducto + "'";
    conexion2.query(sql + from + where, function (err, rows) {
        if (!err) {
            // console.log(rows[0].imagen)
            const imageBuffer = rows[0].imagen
            const imageName = './files/' + idproducto + '.png'
            fs.createWriteStream(imageName).write(imageBuffer);
            res.send(rows)
        } else {
            res.json({
                message: "Error obteniendo imagen de productos " + err,
                resp: err,
                status: 500
            });
        }
    })
});
router.get(config.servidor + '/bloque7', function (req, res) {
    const sql = "SELECT ARTV_IDARTICULO as id "
    const from = " FROM tarticulos "
    const limit = " LIMIT 1 "
    conexion2.query(sql + from + limit, function (err) {
        if (!err) {
            res.status(200).send('Conexion bloque 7 válida!')
        } else {
            res.status(404).send("Error Conexion bloque 7 " + err)
        }
    })
})
module.exports = router;
