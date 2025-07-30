const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const user = require('./routes/account');
const label = require('./routes/labels');
const download = require('./routes/download');
const current = require('./routes/current');

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin: ['http://192.168.27.50:5173', 'https://imagemark-studio-1.onrender.com'],
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api', user);
app.use('/api', label);
app.use('/api', download);
app.use('/api', current);


app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});
