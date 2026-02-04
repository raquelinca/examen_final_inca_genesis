const taskRepository = require('../repositories/taskRepository');

class TaskService {
  // Validación obligatoria: DONE requiere descripción de al menos 10 caracteres
  validateDoneStatus(status, description) {
    if (status === 'DONE') {
      if (!description || description.trim().length < 10) {
        const error = new Error('Cannot set status to DONE: description must have at least 10 characters');
        error.statusCode = 400;
        throw error;
      }
    }
  }

  async getAllTasks() {
    return await taskRepository.findAll();
  }

  async getTaskById(id) {
    const task = await taskRepository.findById(id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    return task;
  }

  async createTask(taskData) {
    // Validar regla de DONE antes de crear
    this.validateDoneStatus(taskData.status, taskData.description);
    
    try {
      return await taskRepository.create(taskData);
    } catch (error) {
      // Manejar errores de validación de Sequelize
      if (error.name === 'SequelizeValidationError') {
        const validationError = new Error(error.errors[0].message);
        validationError.statusCode = 400;
        throw validationError;
      }
      throw error;
    }
  }

  async updateTask(id, taskData) {
    // Validar regla de DONE antes de actualizar
    this.validateDoneStatus(taskData.status, taskData.description);
    
    try {
      const task = await taskRepository.update(id, taskData);
      if (!task) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
      }
      return task;
    } catch (error) {
      // Manejar errores de validación de Sequelize
      if (error.name === 'SequelizeValidationError') {
        const validationError = new Error(error.errors[0].message);
        validationError.statusCode = 400;
        throw validationError;
      }
      throw error;
    }
  }

  async deleteTask(id) {
    const task = await taskRepository.delete(id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    return task;
  }
}

module.exports = new TaskService();
