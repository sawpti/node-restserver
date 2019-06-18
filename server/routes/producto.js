const express = require('express');
let app = express();
// const bcrypt = require('bcrypt');
let Producto = require('../models/producto');
let { verificaToken, verificaAdminRole } = require('../middelwares/autenticacion');

// ===================================
// Mostrar todas los productos
// ===================================

app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 25;
    limite = Number(limite);


    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('categoria', )
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos,

            })
        })
});




// ===================================
// Mostrar un producto por su ID
// ===================================

app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('categoria')
        .populate('usuario')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "id no existe"
                    }
                })
            }
            res.json({
                ok: true,
                producto: productoDB

            })

        });

});


// ===================================
// Buscar productos
// ===================================
app.get('/producto/buscar/:key', verificaToken, (req, res) => {
    let termino = req.params.key;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', )
        .populate('usuario', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,

                })
            };
            res.json({
                ok: true,
                producto: productos

            })

        })

})




// ===================================
// Crear un producto
// ===================================

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        precioUni: body.precioUni,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id,

    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.status(201).json({
            ok: true,
            producto: productoDB,

        })
    });

});


// ===================================
// Actualizar un producto
// ===================================

app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    req.body.usuario = req.usuario._id;
    console.log(body);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .populate('categoria')
        .populate('usuario')
        .exec(
            (err, productoDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                if (!productoDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            mensaje: "No existe el id"
                        }
                    })
                }

                res.json({
                    ok: true,
                    producto: productoDB
                })
                console.log(body);
            });

});


// ===================================
// Eliminar un producto
// ===================================

app.delete('/producto/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // solo una administrador puede borarr
    let id = req.params.id;
    let cambiarEstado = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, productoDesactivado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!productoDesactivado) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "Producto no encontrado"


                }

            })

        }

        res.json({
            ok: true,
            producto: productoDesactivado,
            mensaje: "Producto desactivado"
        })

    });




});

module.exports = app;