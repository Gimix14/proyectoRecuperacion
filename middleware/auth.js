module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated && req.isAuthenticated()) {
            return next(); // Continua usuario autenticado
        }
        req.flash('error_msg', 'Por favor, inicia sesión para acceder.');
        res.redirect('/users/login'); // Redirige al login si no esta autenticado
    },
};
