const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

//app.use(fileUpload());
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;



    if (Object.keys(req.files).length == 0) {
        //return res.status(400).send('No files were uploaded.');

        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            })
    }

    // Valida tipo
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



    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nomArchivo = archivo.name.split('.');
    let ext = nomArchivo[nomArchivo.length - 1];
    // console.log(ext);


    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpeg', 'jpg', 'gif'];
    if (extensionesValidas.indexOf(ext) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    error: ext + ' No es una extensión permitida',
                    message: 'Las exteniones permitidas son: ' + extensionesValidas
                }
            })

    }
    // Cambiar nombre del archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${ext}`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err

            });

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);

        } else {
            imagenProducto(id, res, nombreArchivo)

        }





    });



});

// Agrega la ubicación de la imagen del usuario  en la coleccion
function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err

            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El usuario con id ${id}  no existe en la base datos`
                }

            });
        }

        borraArchivo(usuarioDB.img, 'usuarios'); // borra l aimgen existente aunte de guardar la nueva imagen
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuario) => {

            res.json({
                ok: true,
                usuario,
                img: nombreArchivo

            });
        })

    });

}


// Agrega la ubicación de la imagen del producto  en la coleccion
function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoBD) => {

        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err

            });
        }

        if (!productoBD) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: `El producto con id ${id}  no existe en la base datos`
                }

            });
        }

        borraArchivo(productoBD.img, 'productos'); // borra l aimgen existente aunte de guardar la nueva imagen

        productoBD.img = nombreArchivo;
        productoBD.save((err, producto) => {

            res.json({
                ok: true,
                producto,
                img: nombreArchivo

            });
        })

    });

}



function borraArchivo(nombreImgen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImgen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen)
    }
}



module.exports = app;