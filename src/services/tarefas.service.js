import prisma from '../prisma.js';

export async function createTask(userId, data) {
    const { title, description, status, priority, dueDate } = data;

    if (!title) {
        throw new Error('O título da tarefa é obrigatório.');
    }

    const statusPermitidos = ['PENDING', 'IN_PROGRESS', 'COMPLETED']; // ajuste conforme o seu schema.prisma
    if (data.status && !statusPermitidos.includes(data.status)) {
        const error = new Error('Status inválido. Use PENDING, IN_PROGRESS ou COMPLETED.');
        error.statusCode = 400;
        throw error;
    }

    const task = await prisma.task.create({
        data: {
            title,
            description,
            status: status || 'PENDING',
            priority: priority || 'MEDIUM',
            dueDate: dueDate ? new Date(dueDate) : null,
            userId
        }
    });
    return task;
}

export async function getTasksByUser(userId, queryFilters) {
    const { status, priority } = queryFilters;

    const filters = { userId };
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const tasks = await prisma.task.findMany({
        where: filters,
        orderBy: { createdAt: 'desc' }
    });

    return tasks;
}

export async function updateTask(userId, taskId, data) {
    if (isNaN(taskId)) {
        const error = new Error('ID da tarefa inválido.');
        error.statusCode = 400;
        throw error;
    }

    const taskExists = await prisma.task.findFirst({
        where: { id: taskId, userId }
    });

    if (!taskExists) {
        throw new Error('Tarefa não encontrada ou você não tem permissão para editá-la.');
    }

    let formattedDueDate = undefined;

    if (data.dueDate) {
        formattedDueDate = new Date(data.dueDate);

        // Se o usuário mandou uma data em formato inválido (ex: DD/MM/AA), a conversão falha:
        if (isNaN(formattedDueDate.getTime())) {
            const error = new Error('Formato de data inválido. Utilize o padrão YYYY-MM-DD (ex: 2026-06-15).');
            error.statusCode = 400;
            throw error;
        }
    }

    const updateTask = await prisma.task.update({
        where: { id: taskId },
        data: {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined
        }
    });

    return updateTask;
}

export async function deleteTask(userId, taskId) {
    if (isNaN(taskId)) {
        const error = new Error('ID da tarefa inválido.');
        error.statusCode = 400;
        throw error;
    }

    const taskExists = await prisma.task.findFirst({
        where: { id: taskId, userId }
    });

    if (!taskExists) {
        throw new Error('Tarefa não encontrada ou você não tem permissão para excluí-la.');
    }

    await prisma.task.delete({
        where: { id: taskId }
    });

    return { message: 'Tarefa excluída com sucesso.' };
}