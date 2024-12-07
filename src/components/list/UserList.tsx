import { useState } from 'react';
import { User } from '../../types/rbac';
import { useRBACStore } from '../../store/rbacStore';
import { formatDate } from '../../utils/helpers';
import Button from '../common/Button';
import { Pencil, Trash2, UserPlus, Search, UserCircle } from 'lucide-react';
import Modal from '../modals/Modal';
import UserForm from '../forms/UserForm';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

// Profile Icon Component
const ProfileIcon = () => {
  return (
    <div className="flex items-center justify-center">
      <UserCircle className="w-10 h-10 text-gray-400" />
    </div>
  );
};


export default function UserList() {
  // Fetch users, roles, add, update, delete user functions from store
  const { users, roles, addUser, updateUser, deleteUser } = useRBACStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletedUserId, setDeletedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('name_asc');

  const handleCreateUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    addUser(userData);
    setIsCreateModalOpen(false);
  };

  const handleUpdateUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (editingUser) {
      updateUser(editingUser.id, userData);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setDeletedUserId(userId);
    setTimeout(() => {
      deleteUser(userId);
    }, 300);
  };

  // Custom filtering and sorting logic
  const filteredUsers = users
    .filter((user) => {
      const role = roles.find((role) => role.id === user.roleId)?.name || '';
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || role === filterRole;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'email_asc':
          return a.email.localeCompare(b.email);
        case 'email_desc':
          return b.email.localeCompare(a.email);
        case 'date_asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date_desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  // custom function to highlight search term in text
  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="bg-yellow-300">$1</span>');
  };

  return (
    <>
      {/* Header section with search, filters, and sorting options */}
      <motion.div
        className="mb-4 flex flex-col md:flex-row gap-4 items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
         {/* Search, role and status filters */}
        <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <select
            className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
          <select
            className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 hover:border-gray-400 transition duration-200 ease-in-out"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all" className="font-bold text-gray-700">All Statuses</option>
            <option value="active" className="font-bold text-green-700">Active</option>
            <option value="inactive" className="font-bold text-red-700">Inactive</option>
          </select>
        </div>
          
          {/* Sorting options */}
        <div className="flex gap-4 items-center w-full md:w-auto">
          <select
            className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500 hover:border-gray-400 transition duration-200 ease-in-out"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="name_asc" className="text-gray-700">Name (A-Z)</option>
            <option value="name_desc" className="text-gray-700">Name (Z-A)</option>
            <option value="email_asc" className="text-gray-700">Email (A-Z)</option>
            <option value="email_desc" className="text-gray-700">Email (Z-A)</option>
            <option value="date_asc" className="text-gray-700">Created Date (Oldest)</option>
            <option value="date_desc" className="text-gray-700">Created Date (Newest)</option>
          </select>
          {/* Add User Button */}
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md shadow hover:from-blue-600 hover:to-indigo-700 transition"
          >
            <UserPlus className="h-4 w-4" />
            <span className="whitespace-nowrap">Add User</span>
          </Button>
        </div>
      </motion.div>

      {/* Table with user data */}

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-50 divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 1 }}
                animate={{ opacity: deletedUserId === user.id ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0 }}
                className={clsx('hover:bg-blue-100 transition-colors duration-200', {
                  'bg-blue-50': searchTerm,
                })}
              >
                <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
                  <ProfileIcon />
                  <div>
                    <div className="text-sm font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: highlightText(user.name) }} />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: highlightText(user.email) }} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: highlightText(roles.find((role) => role.id === user.roleId)?.name || '') }} />
                </td>
          
                <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {user.status === 'active' ? (
                    <span
                      className={clsx(
                        'flex items-center gap-2 px-3 py-1 text-sm font-medium text-green-700',
                        'bg-green-100 rounded-md shadow-sm'
                      )}
                    >
                      <span className="inline-block w-2.5 h-2.5 bg-green-600 rounded-full"></span>
                      Active
                    </span>
                  ) : (
                    <span
                      className={clsx(
                        'flex items-center gap-2 px-3 py-1 text-sm font-medium text-red-700',
                        'bg-red-100 rounded-md shadow-sm'
                      )}
                    >
                      <span className="inline-block w-2.5 h-2.5 bg-red-600 rounded-full"></span>
                      Inactive
                    </span>
                  )}
                </div>
              </td>

                {/* Created Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatDate(user.createdAt)}</div>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex justify-end space-x-3">
                    <div className="relative group">
                      {/* Edit User Button */}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setEditingUser(user)}
                        title="Edit User"
                        className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white hover:bg-blue-700 rounded"
                      >
                        <Pencil className="h-4 w-4" />
                        <span>Edit</span>
                      </Button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        Edit User
                      </div>
                    </div>
                    {/* Delete User Button */}
                    <div className="relative group">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete User"
                        className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white hover:bg-red-600 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </Button>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        Delete User
                      </div>
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal for adding and editing user */}
      <Modal
        isOpen={isCreateModalOpen || !!editingUser}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? 'Edit User' : 'Add User'}
      >
        <UserForm
          user={editingUser || undefined}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onCancel={() => {
            setIsCreateModalOpen(false);
            setEditingUser(null);
          }}
        />
      </Modal>
    </>
  );
}