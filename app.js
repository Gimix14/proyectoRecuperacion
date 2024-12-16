const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

// Inicialización de la aplicación
const app = express();

// Configuración de Passport
require('./config/passport')(passport);

// Configuración de Handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para formularios
app.use(express.urlencoded({ extended: true }));

// Middleware para sobrescribir métodos HTTP
app.use(methodOverride('_method'));

// Configuración de sesiones
app.use(
    session({
        secret: 'secret', // Cambiar a una cadena más segura
        resave: true,
        saveUninitialized: true,
    })
);

// Inicializar Passport y sesiones
app.use(passport.initialize());
app.use(passport.session());

// Mensajes Flash
app.use(flash());

// Variables globales para mensajes Flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; // Hace que `user` esté disponible en todas las vistas
    next();
});

// Rutas principales
const userRoutes = require('./routes/users'); // Rutas para usuarios (registro, login, logout)
const articleRoutes = require('./routes/articles'); // Rutas para artículos

// Uso de las rutas
app.use('/users', userRoutes);
app.use('/articles', articleRoutes);

// Ruta principal
app.get('/', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.redirect('/articles'); // Redirige a artículos si está autenticado
    }
    res.redirect('/users/login'); // Redirige al login si no está autenticado
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'Acerca de' });
});

// Puerto y servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

const mongoURI = 'mongodb://localhost:27017/proyecto_db'; // Reemplaza con tu URI
mongoose
    .connect(mongoURI)
    .then(() => console.log('MongoDB conectado'))
    .catch((err) => console.error('Error al conectar MongoDB:', err));