
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import UserTable from './UserTable';
import UserForm from './UserForm';
import { UserAccountService, UserAccount } from '@/services/userAccountService';

interface UserManagementProps {
  onStatsUpdate?: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onStatsUpdate }) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | undefined>();
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await UserAccountService.getAllUsers();
      setUsers(data);
      
      // Trigger stats update in parent component
      if (onStatsUpdate) {
        onStatsUpdate();
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  };

  const handleCreateUser = () => {
    setEditingUser(undefined);
    setShowForm(true);
  };

  const handleEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingUser(undefined);
    loadUsers();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(undefined);
  };

  const handleTogglePassword = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleBanUser = async (user: UserAccount) => {
    try {
      await UserAccountService.banUser(user.id);
      toast({
        title: "User Banned",
        description: `${user.username} has been banned.`
      });
      loadUsers();
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: "Error",
        description: "Failed to ban user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUnbanUser = async (user: UserAccount) => {
    try {
      await UserAccountService.unbanUser(user.id);
      toast({
        title: "User Unbanned",
        description: `${user.username} has been unbanned.`
      });
      loadUsers();
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast({
        title: "Error",
        description: "Failed to unban user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveUser = async (user: UserAccount) => {
    if (!confirm(`Are you sure you want to permanently delete ${user.username}? This action cannot be undone.`)) {
      return;
    }

    try {
      await UserAccountService.deleteUser(user.id);
      toast({
        title: "User Deleted",
        description: `${user.username} has been permanently deleted.`
      });
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (showForm) {
    return (
      <UserForm
        user={editingUser}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl">User Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage user accounts and permissions
              </p>
            </div>
            <Button onClick={handleCreateUser} className="w-full sm:w-auto">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <UserTable
            users={filteredUsers}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showPasswords={showPasswords}
            onEdit={handleEditUser}
            onTogglePassword={handleTogglePassword}
            onBan={handleBanUser}
            onUnban={handleUnbanUser}
            onRemove={handleRemoveUser}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
