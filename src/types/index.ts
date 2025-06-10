export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'superadmin' | 'agence' | 'agent';
  agenceId?: string;
  permissions?: Permission[];
  statut?: 'actif' | 'suspendu' | 'en_attente';
}

export interface Agence {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  logo?: string;
  statut: 'en_attente' | 'approuve' | 'rejete' | 'suspendu';
  dateInscription: string;
  modulesActifs: string[];
  informationsBancaires?: {
    banque: string;
    rib: string;
    swift?: string;
  };
}

export interface Permission {
  module: string;
  actions: string[];
}

export interface Client {
  id: string;
  nom: string;
  prenom?: string;
  entreprise?: string;
  email: string;
  telephone: string;
  adresse: string;
  solde: number;
  dateCreation: string;
}

export interface Fournisseur {
  id: string;
  nom: string;
  entreprise: string;
  email: string;
  telephone: string;
  adresse: string;
  solde: number;
  dateCreation: string;
}

export interface BonCommande {
  id: string;
  numero: string;
  clientId: string;
  client: Client;
  dateCreation: string;
  statut: 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'facture';
  montantHT: number;
  montantTTC: number;
  articles: ArticleCommande[];
}

export interface ArticleCommande {
  id: string;
  designation: string;
  quantite: number;
  prixUnitaire: number;
  montant: number;
}

export interface Facture {
  id: string;
  numero: string;
  clientId: string;
  client: Client;
  dateEmission: string;
  dateEcheance: string;
  statut: 'brouillon' | 'envoyee' | 'payee' | 'en_retard';
  montantHT: number;
  montantTTC: number;
  articles: ArticleCommande[];
}

export interface OperationCaisse {
  id: string;
  type: 'entree' | 'sortie';
  montant: number;
  description: string;
  date: string;
  categorie: string;
  reference?: string;
}

export interface Package {
  id: string;
  nom: string;
  description: string;
  prix: number;
  duree: string;
  inclusions: string[];
  visible: boolean;
  dateCreation: string;
}

export interface BilletAvion {
  id: string;
  numeroVol: string;
  compagnie: string;
  dateDepart: string;
  dateArrivee: string;
  origine: string;
  destination: string;
  passager: string;
  prix: number;
  statut: 'confirme' | 'annule' | 'en_attente';
}

export interface Agent {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  permissions: Permission[];
  statut: 'actif' | 'suspendu';
  dateCreation: string;
}

export interface Ticket {
  id: string;
  agenceId: string;
  agence: Agence;
  sujet: string;
  description: string;
  statut: 'ouvert' | 'en_cours' | 'ferme';
  priorite: 'faible' | 'normale' | 'haute' | 'urgente';
  dateCreation: string;
  dateMAJ: string;
}