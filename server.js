import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/usuarios.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', userRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: 'API do Rotine funcionando com sucesso! 🚀' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});