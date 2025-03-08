// Client Types
export interface Client {
  id: string
  user_id: string
  name: string
  email: string
  type: 'physique' | 'morale'
  status: string
  portfolioManager: string
  updatedAt: Date
}

// Personal Info Types
export interface PersonalInfo {
  client_id: string
  civility: 'monsieur' | 'madame' | 'autre'
  first_name: string
  date_of_birth: string
  place_of_birth: string
  phone_number: string
  address: string
  postal_code: string
  city: string
  email: string
}

// Tax Info Types
export interface TaxInfo {
  id: string
  client_id: string
  tax_identification_number: string
  is_ifi_subject: boolean
  us_tin?: string
}

// Investment Profile Types
export interface InvestmentProfile {
  id: string
  user_id: string
  acceptable_loss: string
  crypto_risks_acceptance: boolean
  desired_return: string
  exclusion_criteria?: string
  investment_horizon: string
  main_objective: string
  objective_types: string[]
  objectives: string
  risk_appetite: 'conservative' | 'moderate' | 'aggressive'
}

// Document Types
export interface Document {
  id: string
  client_id: string
  file_name: string
  file_type: string
  file_size: number
  file_path: string
  status: 'pending' | 'verified' | 'rejected'
  verification_status: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

// Activity Types
export interface Activity {
  id: string
  user_id: string
  activity_type: 'document' | 'profile' | 'transaction' | 'system'
  description: string
  timestamp: string
  related_id?: string
}

// Validation Functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{10,15}$/
  return phoneRegex.test(phone)
}

export const validatePostalCode = (code: string): boolean => {
  const frenchPostalCodeRegex = /^[0-9]{5}$/
  return frenchPostalCodeRegex.test(code)
}

export const validateTaxId = (id: string): boolean => {
  // French tax ID format (13 characters)
  const taxIdRegex = /^[0-9]{13}$/
  return taxIdRegex.test(id)
}

export const validateUsTin = (tin: string): boolean => {
  // US TIN format (9 digits)
  const usTinRegex = /^[0-9]{9}$/
  return usTinRegex.test(tin)
}

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_POSTAL_CODE: 'Please enter a valid postal code (5 digits)',
  INVALID_TAX_ID: 'Please enter a valid tax identification number (13 digits)',
  INVALID_US_TIN: 'Please enter a valid US TIN (9 digits)',
  REQUIRED_FIELD: 'This field is required'
}