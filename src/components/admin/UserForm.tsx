
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { UserAccountService, UserAccount } from '@/services/userAccountService';

interface UserFormProps {
  user?: UserAccount;
  onSubmit: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    gender: '',
    full_name: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: user.password_hash || '',
        phone_number: user.phone_number || '',
        gender: user.gender || '',
        full_name: user.full_name || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      if (user) {
        // Update existing user
        await UserAccountService.updateExistingUser(user.id, {
          username: formData.username,
          email: formData.email,
          password_hash: formData.password || undefined,
          phone_number: formData.phone_number || undefined,
          gender: formData.gender || undefined,
          full_name: formData.full_name || undefined
        });

        toast({
          title: "Success",
          description: "User updated successfully"
        });
      } else {
        // Create new user
        await UserAccountService.createUserAccount({
          username: formData.username,
          email: formData.email,
          password_hash: formData.password,
          phone_number: formData.phone_number || undefined,
          gender: formData.gender || undefined,
          full_name: formData.full_name || undefined
        });

        toast({
          title: "Success",
          description: "User created successfully"
        });
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: `Failed to ${user ? 'update' : 'create'} user`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {user ? 'Edit User' : 'Create New User'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{user ? 'Edit User Account' : 'Create New User Account'}</CardTitle>
          <CardDescription>
            {user ? 'Update user account information' : 'Add a new user to the system'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password {user ? '' : '*'}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                disabled={loading}
                required={!user}
                placeholder={user ? 'Leave blank to keep current password' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (user ? 'Updating...' : 'Creating...') : (user ? 'Update User' : 'Create User')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserForm;
