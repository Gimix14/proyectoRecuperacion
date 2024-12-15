const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Modelo de Usuario
const User = require('../models/User');

// Ruta: Formulario de Registro
router.get('/register', (req, res) => {
    res.render('users/register', { title: 'Registro' });
});

// Ruta: Procesar Registro
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Validaciones
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Por favor, completa todos los campos.' });
    }
    if (password !== password2) {
        errors.push({ msg: 'Las contraseñas no coinciden.' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    if (errors.length > 0) {
        res.render('users/register', { errors, name, email, password, password2 });
    } else {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                req.flash('error_msg', 'El correo ya está registrado.');
                return res.redirect('/users/register');
            }

            // Crear nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ name, email, password: hashedPassword });
            await newUser.save();

            req.flash('success_msg', 'Registro exitoso. Ahora puedes iniciar sesión.');
            res.redirect('/users/login');
        } catch (err) {
            console.error(err);
            res.redirect('/users/register');
        }
    }
});

// Ruta: Formulario de Inicio de Sesión
router.get('/login', (req, res) => {
    res.render('users/login', { title: 'Iniciar Sesión' });
});

// Ruta: Procesar Inicio de Sesión
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/articles',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
});

// Ruta: Cerrar Sesión
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success_msg', 'Sesión cerrada correctamente.');
        res.redirect('/users/login');
    });
});

module.exports = router;
