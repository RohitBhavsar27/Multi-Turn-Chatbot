const PORT = process.env.PORT || 8000;
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Allow only your frontend's domain (onRender.com)
const allowedOrigins = ['https://gemini-clone--q5ix.onrender.com'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
}));

app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

app.post('/api/gemini', async (req, res) => {
    console.log(req.body.history);
    console.log(req.body.message);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({
        history: req.body.history,
    });
    const msg = req.body.message;

    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    res.send(text);
});

app.get('/', (req, res) => {
    res.send('✅ Gemini backend is up and running!');
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
