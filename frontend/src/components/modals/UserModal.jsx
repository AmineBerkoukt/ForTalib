import React from "react";
import { motion } from 'framer-motion';
import { AlertTriangle, Ban, UserPlus } from 'lucide-react';

const UserModal = ({ 
  showModal, 
  selectedUser, 
  actionType, 
  onClose, 
  onConfirm 
}) => {
  if (!showModal || !selectedUser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          {actionType === "delete" ? (
            <><AlertTriangle className="h-5 w-5 mr-2 text-red-600" /> Delete User</>
          ) : actionType === "ban" ? (
            <><Ban className="h-5 w-5 mr-2 text-red-600" /> Ban User</>
          ) : (
            <><UserPlus className="h-5 w-5 mr-2 text-blue-600" /> Make Admin</>
          )}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 ml-7">
          {actionType === "delete" ?
            `Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}? This action cannot be undone.` :
            actionType === "ban" ?
              `Are you sure you want to ban ${selectedUser.firstName} ${selectedUser.lastName}? This will prevent their access to the system.` :
              `Are you sure you want to make ${selectedUser.firstName} ${selectedUser.lastName} an admin? This will grant them full administrative privileges.`
          }
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white ${
              actionType === "delete" ? "bg-red-600 hover:bg-red-700" :
                actionType === "ban" ? "bg-red-600 hover:bg-red-700" :
                  "bg-blue-600 hover:bg-blue-700"
            } transition-colors`}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserModal;