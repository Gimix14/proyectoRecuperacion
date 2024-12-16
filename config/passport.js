const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Modelo Usuario
const User = require('../models/User');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                // Buscar usuario por correo
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'El correo no está registrado.' });
                }

                // Validar contraseña
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Contraseña incorrecta.' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).exec(); // Usa .exec() para ejecutar la consulta
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};