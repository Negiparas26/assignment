const sequelize = require('../config/database');
const User = require('./User');
const Task = require('./Task');

// Associations
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'assignee' });

module.exports = {
    sequelize,
    User,
    Task
};
