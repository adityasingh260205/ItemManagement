const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Item = require('../models/Item');

// GET /api/items/search?name=xyz
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;
        const items = await Item.find({ itemName: { $regex: name, $options: 'i' } });
        res.json(items);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET /api/items (View all)
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST /api/items (Add item - Protected)
router.post('/', auth, async (req, res) => {
    try {
        const newItem = new Item({ ...req.body, user: req.user.id });
        const item = await newItem.save();
        res.json(item);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// PUT /api/items/:id (Update - Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        let item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        if (item.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized access' });

        item = await Item.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(item);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// DELETE /api/items/:id (Delete - Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        if (item.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Unauthorized access' });

        await Item.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Item removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;