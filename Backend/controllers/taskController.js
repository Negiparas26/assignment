const { Task, User } = require('../models');

exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority, deadline, assignedTo } = req.body;
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            deadline,
            userId: assignedTo || req.user.id // Assign to self if not specified (or handle logic)
        });
        
        // Real-time update
        const io = req.app.get('socketio');
        io.emit('taskCreated', task);

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, priority, search } = req.query;
        const offset = (page - 1) * limit;
        const where = {};
        
        if (status) where.status = status;
        if (priority) where.priority = priority;
        // Add search logic if needed

        const tasks = await Task.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            include: [{ model: User, as: 'assignee', attributes: ['id', 'username'] }],
            order: [['createdAt', 'DESC']]
        });
        
        res.json({
            data: tasks.rows,
            meta: {
                total: tasks.count,
                page: parseInt(page),
                totalPages: Math.ceil(tasks.count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Task.update(req.body, { where: { id } });
        
        if (updated) {
            const updatedTask = await Task.findByPk(id);
            
            // Real-time update
            const io = req.app.get('socketio');
            io.emit('taskUpdated', updatedTask);
            
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Task.destroy({ where: { id } });
        
        if (deleted) {
             // Real-time update
            const io = req.app.get('socketio');
            io.emit('taskDeleted', id);
            
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
