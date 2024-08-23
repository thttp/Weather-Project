const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.API_KEY;

    if (!city) {
        return res.status(400).json({ error: 'Cidade não informada.' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.response ? error.response.data.message : 'Erro ao obter os dados do clima.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
