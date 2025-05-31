const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'https://market-psi-sage.vercel.app/',
};
app.use(cors(corsOptions));

app.use(express.json());

const DATA_FILE = path.join(__dirname, 'products.json');

// Чтение данных
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const raw = fs.readFileSync(DATA_FILE);
    return JSON.parse(raw);
};

// Запись данных
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Получение всех товаров
app.get('/api/products', (req, res) => {
    const products = readData();
    res.json(products);
});

// Добавление нового товара
app.post('/api/products', (req, res) => {
    const products = readData();
    const newProduct = {
        ...req.body,
        id: products.length ? Math.max(...products.map(p => p.id)) + 1 : 1,
    };
    products.push(newProduct);
    writeData(products);
    res.json(newProduct);
});

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});