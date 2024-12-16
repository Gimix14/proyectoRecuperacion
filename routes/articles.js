const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Article = require('../models/Article');

// Listar articulos
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const articles = await Article.find().lean();
        res.render('articles/index', { articles });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error al cargar los artículos.');
        res.redirect('/');
    }
});

// Formulario agregar un articulo
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('articles/add');
});

// Procesar nuevo articulo
router.post('/', ensureAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    const errors = [];

    // Validaciones
    if (!title) errors.push({ msg: 'El título es obligatorio.' });
    if (!content) errors.push({ msg: 'El contenido es obligatorio.' });

    if (errors.length > 0) {
        res.render('articles/add', { errors, title, content });
    } else {
        try {
            const newArticle = new Article({ title, content });
            await newArticle.save();
            req.flash('success_msg', 'Artículo agregado exitosamente.');
            res.redirect('/articles');
        } catch (err) {
            console.error(err);
            req.flash('error_msg', 'Error al guardar el artículo.');
            res.redirect('/articles');
        }
    }
});

// Formulario editar articulo
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).lean();
        if (!article) {
            req.flash('error_msg', 'Artículo no encontrado.');
            return res.redirect('/articles');
        }
        res.render('articles/edit', { article });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error al cargar el artículo.');
        res.redirect('/articles');
    }
});

// Procesar edicion de un articulo
router.put('/:id', ensureAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    try {
        await Article.findByIdAndUpdate(req.params.id, { title, content });
        req.flash('success_msg', 'Artículo actualizado correctamente.');
        res.redirect('/articles');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error al actualizar el artículo.');
        res.redirect('/articles');
    }
});

// Eliminar un articulo
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Artículo eliminado exitosamente.');
        res.redirect('/articles');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error al eliminar el artículo.');
        res.redirect('/articles');
    }
});

module.exports = router;
