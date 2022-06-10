const express = require("express");
const conexion2 = require("../config/conexion2")
const config = require("../config/general")
const router = express.Router();

router.get(config.servidor + '/listarcategorias', function (req, res) {
    let sql = "select GRUCV_IDAGRUPAA as id, GRUCV_NOMBRE as nombre, ";
    sql += "( select COUNT(*) from tarticulos a, texisdepo b "
    sql += " where a.ARTV_IDARTICULO = b.EXDEV_IDARTICULO and b.EXDEV_UNIDADES > 0  and a.ARTV_IDAGRUPAA = id) as cantidad "
    sql += " from tagrupaa "
    sql += " order by 2 asc "
    // console.log(sql)
    conexion2.query(sql, function (err, rows) {
        if (!err) {
            res.send(rows)
        } else {
            res.json({
                message: "Error listando categorias" + err,
                status: 500
            });
        }
    })
});
module.exports = router;
