const pool = require('../database');

async function isAdmin(req, res){
    const resultado = await pool.query('SELECT id_tipousuario FROM usuario WHERE idusuario = ?', req.user.idusuario);
    if (resultado === 1){
        return true;
    }    
}

async function isParvulario(req, res){
    const resultado = await pool.query('SELECT id_tipousuario FROM usuario WHERE idusuario = ?', req.user.idusuario);
    if (resultado === 2){
        return true;
    }    
}

async function isDirectivo(req, res){
    const resultado = await pool.query('SELECT id_tipousuario FROM usuario WHERE idusuario = ?', req.user.idusuario);
    if (resultado === 3){
        return true;
    }    
}

async function isApoderado(req, res){
    const resultado = await pool.query('SELECT id_tipousuario FROM usuario WHERE idusuario = ?', req.user.idusuario);
    if (resultado === 4){
        return true;
    }    
}

module.exports = {
    isLoggedIn(req, res, next) {
        if (isAdmin() && req.isAuthenticated()) {
            return res.redirect('/administrador');
        } else if (isParvulario() && req.isAuthenticated()){
            return res.redirect('/agregar');
        }
        
    },

    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/perfil');
    }
};