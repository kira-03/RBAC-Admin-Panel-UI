import React from 'react';
import { motion } from 'framer-motion';
import { useRBACStore } from '../../store/rbacStore';
import Button from '../common/Button';
import { User } from '../../types/rbac';

interface UserFormProps {
  user?: User;
  onSubmit: (data: Omit<User, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const { roles } = useRBACStore();
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    roleId: user?.roleId || roles[0]?.id || '',
    status: user?.status || 'active' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
    exit: { opacity: 0, scale: 0.9, rotate: 10, transition: { duration: 0.3 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 150 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto"
    >
      <motion.form onSubmit={handleSubmit} className="space-y-4">
        <motion.div variants={childVariants}>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm box-border px-3 py-2"
            required
          />
        </motion.div>

        <motion.div variants={childVariants}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm box-border px-3 py-2"
            required
          />
        </motion.div>

        <motion.div variants={childVariants}>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            value={formData.roleId}
            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm box-border px-3 py-2"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div variants={childVariants}>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm box-border px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </motion.div>

        <motion.div variants={childVariants} className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {user ? 'Update' : 'Create'} User
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
