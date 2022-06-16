const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const app = express()
const config = require("./config/general")
var fs = require('fs')

var corsOptions = {
  origin: '*'
};

app.use(fileUpload())
// parse requests of content-type - application/json
// app.use(express.json());
app.use(express.json({ limit: '100mb' }));
app.use(cors(corsOptions));
// app.use(express.urlencoded({ limit: '50mb' }));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const usermodel = require("./models/user.models")
const jornadamodel = require("./models/jornada.models")
const pollasamodel = require("./models/pollas.models")
const sedesamodel = require("./models/sedes.models")

app.use(usermodel)
app.use(jornadamodel)
app.use(pollasamodel)
app.use(sedesamodel)

const PORT = process.env.PORT || 4006
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
})
