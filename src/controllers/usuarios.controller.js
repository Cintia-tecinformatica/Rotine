import * as userService from '../services/usuarios.service.js';

export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || ! password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const newUser = await userService.registerUser(name, email, password);

        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Informe o e-mail e a sneha.' });
        }

        const result = await userService.loginUser(email, password);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
}