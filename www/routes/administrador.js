const { setRandomFallback } = require('bcryptjs');
const express = require('express');
const router = express.Router();
const helpers = require('../lib/helpers');

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const { query } = require('../database');

//INICIO RUTAS CRUD USUARIO

router.get('/agregar-usuario', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        res.render('administrador/agregar-usuario');
    }
});

router.post('/agregar-usuario', isLoggedIn, async (req, res) => {
    //seleccionamos desde el formulario segun name
    const { rut } = req.body;
    const { nombre } = req.body;
    const { apellido } = req.body;
    const { fecha_nac } = req.body;
    const { direccion } = req.body;
    const { telefono } = req.body;
    const { username } = req.body;
    const { password } = req.body;
    const { id_tipousuario } = req.body;
    const { activado } = req.body;

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

    const correoRegistrado = await pool.query('SELECT * FROM usuario WHERE rut = ?', [rut]);
    const rutRegistrado = await pool.query('SELECT * FROM usuario WHERE username = ?', [username]);

    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        if (correoRegistrado.length > 0 || rutRegistrado.length > 0) {
            req.flash('error', 'El correo y/o RUT ya está registrado!');
            res.redirect('/administrador/agregar-usuario');
        } else {
            //Encriptar la contraseña
            newUser.password = await helpers.encryptPassword(password);
            await pool.query('INSERT INTO usuario SET ?', [newUser]);
            req.flash('exito', 'Usuario agregado correctamente!');
            res.redirect('/administrador/ver-usuarios');
        }
    }
});

router.get('/ver-usuarios', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const usuario = await pool.query('SELECT usuario.idusuario, usuario.rut, usuario.nombre, usuario.apellido, usuario.fecha_nac, usuario.direccion, usuario.telefono, usuario.username, tipo_usuario.nombre as rol, usuario.activado FROM usuario JOIN tipo_usuario ON usuario.id_tipousuario = tipo_usuario.idtipo_usuario');
        res.render('administrador/ver-usuarios', { usuario });
    }
});

router.get('/editar-usuario/:id', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const { id } = req.params;
        const usuarios = await pool.query('SELECT * FROM usuario WHERE idusuario = ?', [id]);
        res.render('administrador/editar-usuario', { usuario: usuarios[0] });
    }
});

router.post('/editar-usuario/:id', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const { id } = req.params;
        const { rut, nombre, apellido, fecha_nac, direccion, telefono, username, id_tipousuario, activado } = req.body;
        const editUser = {
            rut,
            nombre,
            apellido,
            fecha_nac,
            direccion,
            telefono,
            username,
            id_tipousuario,
            activado
        };
        await pool.query('UPDATE usuario SET ? WHERE idusuario = ? ', [editUser, id]);
        req.flash('exito', 'Usuario editado correctamente!');
        res.redirect('/administrador/ver-usuarios');
    }
});

router.get('/eliminar-usuario/:id', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const { id } = req.params;
        await pool.query('DELETE FROM comentario WHERE usuario_idusuario = ?', [id]);
        await pool.query('DELETE FROM comunicado WHERE idusuario = ?', [id]);
        await pool.query('DELETE FROM usuario WHERE idusuario = ?', [id]);
        req.flash('exito', 'Usuario eliminado correctamente!');
        res.redirect('/administrador/ver-usuarios');
    }
});

//fin rutas usuario


// INICIO RUTAS CRUD COMUNICADOS

router.get('/ver-comunicados', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const comunicados = await pool.query('SELECT * FROM comunicado ORDER BY idcomunicado DESC');
        res.render('administrador/ver-comunicados', { comunicados });
    }
});

router.get('/ver-comunicados/editar-comunicado/:id', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const { id } = req.params;
        const comunicado = await pool.query('SELECT * FROM comunicado WHERE idcomunicado = ?', [id]);
        res.render('administrador/editar-comunicado', { comunicado: comunicado[0] });
    }
});

router.post('/ver-comunicados/editar-comunicado/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { titulo, subtitulo, comunicado, nivel_idnivel } = req.body;
    const editComunicado = {
        titulo,
        subtitulo,
        comunicado,
        nivel_idnivel
    };
    await pool.query('UPDATE comunicado SET ? WHERE idcomunicado = ? ', [editComunicado, id]);
    req.flash('exito', 'Comunicado editado correctamente!');
    res.redirect('/administrador/ver-comunicados');
});

router.get('/ver-comunicados/eliminar-comunicado/:id', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const { id } = req.params;
        await pool.query('DELETE FROM comentario WHERE comunicado_idcomunicado = ?', [id]);
        await pool.query('DELETE FROM comunicado WHERE idcomunicado = ?', [id]);
        req.flash('exito', 'Comunicado eliminado correctamente!');
        res.redirect('/administrador/ver-comunicados/');
    }
});

