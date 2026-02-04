const { Task } = require('../config/models');

class TaskRepository {
  async findAll() {
    return await Task.findAll({
      order: [['createdAt', 'DESC']]
    });
  }

  async findById(id) {
    return await Task.findByPk(id);
  }

  async create(taskData) {
    return await Task.create(taskData);
  }

  async update(id, taskData) {
    const task = await Task.findByPk(id);
    if (!task) return null;
    return await task.update(taskData);
  }

  async delete(id) {
    const task = await Task.findByPk(id);
    if (!task) return null;
    await task.destroy();
    return task;
  }
}

module.exports = new TaskRepository();
