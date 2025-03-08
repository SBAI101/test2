export default {
  title: 'User Management',
  description: 'Manage client and employee profiles, documents, and analytics.',
  
  metrics: {
    totalUsers: 'Total Users',
    activeClients: 'Active Clients',
    pendingApprovals: 'Pending Approvals',
    complianceScore: 'Compliance Score'
  },

  quickActions: {
    approveUsers: 'Approve Users',
    approveUsersDesc: 'Validate new user accounts',
    complianceReviews: 'Compliance Reviews',
    complianceReviewsDesc: 'Compliance reviews to be performed',
    documentVerification: 'Document Verification',
    documentVerificationDesc: 'Documents pending verification'
  },

  tabs: {
    clients: 'Clients',
    employees: 'Employees',
    documents: 'Documents',
    analytics: 'Analytics'
  },

  clients: {
    title: 'Client Management',
    description: 'Manage client profiles and information',
    filters: {
      status: 'Status',
      type: 'Type',
      manager: 'Manager',
      search: 'Search for a client'
    },
    status: {
      active: 'Active',
      pending: 'Pending',
      suspended: 'Suspended',
      inactive: 'Inactive'
    },
    actions: {
      view: 'View',
      edit: 'Edit'
    }
  },

  employees: {
    title: 'Employee Management',
    description: 'Manage employee profiles and roles',
    filters: {
      role: 'Role',
      status: 'Status',
      search: 'Search for an employee'
    },
    actions: {
      view: 'View',
      edit: 'Edit'
    }
  },

  documents: {
    title: 'Document Management',
    description: 'Manage client and employee documents',
    filters: {
      type: 'Type',
      status: 'Status',
      date: 'Date',
      search: 'Search for a document'
    },
    types: {
      kyc: 'KYC',
      contract: 'Contract',
      id: 'ID Document',
      proof: 'Proof Document',
      other: 'Other'
    },
    status: {
      pending: 'Pending',
      verified: 'Verified',
      rejected: 'Rejected',
      expired: 'Expired'
    }
  },

  analytics: {
    title: 'User Analytics',
    description: 'View user statistics and trends',
    metrics: {
      userGrowth: 'User Growth',
      clientRetention: 'Client Retention',
      documentCompletion: 'Document Completion',
      complianceRate: 'Compliance Rate'
    },
    filters: {
      period: 'Period',
      type: 'Type',
      segment: 'Segment'
    }
  }
}