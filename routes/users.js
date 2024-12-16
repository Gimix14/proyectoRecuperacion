const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Modelo usuario
const User = require('../models/User');

// Formulario de registro
router.get('/register', (req, res) => {
    res.render('users/register', { title: 'Registro' });
});

// registro
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    const errors = [];

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
        return res.render('users/register', { errors, name, email, password, password2 });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error_msg', 'El correo ya está registrado.');
            return res.redirect('/users/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        req.flash('success_msg', 'Registro exitoso. Ahora puedes iniciar sesión.');
        res.redirect('/users/login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Hubo un problema al registrar el usuario.');
        res.redirect('/users/register');
    }
});

// Formulario inicio sesion
router.get('/login', (req, res) => {
    res.render('users/login', { title: 'Iniciar Sesión' });
});

// Procesar inicio de sesion
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/articles',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
});

// Cerrar sesion
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success_msg', 'Sesión cerrada correctamente.');
        res.redirect('/users/login');
    });
});

module.exports = router;
