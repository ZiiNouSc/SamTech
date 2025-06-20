import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Settings,
  Mail,
  Phone
} from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Agent, Permission } from '../../types';

const AgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    permissions: [] as Permission[]
  });

  const availableModules = [
    { id: 'clients', name: 'Clients', description: 'Gestion des clients' },
    { id: 'fournisseurs', name: 'Fournisseurs', description: 'Gestion des fournisseurs' },
    { id: 'factures', name: 'Factures', description: 'Facturation' },
    { id: 'bons-commande', name: 'Bons de commande', description: 'Gestion des commandes' },
    { id: 'caisse', name: 'Caisse', description: 'Gestion de caisse' },
    { id: 'packages', name: 'Packages', description: 'Création de packages' },
    { id: 'billets', name: 'Billets d\'avion', description: 'Gestion des billets' },
    { id: 'creances', name: 'Créances', description: 'Suivi des créances' },
    { id: 'todos', name: 'Tâches', description: 'Gestion des tâches' }
  ];

  const availableActions = ['lire', 'creer', 'modifier', 'supprimer'];

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAgents([
        {
          id: '1',
          nom: 'Martin',
          prenom: 'Sophie',
          email: 'sophie.martin@agence.com',
          telephone: '+33 1 23 45 67 89',
          permissions: [
            { module: 'clients', actions: ['lire', 'creer', 'modifier'] },
            { module: 'factures', actions: ['lire', 'creer'] },
            { module: 'packages', actions: ['lire'] }
          ],
          statut: 'actif',
          dateCreation: '2024-01-10'
        },
        {
          id: '2',
          nom: 'Dubois',
          prenom: 'Jean',
          email: 'jean.dubois@agence.com',
          telephone: '+33 1 98 76 54 32',
          permissions: [
            { module: 'clients', actions: ['lire'] },
            { module: 'factures', actions: ['lire'] },
            { module: 'bons-commande', actions: ['lire', 'creer'] }
          ],
          statut: 'actif',
          dateCreation: '2024-01-08'
        },
        {
          id: '3',
          nom: 'Leroy',
          prenom: 'Marie',
          email: 'marie.leroy@agence.com',
          telephone: '+33 4 56 78 90 12',
          permissions: [
            { module: 'caisse', actions: ['lire', 'creer', 'modifier'] },
            { module: 'factures', actions: ['lire', 'creer', 'modifier'] },
            { module: 'clients', actions: ['lire', 'creer'] }
          ],
          statut: 'suspendu',
          dateCreation: '2024-01-05'
        }
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = async () => {
    if (!formData.nom || !formData.prenom || !formData.email) return;

    try {
      const newAgent: Agent = {
        id: Date.now().toString(),
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        permissions: formData.permissions,
        statut: 'actif',
        dateCreation: new Date().toISOString()
      };

      setAgents(prev => [newAgent, ...prev]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
    }
  };

  const handleToggleStatus = async (agentId: string) => {
    try {
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, statut: agent.statut === 'actif' ? 'suspendu' : 'actif' }
          : agent
      ));
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleUpdatePermissions = async () => {
    if (!selectedAgent) return;

    try {
      setAgents(prev => prev.map(agent => 
        agent.id === selectedAgent.id 
          ? { ...agent, permissions: formData.permissions }
          : agent
      ));
      setShowPermissionsModal(false);
      setSelectedAgent(null);
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des permissions:', error);
    }
  };

  const handleDeleteAgent = async () => {
    if (!selectedAgent) return;

    try {
      setAgents(prev => prev.filter(agent => agent.id !== selectedAgent.id));
      setShowDeleteModal(false);
      setSelectedAgent(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      permissions: []
    });
  };

  const openPermissionsModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormData({
      nom: agent.nom,
      prenom: agent.prenom,
      email: agent.email,
      telephone: agent.telephone,
      permissions: [...agent.permissions]
    });
    setShowPermissionsModal(true);
  };

  const handlePermissionChange = (moduleId: string, action: string, checked: boolean) => {
    setFormData(prev => {
      const newPermissions = [...prev.permissions];
      const moduleIndex = newPermissions.findIndex(p => p.module === moduleId);
      
      if (moduleIndex >= 0) {
        if (checked) {
          if (!newPermissions[moduleIndex].actions.includes(action)) {
            newPermissions[moduleIndex].actions.push(action);
          }
        } else {
          newPermissions[moduleIndex].actions = newPermissions[moduleIndex].actions.filter(a => a !== action);
          if (newPermissions[moduleIndex].actions.length === 0) {
            newPermissions.splice(moduleIndex, 1);
          }
        }
      } else if (checked) {
        newPermissions.push({ module: moduleId, actions: [action] });
      }
      
      return { ...prev, permissions: newPermissions };
    });
  };

  const hasPermission = (moduleId: string, action: string) => {
    const modulePermission = formData.permissions.find(p => p.module === moduleId);
    return modulePermission ? modulePermission.actions.includes(action) : false;
  };

  const filteredAgents = agents.filter(agent => {
    const searchLower = searchTerm.toLowerCase();
    return (
      agent.nom.toLowerCase().includes(searchLower) ||
      agent.prenom.toLowerCase().includes(searchLower) ||
      agent.email.toLowerCase().includes(searchLower)
    );
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Agents</h1>
          <p className="text-gray-600">Gérer vos agents et leurs permissions</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Agent
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total agents</p>
              <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Agents actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {agents.filter(a => a.statut === 'actif').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Agents suspendus</p>
              <p className="text-2xl font-bold text-gray-900">
                {agents.filter(a => a.statut === 'suspendu').length}
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
                placeholder="Rechercher un agent..."
                className="w-full pl-10 input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des agents */}
      <div className="card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Agent</TableHeaderCell>
              <TableHeaderCell>Contact</TableHeaderCell>
              <TableHeaderCell>Permissions</TableHeaderCell>
              <TableHeaderCell>Statut</TableHeaderCell>
              <TableHeaderCell>Date création</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-medium">
                        {agent.prenom[0]}{agent.nom[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {agent.prenom} {agent.nom}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {agent.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {agent.telephone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {agent.permissions.slice(0, 3).map((permission) => (
                      <Badge key={permission.module} variant="info" size="sm">
                        {permission.module}
                      </Badge>
                    ))}
                    {agent.permissions.length > 3 && (
                      <Badge variant="default" size="sm">
                        +{agent.permissions.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={agent.statut === 'actif' ? 'success' : 'danger'}>
                    {agent.statut === 'actif' ? 'Actif' : 'Suspendu'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(agent.dateCreation).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedAgent(agent);
                        setShowDetailModal(true);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => openPermissionsModal(agent)}
                      className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                      title="Gérer les permissions"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(agent.id)}
                      className={`p-1 rounded ${
                        agent.statut === 'actif' 
                          ? 'text-red-600 hover:bg-red-100' 
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={agent.statut === 'actif' ? 'Suspendre' : 'Activer'}
                    >
                      {agent.statut === 'actif' ? (
                        <UserX className="w-4 h-4" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedAgent(agent);
                        setShowDeleteModal(true);
                      }}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
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

        {filteredAgents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun agent trouvé</p>
          </div>
        )}
      </div>

      {/* Modal ajout agent */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Nouvel agent"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.prenom}
                onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              className="input-field"
              value={formData.telephone}
              onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
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
              onClick={handleAddAgent}
              disabled={!formData.nom || !formData.prenom || !formData.email}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Créer l'agent
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal permissions */}
      <Modal
        isOpen={showPermissionsModal}
        onClose={() => {
          setShowPermissionsModal(false);
          setSelectedAgent(null);
          resetForm();
        }}
        title="Gestion des permissions"
        size="xl"
      >
        {selectedAgent && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                Permissions pour {selectedAgent.prenom} {selectedAgent.nom}
              </h3>
              <p className="text-sm text-blue-700">
                Sélectionnez les modules et actions auxquels cet agent aura accès.
              </p>
            </div>
            
            <div className="space-y-6">
              {availableModules.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{module.name}</h4>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableActions.map((action) => (
                      <div key={action} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${module.id}-${action}`}
                          checked={hasPermission(module.id, action)}
                          onChange={(e) => handlePermissionChange(module.id, action, e.target.checked)}
                          className="mr-2"
                        />
                        <label 
                          htmlFor={`${module.id}-${action}`}
                          className="text-sm text-gray-700 capitalize cursor-pointer"
                        >
                          {action}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPermissionsModal(false);
                  setSelectedAgent(null);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdatePermissions}
                className="btn-primary"
              >
                Enregistrer les permissions
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal détails agent */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Détails de l'agent"
        size="lg"
      >
        {selectedAgent && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <p className="text-sm text-gray-900">
                  {selectedAgent.prenom} {selectedAgent.nom}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-sm text-gray-900">{selectedAgent.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <p className="text-sm text-gray-900">{selectedAgent.telephone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <Badge variant={selectedAgent.statut === 'actif' ? 'success' : 'danger'}>
                  {selectedAgent.statut === 'actif' ? 'Actif' : 'Suspendu'}
                </Badge>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permissions
              </label>
              <div className="space-y-3">
                {selectedAgent.permissions.map((permission) => (
                  <div key={permission.module} className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-2 capitalize">
                      {permission.module}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {permission.actions.map((action) => (
                        <Badge key={action} variant="info" size="sm">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAgent(null);
        }}
        title="Confirmer la suppression"
      >
        {selectedAgent && (
          <div className="space-y-4">
            <p className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer l'agent{' '}
              <strong>{selectedAgent.prenom} {selectedAgent.nom}</strong> ?
            </p>
            <p className="text-sm text-red-600">
              Cette action est irréversible et supprimera tous les accès de cet agent.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteAgent}
                className="btn-danger"
              >
                Supprimer
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedAgent(null);
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

export default AgentsPage;