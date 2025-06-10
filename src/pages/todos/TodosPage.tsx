import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  CheckSquare,
  Square,
  Calendar,
  User,
  AlertTriangle,
  Clock,
  Edit,
  Trash2,
  Bell
} from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Todo {
  id: string;
  titre: string;
  description: string;
  clientId?: string;
  clientNom?: string;
  dateEcheance: string;
  priorite: 'faible' | 'normale' | 'haute' | 'urgente';
  statut: 'en_attente' | 'en_cours' | 'termine';
  type: 'rappel' | 'tache' | 'suivi';
  dateCreation: string;
  assigneA?: string;
}

const TodosPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');
  const [priorityFilter, setPriorityFilter] = useState<string>('tous');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    clientId: '',
    dateEcheance: '',
    priorite: 'normale' as const,
    type: 'tache' as const,
    assigneA: ''
  });

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTodos([
          {
            id: '1',
            titre: 'Rappeler Martin Dubois',
            description: 'Confirmer les dates de voyage pour le package Rome',
            clientId: '1',
            clientNom: 'Martin Dubois',
            dateEcheance: '2024-01-20T10:00:00Z',
            priorite: 'haute',
            statut: 'en_attente',
            type: 'rappel',
            dateCreation: '2024-01-15T09:00:00Z',
            assigneA: 'Sophie Martin'
          },
          {
            id: '2',
            titre: 'Finaliser devis Entreprise ABC',
            description: 'Préparer le devis détaillé pour le séminaire de 3 jours',
            clientId: '2',
            clientNom: 'Entreprise ABC',
            dateEcheance: '2024-01-18T16:00:00Z',
            priorite: 'urgente',
            statut: 'en_cours',
            type: 'tache',
            dateCreation: '2024-01-14T14:00:00Z'
          },
          {
            id: '3',
            titre: 'Suivi satisfaction client',
            description: 'Appeler Sophie Martin pour recueillir ses impressions sur le voyage',
            clientId: '3',
            clientNom: 'Sophie Martin',
            dateEcheance: '2024-01-25T14:30:00Z',
            priorite: 'normale',
            statut: 'termine',
            type: 'suivi',
            dateCreation: '2024-01-12T11:00:00Z'
          }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des tâches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!formData.titre || !formData.dateEcheance) return;

    try {
      const newTodo: Todo = {
        id: Date.now().toString(),
        titre: formData.titre,
        description: formData.description,
        clientId: formData.clientId || undefined,
        clientNom: formData.clientId ? 'Client sélectionné' : undefined,
        dateEcheance: new Date(formData.dateEcheance).toISOString(),
        priorite: formData.priorite,
        statut: 'en_attente',
        type: formData.type,
        dateCreation: new Date().toISOString(),
        assigneA: formData.assigneA || undefined
      };

      setTodos(prev => [newTodo, ...prev]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  const handleToggleStatus = async (todoId: string) => {
    try {
      setTodos(prev => prev.map(todo => {
        if (todo.id === todoId) {
          const newStatus = todo.statut === 'termine' ? 'en_attente' : 
                           todo.statut === 'en_attente' ? 'en_cours' : 'termine';
          return { ...todo, statut: newStatus };
        }
        return todo;
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDeleteTodo = async () => {
    if (!selectedTodo) return;

    try {
      setTodos(prev => prev.filter(todo => todo.id !== selectedTodo.id));
      setShowDeleteModal(false);
      setSelectedTodo(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      clientId: '',
      dateEcheance: '',
      priorite: 'normale',
      type: 'tache',
      assigneA: ''
    });
  };

  const openEditModal = (todo: Todo) => {
    setSelectedTodo(todo);
    setFormData({
      titre: todo.titre,
      description: todo.description,
      clientId: todo.clientId || '',
      dateEcheance: new Date(todo.dateEcheance).toISOString().slice(0, 16),
      priorite: todo.priorite,
      type: todo.type,
      assigneA: todo.assigneA || ''
    });
    setShowEditModal(true);
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (todo.clientNom && todo.clientNom.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'tous' || todo.statut === statusFilter;
    const matchesPriority = priorityFilter === 'tous' || todo.priorite === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case 'urgente': return 'danger';
      case 'haute': return 'warning';
      case 'normale': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'termine': return 'success';
      case 'en_cours': return 'info';
      default: return 'warning';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rappel': return <Bell className="w-4 h-4" />;
      case 'suivi': return <User className="w-4 h-4" />;
      default: return <CheckSquare className="w-4 h-4" />;
    }
  };

  const isOverdue = (dateEcheance: string) => {
    return new Date(dateEcheance) < new Date() && todos.find(t => t.dateEcheance === dateEcheance)?.statut !== 'termine';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tâches & Rappels</h1>
          <p className="text-gray-600">Gérer vos tâches et rappels clients</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Tâche
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-blue-100">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total tâches</p>
              <p className="text-2xl font-bold text-gray-900">{todos.length}</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {todos.filter(t => t.statut === 'en_attente').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-green-100">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminées</p>
              <p className="text-2xl font-bold text-gray-900">
                {todos.filter(t => t.statut === 'termine').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En retard</p>
              <p className="text-2xl font-bold text-gray-900">
                {todos.filter(t => isOverdue(t.dateEcheance)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une tâche..."
                className="w-full pl-10 input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              className="input-field w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="tous">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
            <select
              className="input-field w-auto"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="tous">Toutes priorités</option>
              <option value="faible">Faible</option>
              <option value="normale">Normale</option>
              <option value="haute">Haute</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des tâches */}
      <div className="card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Tâche</TableHeaderCell>
              <TableHeaderCell>Client</TableHeaderCell>
              <TableHeaderCell>Échéance</TableHeaderCell>
              <TableHeaderCell>Priorité</TableHeaderCell>
              <TableHeaderCell>Statut</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTodos.map((todo) => (
              <TableRow key={todo.id} className={isOverdue(todo.dateEcheance) ? 'bg-red-50' : ''}>
                <TableCell>
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => handleToggleStatus(todo.id)}
                      className="mt-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {todo.statut === 'termine' ? (
                        <CheckSquare className="w-5 h-5 text-green-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(todo.type)}
                        <p className={`font-medium ${todo.statut === 'termine' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {todo.titre}
                        </p>
                        {isOverdue(todo.dateEcheance) && (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{todo.description}</p>
                      {todo.assigneA && (
                        <p className="text-xs text-blue-600 mt-1">Assigné à: {todo.assigneA}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {todo.clientNom ? (
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{todo.clientNom}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className={`text-sm ${isOverdue(todo.dateEcheance) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {new Date(todo.dateEcheance).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(todo.dateEcheance).toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityColor(todo.priorite)} size="sm">
                    {todo.priorite.charAt(0).toUpperCase() + todo.priorite.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(todo.statut)} size="sm">
                    {todo.statut === 'en_attente' ? 'En attente' :
                     todo.statut === 'en_cours' ? 'En cours' : 'Terminé'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(todo)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTodo(todo);
                        setShowDeleteModal(true);
                      }}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredTodos.length === 0 && (
          <div className="text-center py-8">
            <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune tâche trouvée</p>
          </div>
        )}
      </div>

      {/* Modal ajout tâche */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Nouvelle tâche"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.titre}
              onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
              placeholder="Titre de la tâche"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="input-field"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description détaillée"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                className="input-field"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              >
                <option value="tache">Tâche</option>
                <option value="rappel">Rappel</option>
                <option value="suivi">Suivi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité *
              </label>
              <select
                className="input-field"
                value={formData.priorite}
                onChange={(e) => setFormData(prev => ({ ...prev, priorite: e.target.value as any }))}
              >
                <option value="faible">Faible</option>
                <option value="normale">Normale</option>
                <option value="haute">Haute</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date et heure d'échéance *
            </label>
            <input
              type="datetime-local"
              className="input-field"
              value={formData.dateEcheance}
              onChange={(e) => setFormData(prev => ({ ...prev, dateEcheance: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigné à
            </label>
            <input
              type="text"
              className="input-field"
              value={formData.assigneA}
              onChange={(e) => setFormData(prev => ({ ...prev, assigneA: e.target.value }))}
              placeholder="Nom de la personne assignée"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              onClick={handleAddTodo}
              disabled={!formData.titre || !formData.dateEcheance}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer la tâche
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTodo(null);
        }}
        title="Confirmer la suppression"
      >
        {selectedTodo && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer la tâche{' '}
              <strong>"{selectedTodo.titre}"</strong> ?
            </p>
            <p className="text-sm text-red-600">
              Cette action est irréversible.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteTodo}
                className="btn-danger"
              >
                Supprimer
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedTodo(null);
                }}
                className="btn-secondary"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TodosPage;