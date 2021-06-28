const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        const activo = await pool.query('SELECT activado FROM usuario WHERE username = ?', [username]);
        const isActivo = activo[0];
        if (isActivo.activado == 'Si'){
            if (validPassword) {
                console.log(activo[0]);
                done(null, user, req.flash('exito', 'Bienvenido! ' + user.username));
            } else if(activo[0] == 'No') {
                done(null, false, req.flash('message', 'Contraseña incorrecta'));
            }
        }else{
            done(null, false, req.flash('message', 'El usuario no está activado, por contáctate con el Administrador!'));
        }
        
    } else {
        return done(null, false, req.flash('message', 'El usuario no existe'));
    }
}));

/*passport.use('local.registro', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    //seleccionamos desde el formualrio segun name
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
        return done(null, false, req.flash('error', 'El correo o el RUT ya está registrado!'));
    } else {
        const result = await pool.query('INSERT INTO usuario SET ?', [newUser]);
        newUser.id = result.insertId;
        return done(null, newUser);
    }

}));*/

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE username = ?', [id]);
    done(null, rows[0]);
});