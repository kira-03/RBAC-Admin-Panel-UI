import React from 'react';
import { motion } from 'framer-motion';
import { useRBACStore } from '../../store/rbacStore';
import Button from '../common/Button';
import { Role } from '../../types/rbac';

interface RoleFormProps {
  role?: Role;
  onSubmit: (data: Omit<Role, 'id'>) => void;
  onCancel: () => void;
}

export default function RoleForm({ role, onSubmit, onCancel }: RoleFormProps) {
  const { permissions } = useRBACStore();
  const [formData, setFormData] = React.useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions || [],
  });
  const [hoveredPermission, setHoveredPermission] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePermission = (permission: typeof permissions[0]) => {
    const exists = formData.permissions.find((p) => p.id === permission.id);
    setFormData({
      ...formData,
      permissions: exists
        ? formData.permissions.filter((p) => p.id !== permission.id)
        : [...formData.permissions, permission],
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 25,
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

  const tooltipVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
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
        {/* Name Field */}
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
            aria-label="Role Name"
          />
        </motion.div>

        {/* Description Field */}
        <motion.div variants={childVariants}>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm box-border px-3 py-2"
            rows={3}
            required
            aria-label="Role Description"
          />
        </motion.div>

        {/* Permissions Field */}
        <motion.div variants={childVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
          <div className="space-y-2">
            {permissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-center relative"
                onMouseEnter={() => setHoveredPermission(permission.id)}
                onMouseLeave={() => setHoveredPermission(null)}
              >
                <motion.input
                  type="checkbox"
                  checked={formData.permissions.some((p) => p.id === permission.id)}
                  onChange={() => togglePermission(permission)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  variants={childVariants}
                  whileTap={{
                    scale: 1.2,
                    rotate: 5,
                    backgroundColor: 'rgb(59, 130, 246)', // Tailwind blue-500 color
                    transition: { type: 'spring', stiffness: 300, damping: 20 },
                  }}
                  initial={{ backgroundColor: 'white' }}
                  whileHover={{
                    scale: 1.1,
                    backgroundColor: 'rgb(59, 130, 246)',
                  }}
                />
                <span className="ml-2 text-sm text-gray-700">{permission.name}</span>

                {/* Tooltip */}
                {hoveredPermission === permission.id && (
                  <motion.div
                    variants={tooltipVariants}
                    className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-md"
                  >
                    {permission.description || 'No description available'}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={childVariants} className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel} aria-label="Cancel">
            Cancel
          </Button>
          <Button type="submit" aria-label={role ? 'Update Role' : 'Create Role'}>
            {role ? 'Update' : 'Create'} Role
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
