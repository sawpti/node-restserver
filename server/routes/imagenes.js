const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaToken, verificaTokenImg } = require('../middelwares/autenticacion');


let app = express();


app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;


    let tiposValidos = ['productos', 'usuarios']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: ` ${tipo} Es un tipo NO válido. Los tipos permitidos son: ${tiposValidos}`

                }
            })


    }


    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);

    } else {
        let pathNoImagen = path.resolve(__dirname, `../assets/no-imagen.jpg`);
        res.sendFile(pathNoImagen);

    }



});





module.exports = app;