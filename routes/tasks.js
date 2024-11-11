// routes/tasks.js
const express = require('express');
const router = express.Router();

// In-memory storage for tasks
let tasks = [];
let currentId = 1;

// Create a new task
router.post('/', (req, res) => {
    const { title, description, dueDate, priority } = req.body;
    if (!title || !dueDate || !priority) {
        return res.status(400).json({ message: 'Title, dueDate, and priority are required' });
    }

    const newTask = {
        id: currentId++,
        title,
        description,
        dueDate,
        priority,
        status: 'pending',
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Get all tasks with optional filtering and sorting
router.get('/', (req, res) => {
    const { status, sortBy } = req.query;

    let filteredTasks = tasks;

    // Filter by status
    if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    // Sort tasks based on query
    if (sortBy) {
        if (sortBy === 'dueDate') {
            filteredTasks = filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } else if (sortBy === 'priority') {
            filteredTasks = filteredTasks.sort((a, b) => a.priority - b.priority);
        } else if (sortBy === 'status') {
            filteredTasks = filteredTasks.sort((a, b) => a.status.localeCompare(b.status));
        }
    }

    res.json(filteredTasks);
});

// Get a single task by ID
router.get('/:id', (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
});

// Update a task by ID
router.put('/:id', (req, res) => {
    const task = tasks.find(task => task.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, dueDate, priority, status } = req.body;

    // Update task fields if provided
    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (status) task.status = status;

    res.json(task);
});

// Delete a task by ID
router.delete('/:id', (req, res) => {
    const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));
    if (taskIndex === -1) return res.status(404).json({ message: 'Task not found' });

    const deletedTask = tasks.splice(taskIndex, 1);
    res.json(deletedTask[0]);
});

module.exports = router;
