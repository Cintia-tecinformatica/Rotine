import prisma from '../prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function registerUser(name, email, password) {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
        throw new Error('Este e-mail já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    });

    return user;
}

export async function loginUser(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('E-mail ou senha inválidos.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('E-mail ou senha inválidos.');
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
    };
}