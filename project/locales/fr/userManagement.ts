export default {
  title: 'Gestion des Utilisateurs',
  description: 'Gérez les profils clients et employés, les documents et les analyses.',
  
  metrics: {
    totalUsers: 'Total Utilisateurs',
    activeClients: 'Clients Actifs',
    pendingApprovals: 'Approbations en Attente',
    complianceScore: 'Score de Conformité'
  },

  quickActions: {
    approveUsers: 'Approuver Utilisateurs',
    approveUsersDesc: 'Valider les nouveaux comptes utilisateurs',
    complianceReviews: 'Révisions Conformité',
    complianceReviewsDesc: 'Examens de conformité à effectuer',
    documentVerification: 'Vérification Documents',
    documentVerificationDesc: 'Documents en attente de vérification'
  },

  tabs: {
    clients: 'Clients',
    employees: 'Employés',
    documents: 'Documents',
    analytics: 'Analyses'
  },

  clients: {
    title: 'Gestion des Clients',
    description: 'Gérez les profils et informations des clients',
    filters: {
      status: 'Statut',
      type: 'Type',
      manager: 'Gestionnaire',
      search: 'Rechercher un client'
    },
    status: {
      active: 'Actif',
      pending: 'En Attente',
      suspended: 'Suspendu',
      inactive: 'Inactif'
    },
    actions: {
      view: 'Voir',
      edit: 'Modifier'
    }
  },

  employees: {
    title: 'Gestion des Employés',
    description: 'Gérez les profils et rôles des employés',
    filters: {
      role: 'Rôle',
      status: 'Statut',
      search: 'Rechercher un employé'
    },
    actions: {
      view: 'Voir',
      edit: 'Modifier'
    }
  },

  documents: {
    title: 'Gestion des Documents',
    description: 'Gérez les documents clients et employés',
    filters: {
      type: 'Type',
      status: 'Statut',
      date: 'Date',
      search: 'Rechercher un document'
    },
    types: {
      kyc: 'KYC',
      contract: 'Contrat',
      id: 'Pièce d\'identité',
      proof: 'Justificatif',
      other: 'Autre'
    },
    status: {
      pending: 'En Attente',
      verified: 'Vérifié',
      rejected: 'Rejeté',
      expired: 'Expiré'
    }
  },

  analytics: {
    title: 'Analyses Utilisateurs',
    description: 'Visualisez les statistiques et tendances utilisateurs',
    metrics: {
      userGrowth: 'Croissance Utilisateurs',
      clientRetention: 'Rétention Clients',
      documentCompletion: 'Complétion Documents',
      complianceRate: 'Taux de Conformité'
    },
    filters: {
      period: 'Période',
      type: 'Type',
      segment: 'Segment'
    }
  }
}