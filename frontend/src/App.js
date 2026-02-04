import { useState, useEffect } from 'react';
import Button from './components/Button';
import Input from './components/Input';

const API_URL = 'http://localhost:3000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    status: 'PENDING' 
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar tareas al iniciar
  useEffect(() => {
    fetchTasks();
  }, []);

  // Función para obtener todas las tareas
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  // Función para crear o actualizar tarea
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al procesar la tarea');
      }

      // Limpiar formulario y recargar tareas
      setForm({ title: '', description: '', status: 'PENDING' });
      setEditingId(null);
      await fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para editar tarea
  const handleEdit = (task) => {
    setForm({ 
      title: task.title, 
      description: task.description || '', 
      status: task.status 
    });
    setEditingId(task.id);
    setError('');
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para cancelar edición
  const handleCancel = () => {
    setForm({ title: '', description: '', status: 'PENDING' });
    setEditingId(null);
    setError('');
  };

  // Función para eliminar tarea con confirmación
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE' 
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al eliminar la tarea');
      }

      await fetchTasks();
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'DONE':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Función para obtener el texto en español del estado
  const getStatusText = (status) => {
    switch (status) {
      case 'DONE':
        return 'Completada';
      case 'IN_PROGRESS':
        return 'En Progreso';
      case 'PENDING':
      default:
        return 'Pendiente';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            📋 Task Manager
          </h1>
          <p className="text-gray-600">Gestiona tus tareas de manera eficiente</p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 shadow">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Formulario de crear/editar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {editingId ? '✏️ Editar Tarea' : '➕ Crear Nueva Tarea'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            {/* Input: Title (componente reutilizable #1) */}
            <Input
              label="Título"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ingresa el título de la tarea"
              required={true}
            />

            {/* Input: Description (componente reutilizable #2) */}
            <Input
              label="Descripción"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ingresa una descripción (mínimo 10 caracteres para marcar como DONE)"
              multiline={true}
            />

            {/* Select: Status */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="PENDING">Pendiente</option>
                <option value="IN_PROGRESS">En Progreso</option>
                <option value="DONE">Completada</option>
              </select>
            </div>

            {/* Botones del formulario */}
            <div className="flex gap-3">
              {/* Button: Submit (componente reutilizable #1) */}
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Procesando...' : (editingId ? '💾 Guardar Cambios' : '➕ Crear Tarea')}
              </Button>
              
              {/* Button: Cancel (componente reutilizable #2) - solo si está editando */}
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  ❌ Cancelar
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de tareas */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            📝 Lista de Tareas ({tasks.length})
          </h2>
          
          {loading && tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Cargando tareas...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-6xl mb-4">📭</p>
              <p className="text-lg">No hay tareas todavía</p>
              <p className="text-sm">¡Crea tu primera tarea arriba!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gray-50"
                >
                  {/* Header de la tarea */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 flex-1">
                      {task.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ml-3 ${getStatusColor(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                  </div>
                  
                  {/* Descripción */}
                  <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                    {task.description || '(Sin descripción)'}
                  </p>
                  
                  {/* Fecha de creación */}
                  <p className="text-xs text-gray-400 mb-4">
                    Creada: {new Date(task.createdAt).toLocaleString('es-ES')}
                  </p>
                  
                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    {/* Button: Edit (componente reutilizable #3) */}
                    <Button 
                      variant="primary" 
                      onClick={() => handleEdit(task)}
                      disabled={loading}
                    >
                      ✏️ Editar
                    </Button>
                    
                    {/* Button: Delete (componente reutilizable #4) */}
                    <Button 
                      variant="danger" 
                      onClick={() => handleDelete(task.id)}
                      disabled={loading}
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            © 2026 Task Manager - Examen Final Desarrollo Web
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
