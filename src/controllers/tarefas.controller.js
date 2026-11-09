import * as taskService from '../services/tarefas.service.js';

export async function create(req, res) {
    try {
        const task = await taskService.createTask(req.userId, req.body);
        return res.status(201).json(task);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function getAll(req, res) {
    try{
        const tasks = await taskService.getTasksByUser(req.userId, req.query);
        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function update(req, res) {
    try {
        const { id } = req.params;
        const updatedTask = await taskService.updateTask(req.userId, Number(id), req.body);
        return res.status(200).json(updatedTask);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function remove(req, res) {
    try {
        const { id } = req.params;
        const result = await taskService.deleteTask(req.userId, Number(id));
        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}