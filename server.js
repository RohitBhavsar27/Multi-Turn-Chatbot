const PORT = process.env.PORT || 8000;
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

app.use(express.static(path.join(__dirname, 'build')));

app.post('/api/gemini', async (req, res) => {
    console.log(req.body.history);
    console.log(req.body.message);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const chat = model.startChat({
        history: req.body.history,
    });
    const msg = req.body.message;

    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    res.send(text);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
