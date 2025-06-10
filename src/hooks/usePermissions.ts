import { useAuth } from '../contexts/AuthContext';
import { Permission } from '../types';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (module: string, action: string): boolean => {
    if (!user) return false;
    
    // Superadmin a toutes les permissions
    if (user.role === 'superadmin') return true;
    
    // Agence a toutes les permissions sur ses modules
    if (user.role === 'agence') return true;
    
    // Agent : vérifier les permissions spécifiques
    if (user.role === 'agent' && user.permissions) {
      const modulePermission = user.permissions.find(p => p.module === module);
      return modulePermission ? modulePermission.actions.includes(action) : false;
    }
    
    return false;
  };

  const getAccessibleModules = (): string[] => {
    if (!user) return [];
    
    if (user.role === 'superadmin') {
      return ['agences', 'tickets', 'parametres'];
    }
    
    if (user.role === 'agence') {
      return [
        'dashboard', 'clients', 'fournisseurs', 'bons-commande', 
        'factures', 'creances', 'caisse', 'situation', 'billets', 
        'packages', 'vitrine', 'agents', 'parametres'
      ];
    }
    
    if (user.role === 'agent' && user.permissions) {
      return user.permissions.map(p => p.module);
    }
    
    return [];
  };

  return {
    hasPermission,
    getAccessibleModules,
    userRole: user?.role
  };
};