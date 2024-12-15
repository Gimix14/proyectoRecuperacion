const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// Ruta para ver todos los artículos
router.get('/', async (req, res) => {
    const articles = await Article.find().lean();
    res.render('articles/index', { articles });
});

// Ruta para agregar un artículo
router.get('/add', (req, res) => {
    res.render('articles/add');
});

router.post('/', async (req, res) => {
    const { title, content } = req.body;
    const newArticle = new Article({ title, content });
    await newArticle.save();
    req.flash('success_msg', 'Artículo creado');
    res.redirect('/articles');
});

// Ruta para editar
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id).lean();
    res.render('articles/edit', { article });
});

router.put('/:id', async (req, res) => {
    const { title, content } = req.body;
    await Article.findByIdAndUpdate(req.params.id, { title, content });
    req.flash('success_msg', 'Artículo actualizado');
    res.redirect('/articles');
});

// Ruta para eliminar
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Artículo eliminado');
    res.redirect('/articles');
});

module.exports = router;
