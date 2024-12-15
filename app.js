const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// Inicialización
const app = express();

// Motor de plantillas Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Sesión
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// Variables globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Conexión a MongoDB
const db = require('./config/database');
mongoose
    .connect(db.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB conectado'))
    .catch((err) => console.log(err));

// Rutas
app.use('/articles', require('./routes/articles'));

// Ruta principal
app.get('/', (req, res) => {
    res.render('index');
});

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});