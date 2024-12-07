import { create } from 'zustand';
import { User, Role, Permission } from '../types/rbac';
import { generateId } from '../utils/helpers';

interface RBACStore {
  users: User[];
  roles: Role[];
  permissions: Permission[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
}

// Default permissions with user management added for Ultimate Admin
const defaultPermissions: Permission[] = [
  { id: '1', name: 'Perform VAPT', description: 'Conduct Vulnerability Assessment and Penetration Testing', module: 'services' },
  { id: '2', name: 'Monitor Threats', description: 'Monitor and respond to threats in real-time', module: 'SOC' },
  { id: '3', name: 'Access Cloud Data', description: 'Access and secure cloud infrastructure', module: 'cloud' },
  { id: '4', name: 'Manage Clients', description: 'View and update client information', module: 'clients' },
  { id: '5', name: 'Manage Users', description: 'Add, edit, or delete users, and assign roles', module: 'users' }, // User management permission
];

// Default roles with expanded permissions for Ultimate Admin
const defaultRoles: Role[] = [
  {
    id: '1',
    name: 'Cybersecurity Admin',
    description: 'Has full control over everything, including all modules, roles, permissions, and users.',
    permissions: defaultPermissions,
  },
  {
    id: '2',
    name: 'SOC Analyst',
    description: 'Handles threat monitoring and incident responses.',
    permissions: defaultPermissions.filter((p) => p.module === 'SOC' || p.module === 'services'),
  },
  {
    id: '3',
    name: 'Cloud Security Specialist',
    description: 'Responsible for securing cloud infrastructure.',
    permissions: defaultPermissions.filter((p) => p.module === 'cloud'),
  },
  {
    id: '4',
    name: 'Client Manager',
    description: 'Manages client-related operations and data.',
    permissions: defaultPermissions.filter((p) => p.module === 'clients'),
  },
];

// Default users, including a user for the Ultimate Admin
const defaultUsers: User[] = [
  { id: '1', name: 'Guruprasath', email: 'guruprasathmaheswaran@vrvsecurity.com', roleId: '1', status: 'active', createdAt: new Date().toISOString() },
  { id: '2', name: 'Yoshni', email: 'yoshni_aelin@vrvsecurity.com', roleId: '2', status: 'active', createdAt: new Date().toISOString() },
  { id: '3', name: 'Sukantha Velan', email: 'sukantha_velan.03@vrvsecurity.com', roleId: '3', status: 'inactive', createdAt: new Date().toISOString() },
  { id: '4', name: 'Deepak', email: 'deepak_rayan@vrvsecurity.com', roleId: '4', status: 'active', createdAt: new Date().toISOString() },
];

export const useRBACStore = create<RBACStore>((set) => ({
  users: defaultUsers,
  roles: defaultRoles,
  permissions: defaultPermissions,

  addUser: (user) =>
    set((state) => ({
      users: [
        ...state.users,
        {
          ...user,
          id: generateId(),
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  updateUser: (id, updatedUser) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? { ...user, ...updatedUser } : user)),
    })),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),

  addRole: (role) =>
    set((state) => ({
      roles: [...state.roles, { ...role, id: generateId() }],
    })),

  updateRole: (id, updatedRole) =>
    set((state) => ({
      roles: state.roles.map((role) => (role.id === id ? { ...role, ...updatedRole } : role)),
    })),

  deleteRole: (id) =>
    set((state) => ({
      roles: state.roles.filter((role) => role.id !== id),
    })),
}));