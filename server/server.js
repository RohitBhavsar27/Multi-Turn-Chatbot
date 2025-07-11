const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Allow only your frontend's domain (onRender.com)
// const allowedOrigins = ['https://multi-turn-chatbot.onrender.com'];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET', 'POST'],
// }));

app.use(cors());

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // ✅ Use GEMINI_API_KEY here (not REACT_APP_...)

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
