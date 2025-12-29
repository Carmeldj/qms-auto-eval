/**
 * Demo Account Configuration
 * Use these credentials to log in to the demo account
 */

import { User } from '../types/user';

export const DEMO_CREDENTIALS = {
  email: 'demo@pharma-qms.com',
  password: 'Demo2025!',
};

export const DEMO_USER: User = {
  id: 'demo-user-001',
  email: 'demo@pharma-qms.com',
  tenantId: 'demo-tenant-001',
  name: 'Utilisateur Démo',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  plan: 'premium',
};

export const DEMO_ACCESS_TOKEN = 'demo-access-token-12345';
