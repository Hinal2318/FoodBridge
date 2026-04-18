require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./routes/Auth'));
app.use('/api/food', require('./routes/Food'));
app.use('/api/request', require('./routes/Request'));
app.use('/api/stats', require('./routes/Stats'));

app.get('/', (_req, res) => res.json({ message: 'Food Waste API running ✅' }));

app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(process.env.PORT, () =>
            console.log(`🚀 Server on http://localhost:${process.env.PORT}`)
        );
    })
    .catch((err) => { console.error('❌ DB failed:', err.message); process.exit(1); });