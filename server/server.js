require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

/*myfunc = () => {
    let a = [1, 2, 3];
    console.log(a);

};
myfunc();*/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Habilitar carpeta public para que sea accedida desde cualquier lugar


//app.use(express.static(__dirname + '../public'));
//console.log(path.resolve(__dirname, '../public'))
app.use(express.static(path.resolve(__dirname, '../public')));


// Configuración global de rutas
app.use(require('./routes/index'));


//mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
//mongoose.set('useCreateIndex', true);

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {

        if (err) throw err;
        console.log('Base de datos ONLINE')

    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando en puerto', 3000)
})