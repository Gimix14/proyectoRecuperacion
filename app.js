const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

const app = express();


require('./config/passport')(passport);

// Configuracion handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

// Middleware formularios
app.use(express.urlencoded({ extended: true }));


app.use(methodOverride('_method'));

// Configuracion sesiones
app.use(
    session({
        secret: 'secret', // Cambiar a una cadena mas segura
        resave: true,
        saveUninitialized: true,
    })
);

// Iniciar Passport y sesiones
app.use(passport.initialize());
app.use(passport.session());

// Mensajes Flash
app.use(flash());

// Variables globales 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; 
    next();
});

// Rutas principales
const userRoutes = require('./routes/users'); // Rutas para usuarios 
const articleRoutes = require('./routes/articles'); // Rutas para articulos

// rutas
app.use('/users', userRoutes);
app.use('/articles', articleRoutes);

// Ruta principal
app.get('/', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.redirect('/articles'); 
    }
    res.redirect('/users/login'); 
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'Acerca de' });
});

// Puerto y servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

const mongoURI = 'mongodb://localhost:27017/proyecto_db'; 
mongoose
    .connect(mongoURI)
    .then(() => console.log('MongoDB conectado'))
    .catch((err) => console.error('Error al conectar MongoDB:', err));