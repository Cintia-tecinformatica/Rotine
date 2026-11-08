import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './src/routes/usuarios.routes.js';
import taskRoutes from './src/routes/tarefas.routes.js';
import { errorMiddleware } from './src/middlewares/error.middleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', userRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API do Rotine funcionando com sucesso! 🚀' });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});