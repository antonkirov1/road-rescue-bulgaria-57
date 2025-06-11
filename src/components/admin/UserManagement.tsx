
import React, { useState, useEffect } from 'react';
import { UserAccountService } from '@/services/userAccountService';
import { toast } from '@/components/ui/use-toast';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import BanConfirmDialog from './BanConfirmDialog';
import UnbanConfirmDialog from './UnbanConfirmDialog';
import UserManagementHeader from './user/UserManagementHeader';
import UserStatsCards from './user/UserStatsCards';
import UserTable from './user/UserTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserAccount {
  id: string;
  username: string;
  email: string;
  phone_number?: string;
  gender?: string;
  full_name?: string;
  created_at: string;
  created_by_admin?: boolean;
  status?: 'active' | 'banned';
}

interface UserManagementProps {
  onBack: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onBack }) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [showUnbanDialog, setShowUnbanDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  const loadUsers = async () => {
    try {
      const userData = await UserAccountService.getExistingUsers();
      const transformedUsers: UserAccount[] = (userData || []).map(user => ({
        ...user,
        status: (user.status === 'banned' ? 'banned' : 'active') as 'active' | 'banned'
      }));
      setUsers(transformedUsers);
      setFilteredUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleUserCreated = () => {
    loadUsers();
  };

  const handleUserUpdated = () => {
    loadUsers();
    setSelectedUser(null);
  };

  const handleEditUser = (user: UserAccount) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleBanUser = (user: UserAccount) => {
    setSelectedUser(user);
    setShowBanDialog(true);
  };

  const handleUnbanUser = (user: UserAccount) => {
    setSelectedUser(user);
    setShowUnbanDialog(true);
  };

  const handleRemoveUser = (user: UserAccount) => {
    setSelectedUser(user);
    setShowRemoveDialog(true);
  };

  const confirmBanUser = async () => {
    if (!selectedUser) return;

    try {
      await UserAccountService.updateUserStatus(selectedUser.id, 'banned');
      toast({
        title: "User Banned",
        description: `${selectedUser.username} has been restricted from using the app`
      });
      loadUsers();
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive"
      });
    } finally {
      setShowBanDialog(false);
      setSelectedUser(null);
    }
  };

  const confirmUnbanUser = async () => {
    if (!selectedUser) return;

    try {
      await UserAccountService.updateUserStatus(selectedUser.id, 'active');
      toast({
        title: "User Access Reinstated",
        description: `${selectedUser.username}'s access has been restored`
      });
      loadUsers();
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast({
        title: "Error",
        description: "Failed to reinstate user access",
        variant: "destructive"
      });
    } finally {
      setShowUnbanDialog(false);
      setSelectedUser(null);
    }
  };

  const confirmRemoveUser = async () => {
    if (!selectedUser) return;

    try {
      await UserAccountService.deleteUser(selectedUser.id);
      toast({
        title: "User Removed",
        description: `${selectedUser.username} has been permanently removed`
      });
      loadUsers();
    } catch (error) {
      console.error('Error removing user:', error);
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive"
      });
    } finally {
      setShowRemoveDialog(false);
      setSelectedUser(null);
    }
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <UserManagementHeader 
        onBack={onBack}
        onCreateUser={() => setShowCreateModal(true)}
      />

      <UserStatsCards users={users} />

      <UserTable
        users={filteredUsers}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showPasswords={showPasswords}
        onEdit={handleEditUser}
        onTogglePassword={togglePasswordVisibility}
        onBan={handleBanUser}
        onUnban={handleUnbanUser}
        onRemove={handleRemoveUser}
      />

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={handleUserCreated}
      />

      {selectedUser && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onUserUpdated={handleUserUpdated}
          user={selectedUser}
        />
      )}

      <BanConfirmDialog
        isOpen={showBanDialog}
        onClose={() => {
          setShowBanDialog(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmBanUser}
        userName={selectedUser?.username || ''}
        type="user"
      />

      <UnbanConfirmDialog
        isOpen={showUnbanDialog}
        onClose={() => {
          setShowUnbanDialog(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmUnbanUser}
        userName={selectedUser?.username || ''}
        type="user"
      />

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently remove {selectedUser?.username}? 
              This action cannot be undone and will delete all user data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowRemoveDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
