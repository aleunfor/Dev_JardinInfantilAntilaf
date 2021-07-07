const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth')
const helpers = require('../lib/helpers');

router.get('/', async (req, res) => {
    const usuario = await pool.query('SELECT * FROM usuario');
    const comunicado = await pool.query('SELECT * FROM comunicado ORDER BY DESC');
    const totalUsuarios = await pool.query('SELECT COUNT(idusuario) as usuarios FROM usuario');
    const totalComunicados = await pool.query('SELECT COUNT(idcomunicado) as comunicados FROM comunicado');
    const totalComentarios = await pool.query('SELECT COUNT(idcomentario) as comentarios FROM comentario');
    res.render('index', { comunicado, usuario : usuario [0], totalUsuarios:totalUsuarios[0], totalComunicados:totalComunicados[0], totalComentarios:totalComentarios[0]});
});

router.get('/editar-perfil', isLoggedIn ,async (req, res) =>{
  const usuario = await pool.query('SELECT * FROM usuario WHERE idusuario = ?', req.user.idusuario);
  res.render('editar-perfil', {usuario : usuario[0]});
});

router.post('/editar-perfil', isLoggedIn, async (req, res) =>{
    const { rut, nombre, apellido, fecha_nac, direccion, telefono, username } = req.body;
    const editUser = {
        rut,
        nombre,
        apellido,
        fecha_nac,
        direccion,
        telefono,
        username
    };
    await pool.query('UPDATE usuario SET ? WHERE idusuario = ? ', [editUser, req.user.idusuario]);
    req.flash('exito', 'Has editado tus datos!');
    res.redirect('/perfil');
});

module.exports = router;