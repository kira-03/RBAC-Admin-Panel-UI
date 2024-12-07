import { useState } from "react";
import { useRBACStore } from "../../store/rbacStore";
import Button from "../common/Button";
import { Pencil, Trash2, Plus } from "lucide-react";
import Modal from "../modals/Modal";
import RoleForm from "../forms/RoleForm";
import { Role } from "../../types/rbac";
import { motion } from "framer-motion";

export default function RoleList() {
  const { roles, addRole, updateRole, deleteRole } = useRBACStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletedRoleId, setDeletedRoleId] = useState<string | null>(null);

  // Handle the creation of a new role
  const handleCreateRole = (roleData: Omit<Role, "id">) => {
    addRole(roleData);
    setIsCreateModalOpen(false);
  };

  // Handle updating an existing role
  const handleUpdateRole = (roleData: Omit<Role, "id">) => {
    if (editingRole) {
      updateRole(editingRole.id, roleData);
      setEditingRole(null);
    }
  };

  // Handle deleting a role with animation
  const handleDeleteRole = (roleId: string) => {
    setDeletedRoleId(roleId);
    setTimeout(() => {
      deleteRole(roleId); 
    }, 300); // custom delay animation
  };

  return (
    // Wrap the entire page in a motion.div for the entrance animation
    <motion.div
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 20 }} 
      transition={{ duration: 0.5, ease: "easeOut" }} 
      className="p-6"
    >
      {/* Add Role Button */}
      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-md shadow hover:from-blue-600 hover:to-indigo-700 transition"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <motion.div
            key={role.id}
            className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 transform transition-transform duration-200 hover:scale-105 hover:shadow-md"
            initial={{ opacity: 1 }}
            animate={{ opacity: deletedRoleId === role.id ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0 }}
          >
            {/* Role Info */}
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800">{role.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{role.description}</p>
            </div>

            {/* Permissions Section */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Permissions
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-50 to-blue-50 text-blue-800 shadow-sm"
                  >
                    {permission.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-2">
              {/* Edit Button */}
              <div className="relative group">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setEditingRole(role)}
                  title="Edit Role"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
                {/* Tooltip */}
                <div className="absolute bottom-full right-1/2 transform translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-75 bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  Edit Role
                </div>
              </div>
              {/* Delete Button */}
              <div className="relative group">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteRole(role.id)}
                  title="Delete Role"
                  className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md shadow"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                {/* Tooltip */}
                <div className="absolute bottom-full right-1/2 transform translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-75 bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                  Delete Role
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Role Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Role"
      >
        <RoleForm
          onSubmit={handleCreateRole}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={!!editingRole}
        onClose={() => setEditingRole(null)}
        title="Edit Role"
      >
        {editingRole && (
          <RoleForm
            role={editingRole}
            onSubmit={handleUpdateRole}
            onCancel={() => setEditingRole(null)}
          />
        )}
      </Modal>
    </motion.div>
  );
}
