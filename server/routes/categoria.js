const express = require('express');
let app = express();
// const bcrypt = require('bcrypt');
const _ = require('underscore');
let Categoria = require('../models/categoria');
let { verificaToken, verificaAdminRole } = require('../middelwares/autenticacion');

// ===================================
// Mostrar todas las categorias
// ===================================

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias,

            })
        })
});


// ===================================
// Mostrar una categoría por ID
// ===================================

app.get('/categoria/:id', verificaToken, (req, res) => {
    //  Categoria.findById()
    let id = req.params.id;

    Categoria.findById(id)
        .populate('usuario')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensaje: "id no existe"
                    }
                })
            }
            res.json({
                ok: true,
                categoria: categoriaDB

            })

        });

});

// ===================================
// Crear una categoría
// ===================================

app.post('/categoria', verificaToken, (req, res) => {
    // regresa la nueva categoria creada
    // req.usuario._id


    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB,

        })
    });

});


// ===================================
// Actualizar una categoria
// ===================================

app.put('/categoria/:id', verificaToken, (req, res) => {


    let id = req.params.id;
    let body = req.body;
    //let body = _.pick(req.body, ['nombre', 'descripcion']);
    req.body.usuario_id = req.usuario._id;
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: 'No existe el id'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });

});


// ===================================
// Eliminar categoria 
// ===================================

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // solo una administrador puede borarr

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El id no existe"
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            mensaje: "Esta categoria ha sido eliminada de la BD"

        })

    });


});

module.exports = app;