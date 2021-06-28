const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
const handlebars = require('handlebars');

const { database } = require('./keys');
//inicializaciones
const app = express();
require('./lib/passport');

// Imagenes subidas



//Registro de un hbs que compara terminos Ej: (if == 1)
handlebars.registerHelper("when", function (operand_1, operator, operand_2, options) {
    var operators = {
        'eq': function (l, r) { return l == r; },
        'noteq': function (l, r) { return l != r; },
        'gt': function (l, r) { return Number(l) > Number(r); },
        'or': function (l, r) { return l || r; },
        'and': function (l, r) { return l && r; },
        '%': function (l, r) { return (l % r) === 0; }
    }
        , result = operators[operator](operand_1, operand_2);

    if (result) return options.fn(this);
    else return options.inverse(this);
});

//configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

//middlewares (peticiones al servidor)
app.use(session({
    secret: "jardininfantilantilafsession",
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
})); // sesiones alojadas en la BD
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false })); //aceptar formularios sencillos
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


// Variables globales
app.use((req, res, next) => {
    app.locals.exito = req.flash('exito');
    app.locals.message = req.flash('message');
    app.locals.error = req.flash('error');
    app.locals.user = req.user;
    next();
})

// Rutas (url del servidor)
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/comunicados', require('./routes/comunicados'));

//Rutas admin
app.use('/administrador', require('./routes/administrador'));

// Archivos Publicos
app.use(express.static(path.join(__dirname, 'public')));

//middleware pagina no encontrada
app.use(function(req,res){
    res.status(404).render('404');
});

// Iniciar Servidor
app.listen(app.get('port'), () => {
    console.log('Server en el puerto', app.get('port'));
});