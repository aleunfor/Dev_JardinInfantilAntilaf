const { setRandomFallback } = require('bcryptjs');
const express = require('express');
const router = express.Router();
const app = express();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth')

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get('/agregar-comunicado', isLoggedIn, (req, res) => {
    if (req.user.id_tipousuario === 2 || req.user.id_tipousuario === 3 || req.user.id_tipousuario === 1) {
        res.render('comunicados/agregar-comunicado');
    } else {
        req.flash('error', 'Acceso no autorizado');
        res.redirect('/perfil');
    }

});

router.post('/agregar-comunicado', isLoggedIn, async (req, res) => {
    const fecha_creacion = new Date();
    const { titulo, subtitulo, comunicado, nivel_idnivel } = req.body;
    const newComunicado = {
        titulo,
        subtitulo,
        comunicado,
        fecha_creacion,
        autor: req.user.nombre + ' ' + req.user.apellido,
        idusuario: req.user.idusuario,
        nivel_idnivel
    };
    await pool.query('INSERT INTO comunicado set ?', [newComunicado]);
    req.flash('exito', 'Comunicado Guardado Correctamente!');
    res.render('comunicados/exito-comunicado');
});

router.get('/mis-comunicados', isLoggedIn, async (req, res) => {
    const comunicado = await pool.query('SELECT * FROM comunicado  idcomunicado WHERE idusuario = ?', [req.user.idusuario] + 'ORDER BY idcomunicado DESC');
    res.render('comunicados/mis-comunicados', { comunicado });
});

router.get('/eliminar/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM comunicado WHERE idcomunicado = ?', [id]);
    await pool.query('DELETE FROM comentario WHERE comunicado_idcomunicado = ?', [id]);
    req.flash('exito', 'Comunicado eliminado correctamente!');
    res.redirect('/comunicados/mis-comunicados');
});

router.get('/editar-comunicado/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const comunicados = await pool.query('SELECT * FROM comunicado WHERE idcomunicado = ?', [id]);
    res.render('comunicados/editar-comunicado', { comunicado: comunicados[0] });
});

router.post('/editar-comunicado/:id', isLoggedIn, async (req, res) => {
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
    res.redirect('/comunicados/mis-comunicados');
});

router.get('/vercomunicado/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const nombre = req.user.nombre;
    const apellido = req.user.apellido;
    const usuario = {
        nombre,
        apellido
    };

    //seleccion de comunicado segun id
    const comunicados = await pool.query('SELECT * FROM comunicado WHERE idcomunicado = ?', [id]);

    //seleccion de comentarios segun id de comunicado
    const comentarios = await pool.query('SELECT usuario.nombre, usuario.apellido, comentario.comentario FROM comentario JOIN usuario ON comentario.usuario_idusuario = usuario.idusuario WHERE comunicado_idcomunicado = ?', [id] + ' ORDER BY idcomentario DESC');
    res.render('comunicados/vercomunicado', { comunicado: comunicados[0], usuario: usuario, comentarios });
});

router.post('/vercomunicado/:id/agregar-comentario', async (req, res) => {
    const { id } = req.params;
    const comunicado_idcomunicado = id;
    const usuario_idusuario = req.user.idusuario;
    const { comentario } = req.body;
    const newComentario = {
        comentario,
        comunicado_idcomunicado,
        usuario_idusuario
    };
    await pool.query('INSERT INTO comentario set ?', [newComentario]);
    req.flash('exito', 'Comentario agregado!');
    res.redirect('/comunicados/vercomunicado/' + id);
});


// Mostrar comunicados por nivel
router.get('/sala-cuna', async (req, res) => {
    const comunicado = await pool.query('SELECT * FROM comunicado WHERE nivel_idnivel = 1 ORDER BY idcomunicado DESC');
    res.render('comunicados/sala-cuna', { comunicado });
});

router.get('/nivel-medio', async (req, res) => {
    const comunicado = await pool.query('SELECT * FROM comunicado WHERE nivel_idnivel = 2 ORDER BY idcomunicado DESC');
    res.render('comunicados/sala-cuna', { comunicado });
});


// SUBIDA DE IMAGENES
router.post('/upload', multipartMiddleware, (req, res) => {

    var fs = require('fs');

    fs.readFile(req.files.upload.path, (err, data) => {
        var newPath = 'www/public/uploads/' + req.files.upload.name;
        fs.writeFile(newPath, data, function (err) {
            if (err) console.log({err: err});
            else {
                html = "";
                html += "<script type='text/javascript'>";
                html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                html += "    var url     = \"/uploads/" + req.files.upload.name + "\";";
                html += "    var message = \"Uploaded file successfully\";";
                html += "";
                html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                html += "</script>";

                res.send(html);
            }
        });
    });
});

router.get('/imagenes', isLoggedIn, function (req, res){

    let fs = require('fs');
    
    const images = fs.readdirSync('www/public/uploads');
    let sorted = [];
    for (let item of images){
        if(item.split('.').pop() === 'png' 
        || item.split('.').pop() === 'jpg' 
        || item.split('.').pop() === 'jpeg' 
        || item.split('.').pop() === 'svg'){
            let abc = {
                "image" : "/uploads/"+item,
                "folder" : '/'
            }
            sorted.push(abc);
        }
    }
    res.send(sorted);
});

router.post('/eliminar-imagen', isLoggedIn, (req, res) =>{
    let fs = require('fs');
    const { url } = req.body;
    console.log(+url);
        fs.unlink('www/public'+url, (err => {
            if(err) {
                res.send('<a href="/ckeditor/plugins/imagebrowser/browser/browser.html?listUrl=%2Fcomunicados%2Fimagenes&CKEditor=comunicado&CKEditorFuncNum=1&langCode=es">Volver</a>');
                console.log('error');
            }
            else{
                res.send('<h1 style="font-weight:bold;">Eliminado Correctamente!</h1><br><a href="/ckeditor/plugins/imagebrowser/browser/browser.html?listUrl=%2Fcomunicados%2Fimagenes&CKEditor=comunicado&CKEditorFuncNum=1&langCode=es">Volver</a>');
            }
        }));

});


module.exports = router;