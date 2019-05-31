//==================
// Puerto
//==================

process.env.PORT = process.env.PORT || 3000;

//=========================
//Entorno
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=========================
//BASE DE DATOS
//=========================

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://hmartinez:*haml1404*@cluster0-1aohv.mongodb.net/cafe'
}

//Forzamos el uso de la bd remota para probar
//urlDB = 'mongodb+srv://hmartinez:*haml1404*@cluster0-1aohv.mongodb.net/cafe'

process.env.URLDB = urlDB;