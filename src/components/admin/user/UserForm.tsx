
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useUsernameValidation, useEmailValidation, usePhoneNumberValidation, usePasswordValidation, useConfirmPasswordValidation } from '@/hooks/useAuthValidation';
import { useTranslation } from '@/utils/translations';

interface UserFormProps {
  onBack: () => void;
  onSubmit: (userData: {
    username: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    gender: string;
    password: string;
  }) => void;
  isLoading?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ onBack, onSubmit, isLoading = false }) => {
  const t = useTranslation('en'); // Admin always uses English
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '+359',
    fullName: '',
    gender: 'male',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasInteracted, setHasInteracted] = useState({
    username: false,
    email: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false
  });

  // Validation hooks
  const usernameValidation = useUsernameValidation(t);
  const emailValidation = useEmailValidation(t);
  const phoneValidation = usePhoneNumberValidation(t);
  const passwordValidation = usePasswordValidation(t);
  const confirmPasswordValidation = useConfirmPasswordValidation(formData.password, t);

  // Update validation values
  React.useEffect(() => {
    usernameValidation.setValue(formData.username);
  }, [formData.username]);

  React.useEffect(() => {
    emailValidation.setValue(formData.email);
  }, [formData.email]);

  React.useEffect(() => {
    phoneValidation.setValue(formData.phoneNumber);
  }, [formData.phoneNumber]);

  React.useEffect(() => {
    passwordValidation.setValue(formData.password);
  }, [formData.password]);

  React.useEffect(() => {
    confirmPasswordValidation.setValue(formData.confirmPassword);
  }, [formData.confirmPassword]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setHasInteracted(prev => ({ ...prev, [field]: true }));
  };

  const isFormValid = () => {
    return (
      usernameValidation.isValid &&
      emailValidation.isValid &&
      phoneValidation.isValid &&
      passwordValidation.isValid &&
      confirmPasswordValidation.isValid &&
      formData.fullName.trim() !== ''
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: "Validation Error",
        description: "Please fix all validation errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      username: formData.username,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      fullName: formData.fullName,
      gender: formData.gender,
      password: formData.password
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold dark:text-white">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-300">Join Roadsaver Description</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username <span className="text-red-500">*</span>
              </Label>
              <div className="text-sm text-gray-500 mb-2">Username Requirements</div>
              <Input
                id="username"
                placeholder="Enter Username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
                className={`${
                  hasInteracted.username && !usernameValidation.isValid
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : hasInteracted.username && usernameValidation.isValid
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : ''
                }`}
              />
              {hasInteracted.username && usernameValidation.errorMessage && (
                <p className="text-sm text-red-500">{usernameValidation.errorMessage}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter Email Placeholder"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`${
                  hasInteracted.email && !emailValidation.isValid
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : hasInteracted.email && emailValidation.isValid
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : ''
                }`}
              />
              {hasInteracted.email && emailValidation.errorMessage && (
                <p className="text-sm text-red-500">{emailValidation.errorMessage}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number Label</Label>
              <div className="text-sm text-gray-500 mb-2">Phone Helper Text</div>
              <Input
                id="phone"
                placeholder="+359"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                onBlur={() => handleBlur('phoneNumber')}
                className={`${
                  hasInteracted.phoneNumber && !phoneValidation.isValid
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : hasInteracted.phoneNumber && phoneValidation.isValid
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : ''
                }`}
              />
              {hasInteracted.phoneNumber && phoneValidation.errorMessage && (
                <p className="text-sm text-red-500">{phoneValidation.errorMessage}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Name</Label>
              <Input
                id="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            </div>

            {/* Gender Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Gender Label</Label>
              <div className="flex gap-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm">Man Label</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm">Woman Label</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="not_specified"
                    checked={formData.gender === 'not_specified'}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm">Not Specified Label</span>
                </label>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create Password Placeholder"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`pr-10 ${
                    hasInteracted.password && !passwordValidation.isValid
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : hasInteracted.password && passwordValidation.isValid
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
              {hasInteracted.password && passwordValidation.errorMessage && (
                <p className="text-sm text-red-500">{passwordValidation.errorMessage}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`pr-10 ${
                    hasInteracted.confirmPassword && !confirmPasswordValidation.isValid
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : hasInteracted.confirmPassword && confirmPasswordValidation.isValid
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
              {hasInteracted.confirmPassword && confirmPasswordValidation.errorMessage && (
                <p className="text-sm text-red-500">{confirmPasswordValidation.errorMessage}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-4">
              <Button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
              >
                {isLoading ? 'Creating...' : 'Create User'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="w-full py-3 rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserForm;
