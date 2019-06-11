const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', ],
    message: '{VALUE} no es un rol válido'

}



let usuarioSchm = new Schema({
        nombre: {
            type: String,
            required: [true, 'EL nombre es necesario']

        },
        email: {
            type: String,
            unique: true,
            required: [true, 'EL emial es necesario']
        },

        password: {
            type: String,
            required: [true, 'La constraeña es necesaria']
        },

        img: {
            type: String,
            required: false

        },

        role: {
            type: String,
            default: 'USER_ROLE',
            enum: rolesValidos


        },

        estado: {
            type: Boolean,
            default: 'true'

        },

        goole: {
            type: Boolean,
            default: 'false'

        },

    })
    // se modifica toJSON para que no retorne el campo password
usuarioSchm.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}


usuarioSchm.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Usuario', usuarioSchm)