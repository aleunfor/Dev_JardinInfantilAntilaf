const express = require('express');
const router = express.Router();
const passport = require('../lib/passport');
const pass = require('passport');
const {isLoggedIn} = require('../lib/auth');
const {isNotLoggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');
const pool = require('../database');


//Registro
router.get('/registro', isNotLoggedIn ,(req, res) => {
    res.render('login/registro');
});

router.post('/registro', async (req, res, done) => {
    //seleccionamos desde el formualrio segun name
    const { username } = req.body;
    const { password } = req.body;
    const { rut } = req.body;
    const { nombre } = req.body;
    const { apellido } = req.body;
    const { fecha_nac } = req.body;
    const { direccion } = req.body;
    const { telefono } = req.body;
    const id_tipousuario = 4;
    const activado = 0;

    const newUser = {

        rut,
        nombre,
        apellido,
        fecha_nac,
        direccion,
        telefono,
        username,
        password,
        id_tipousuario,
        activado

    };
    //Encriptar la contraseña
    newUser.password = await helpers.encryptPassword(password);
    const correoRegistrado = await pool.query('SELECT * FROM usuario WHERE rut = ?', [rut]);
    const rutRegistrado = await pool.query('SELECT * FROM usuario WHERE username = ?', [username]);
    if (correoRegistrado.length > 0 || rutRegistrado.length > 0) {
        req.flash('error', 'El correo o el RUT ya está registrado!');
        res.redirect('/registro');
    } else {
        const result = await pool.query('INSERT INTO usuario SET ?', [newUser]);
        newUser.id = result.insertId;
        req.flash('exito', 'Te has registrado correctamente, Espera a que el Administrador active tu perfil!');
        res.redirect('/login');
    }
});

// LOGIN
router.get('/login', isNotLoggedIn, (req, res) =>{
    res.render('login/login');
});

router.post('/login', (req, res, next) =>{
    pass.authenticate('local.login',{
        successRedirect: '/perfil',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/perfil', isLoggedIn , async (req, res) => {
    const ninios = await pool.query('SELECT niño.rut, niño.nombre, niño.apellido, niño.sexo, niño.fecha_nac, nivel.nombre as nivel FROM niño JOIN nivel ON niño.nivel_idnivel = nivel.idnivel WHERE usuario_idusuario ='+req.user.idusuario);
    res.render('perfil', {ninios});
});

router.get('/cerrar-sesion', (req, res) =>{
    req.logOut();
    res.redirect('/login');
});

// RUTAS CAMBIO DE CONTRASEÑA  

router.get('/cambio-contrasena', isLoggedIn ,async (req, res) =>{
    res.render('login/cambio-contrasena');
});

router.post('/cambio-contrasena', isLoggedIn ,async (req, res) =>{
    const {oldPassword} = req.body;
    const {newPassword} = req.body;

    const rows = await pool.query('SELECT * FROM usuario WHERE idusuario = ?', req.user.idusuario);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(oldPassword, user.password);
        if (validPassword) {
            const password = await helpers.encryptPassword(newPassword);
            await pool.query('UPDATE usuario SET password ="'+ password +'" WHERE idusuario = ? ', req.user.idusuario);
            req.flash('exito','Contraseña actualizada correctamente!');
            res.redirect('/perfil');
        } else {
            req.flash('error','La contraseña anterior no es correcta!');
            res.redirect('/cambio-contrasena');
        }
    } else {
        req.flash('error','El usuario no existe!');
        res.redirect('/login');
    }
});

module.exports = router;