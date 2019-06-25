const jwt = require('jsonwebtoken');
//=======================
// Verificar token
//=======================

let verificaToken = (req, res, next) => {
    let token = req.get('token');

    // console.log("Token :", token);


    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    menssage: 'Token inválido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();

    })


};
//=======================
// Verifica  AdminRole
//=======================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                menssage: 'El usuario no es administrador'
            }

        });
    }



};
//=======================
// Verifica  token para imagenes
//=======================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    menssage: 'Token inválido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();

    })



};



module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg

}