const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');



app.get('/usuario', function(req, res) {
    // res.json('--- Get usuario Local ---')
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);



    Usuario.find({ estado: true }, 'nombre email estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    registros: conteo

                })

            })



        })





});
app.post('/usuario', function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.pwd, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        // usuarioDB.password = null; si esos modificaciones en el esquema del usuario : models/usuario
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });

});
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })


})
app.delete('/usuario/:id', function(req, res) {
    //res.json('Delete usuarios')
    let id = req.params.id;
    let cambiarEstado = {
        estado: false
    }


    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensaje: "Usuario no encontrado"


                }

            })

        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })


    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

         if (err) {
             return res.status(400).json({
                 ok: false,
                 err
             })
         };

         if (!usuarioBorrado) {
             return res.status(400).json({
                 ok: false,
                 err: {
                     mensaje: "Usuario no encontrado"


                 }

             })

         }

         res.json({
             ok: true,
             usuario: usuarioBorrado
         })
     })*/






})

module.exports = app;