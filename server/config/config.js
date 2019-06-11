//==================
// Puerto
//==================

process.env.PORT = process.env.PORT || 3000;

//=========================
//Entorno
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================
// Vencimiento del token
//=========================
//  60 Segundos
//  60 minutos
//  24 horas
//  30 días

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



//=========================
// Seed de autenticación
//=========================


process.env.SEED = process.env.SEED || 'este-es-el-seed-dev';


//=========================
//BASE DE DATOS
//=========================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {


    urlDB = process.env.MONGOURI;
}



process.env.URLDB = urlDB;

//=========================
// Google Client ID
//=========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '880848327505-0r3g94crso19di7hlulqgv8smmg9b8c3.apps.googleusercontent.com'