// fin crud comunicado

// INICIO RUTAS CRUD COMENTARIOS

router.get('/ver-comunicados/:id/ver-comentarios', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const comentarios = await pool.query('SELECT comentario.idcomentario, usuario.nombre, usuario.apellido, comentario.comentario FROM comentario JOIN usuario ON comentario.usuario_idusuario = usuario.idusuario JOIN comunicado ON comentario.comunicado_idcomunicado = comunicado.idcomunicado WHERE comentario.comunicado_idcomunicado = ?', [id]);
        res.render('administrador/ver-comentarios', { comentarios });
    }
});

router.get('/ver-comunicados/ver-comentarios/eliminar-comentario/:id', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const { id } = req.params;
        await pool.query('DELETE FROM comentario WHERE idcomentario = ?', [id]);
        req.flash('exito', 'Comentario eliminado correctamente');
        res.redirect('/administrador/ver-comunicados');
    }
});

// INICIO RUTAS CRUD NIÑOS

router.get('/agregar-ninio', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const apoderado = await pool.query('SELECT usuario.idusuario, usuario.rut, usuario.nombre, usuario.apellido FROM usuario WHERE id_tipousuario = 4');
        res.render('administrador/agregar-ninio', {apoderado});
    }
});

router.post('/agregar-ninio', isLoggedIn, async (req, res) => {
    //seleccionamos desde el formulario segun name
    const { rut } = req.body;
    const { nombre } = req.body;
    const { apellido } = req.body;
    const { edad } = req.body;
    const { fecha_nac } = req.body;
    const { sexo } = req.body;
    const { nivel_idnivel } = req.body;
    const { usuario_idusuario } = req.body;

    const newKid = {
        rut,
        nombre,
        apellido,
        edad,
        fecha_nac,
        sexo,
        nivel_idnivel,
        usuario_idusuario
    };

    const rutRegistrado = await pool.query('SELECT * FROM niño WHERE rut = ?', [rut]);

    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        if (rutRegistrado.length > 0) {
            req.flash('error', 'El Niño(a) ya está registrado!');
            res.redirect('/administrador/agregar-ninio');
        } else {
            await pool.query('INSERT INTO niño SET ?', [newKid]);
            req.flash('exito', 'Niño(a) agregado correctamente!');
            res.redirect('/administrador/ver-ninios');
        }
    }
});

router.get('/ver-ninios', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const nino = await pool.query('SELECT niño.rut, niño.nombre, niño.apellido, niño.edad, niño.fecha_nac, niño.sexo, nivel.nombre as nivel, usuario.nombre as nombreApoderado, usuario.apellido as apellidoApoderado FROM niño JOIN usuario ON usuario.idusuario = niño.usuario_idusuario JOIN nivel ON niño.nivel_idnivel = nivel.idnivel');
        res.render('administrador/ver-ninios', { nino });
    }
});

router.get('/editar-ninio/:id', isLoggedIn ,async (req, res) =>{
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    }else{
        const { id } = req.params;
        const ninos = await pool.query('SELECT niño.rut, niño.nombre, niño.apellido, niño.edad, niño.fecha_nac, niño.sexo, nivel.idnivel as nivel, usuario.idusuario as idApoderado, usuario.rut rutApoderado, usuario.nombre as nombreApoderado, usuario.apellido as apellidoApoderado FROM niño JOIN nivel ON niño.nivel_idnivel = nivel.idnivel JOIN usuario ON niño.usuario_idusuario = usuario.idusuario WHERE niño.rut =?', [id]);
        const apoderados = await pool.query('SELECT * FROM usuario WHERE id_tipousuario = 4')
        res.render('administrador/editar-ninio', { nino: ninos[0], apoderados });
    }
});

router.post('/editar-ninio/:id', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const { id } = req.params;
        const { rut, nombre, apellido, edad, fecha_nac, sexo, nivel_idnivel, usuario_idusuario} = req.body;
        const editKid = {
            rut,
            nombre,
            apellido,
            edad,
            fecha_nac,
            sexo,
            nivel_idnivel,
            usuario_idusuario
        };
        await pool.query('UPDATE niño SET ? WHERE rut = ? ', [editKid, id]);
        req.flash('exito', 'Niño(a) editado correctamente!');
        res.redirect('/administrador/ver-ninios');
    }
});

router.get('/eliminar-ninio/:id', isLoggedIn, async (req, res) => {
    if (req.user.id_tipousuario != 1) {
        req.flash('error', 'Acceso restringido');
        res.redirect('/perfil');
    } else {
        const { id } = req.params;
        await pool.query('DELETE FROM niño WHERE rut = ?', [id]);
        req.flash('exito', 'Niñ@ eliminado correctamente!');
        res.redirect('/administrador/ver-ninios');
    }
});

module.exports = router;