
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/utils/translations';
import { 
  useUsernameValidation, 
  useEmailValidation, 
  usePhoneNumberValidation, 
  usePasswordValidation, 
  useConfirmPasswordValidation 
} from '@/hooks/useAuthValidation';

interface UserAccount {
  id: string;
  username: string;
  email: string;
  name?: string;
  created_at: string;
  ban_count?: number;
  banned_until?: string;
}

interface UserFormProps {
  user?: UserAccount;
  onSubmit: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const { language } = useApp();
  const t = useTranslation(language);
  
  // Form state
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [secretQuestion1, setSecretQuestion1] = useState('');
  const [secretAnswer1, setSecretAnswer1] = useState('');
  const [secretQuestion2, setSecretQuestion2] = useState('');
  const [secretAnswer2, setSecretAnswer2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation hooks
  const usernameValidation = useUsernameValidation(t);
  const emailValidation = useEmailValidation(t);
  const phoneValidation = usePhoneNumberValidation(t);
  const passwordValidation = usePasswordValidation(t);
  const confirmPasswordValidation = useConfirmPasswordValidation(passwordValidation.value, t);

  // Initialize form if editing
  useEffect(() => {
    if (user) {
      usernameValidation.setValue(user.username);
      emailValidation.setValue(user.email || '');
      setName(user.name || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const isUsernameValid = usernameValidation.isValid && usernameValidation.value;
    const isEmailValid = emailValidation.isValid && emailValidation.value;
    const isPhoneValid = phoneValidation.isValid;
    const isPasswordValid = user ? true : (passwordValidation.isValid && passwordValidation.value);
    const isConfirmPasswordValid = user ? true : (confirmPasswordValidation.isValid && confirmPasswordValidation.value);

    if (!isUsernameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmPasswordValid) {
      toast({
        title: "Validation Error",
        description: "Please fix all validation errors before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (user) {
        // Update existing user
        const { error } = await supabase
          .from('users')
          .update({
            username: usernameValidation.value,
            email: emailValidation.value,
            name: name || null
          })
          .eq('id', user.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "User updated successfully."
        });
      } else {
        // Create new user
        const { error } = await supabase
          .from('users')
          .insert({
            username: usernameValidation.value,
            email: emailValidation.value,
            name: name || null
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "User created successfully."
        });
      }

      onSubmit();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: "Failed to save user. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-xl md:text-2xl">
              {user ? 'Edit User' : 'Create New User'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">{t('Username')} *</Label>
              <Input
                id="username"
                placeholder={t('enter-username-placeholder')}
                value={usernameValidation.value}
                onChange={(e) => usernameValidation.setValue(e.target.value)}
                className={`border-2 ${
                  usernameValidation.value && !usernameValidation.isValid
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : usernameValidation.value && usernameValidation.isValid
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'focus:border-green-600 focus:ring-green-600'
                }`}
                required
              />
              {usernameValidation.value && usernameValidation.error && (
                <p className="text-sm text-red-500">{usernameValidation.error}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">{t('Email')} *</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('enter-email-placeholder')}
                value={emailValidation.value}
                onChange={(e) => emailValidation.setValue(e.target.value)}
                className={`border-2 ${
                  emailValidation.value && !emailValidation.isValid
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : emailValidation.value && emailValidation.isValid
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'focus:border-green-600 focus:ring-green-600'
                }`}
                required
              />
              {emailValidation.value && emailValidation.error && (
                <p className="text-sm text-red-500">{emailValidation.error}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">{t('Phone Number')}</Label>
              <Input
                id="phone"
                placeholder={t('phone-placeholder')}
                value={phoneValidation.value}
                onChange={(e) => phoneValidation.setValue(e.target.value)}
                className={`border-2 ${
                  phoneValidation.value && phoneValidation.value !== '+359' && !phoneValidation.isValid
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : phoneValidation.value && phoneValidation.value !== '+359' && phoneValidation.isValid
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                    : 'focus:border-green-600 focus:ring-green-600'
                }`}
              />
              {phoneValidation.value && phoneValidation.value !== '+359' && phoneValidation.error && (
                <p className="text-sm text-red-500">{phoneValidation.error}</p>
              )}
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('Full Name')}</Label>
              <Input
                id="name"
                placeholder={t('enter-name-placeholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 focus:border-green-600 focus:ring-green-600"
              />
            </div>

            {/* Gender Field */}
            <div className="space-y-2">
              <Label htmlFor="gender">{t('Gender')}</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="border-2 focus:border-green-600 focus:ring-green-600">
                  <SelectValue placeholder={t('select-gender-placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t('Male')}</SelectItem>
                  <SelectItem value="female">{t('Female')}</SelectItem>
                  <SelectItem value="other">{t('Other')}</SelectItem>
                  <SelectItem value="prefer_not_to_say">{t('Prefer not to say')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password Fields - Only show for new users */}
            {!user && (
              <>
                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">{t('Password')} *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('enter-password-placeholder')}
                      value={passwordValidation.value}
                      onChange={(e) => passwordValidation.setValue(e.target.value)}
                      className={`border-2 pr-10 ${
                        passwordValidation.value && !passwordValidation.isValid
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : passwordValidation.value && passwordValidation.isValid
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                          : 'focus:border-green-600 focus:ring-green-600'
                      }`}
                      required
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
                  {passwordValidation.value && passwordValidation.error && (
                    <p className="text-sm text-red-500">{passwordValidation.error}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('Confirm Password')} *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('confirm-password-placeholder')}
                      value={confirmPasswordValidation.value}
                      onChange={(e) => confirmPasswordValidation.setValue(e.target.value)}
                      className={`border-2 pr-10 ${
                        confirmPasswordValidation.value && !confirmPasswordValidation.isValid
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : confirmPasswordValidation.value && confirmPasswordValidation.isValid
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                          : 'focus:border-green-600 focus:ring-green-600'
                      }`}
                      required
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
                  {confirmPasswordValidation.value && confirmPasswordValidation.error && (
                    <p className="text-sm text-red-500">{confirmPasswordValidation.error}</p>
                  )}
                </div>
              </>
            )}

            {/* Security Questions - Only show for new users */}
            {!user && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t('Security Questions')}</h3>
                  
                  {/* Security Question 1 */}
                  <div className="space-y-2">
                    <Label htmlFor="secretQuestion1">{t('Security Question 1')}</Label>
                    <Select value={secretQuestion1} onValueChange={setSecretQuestion1}>
                      <SelectTrigger className="border-2 focus:border-green-600 focus:ring-green-600">
                        <SelectValue placeholder={t('select-question-placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pet_name">{t('What was the name of your first pet?')}</SelectItem>
                        <SelectItem value="school_name">{t('What was the name of your elementary school?')}</SelectItem>
                        <SelectItem value="birth_city">{t('In what city were you born?')}</SelectItem>
                        <SelectItem value="mother_maiden">{t("What is your mother's maiden name?")}</SelectItem>
                        <SelectItem value="childhood_friend">{t('What was the name of your childhood best friend?')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secretAnswer1">{t('Answer 1')}</Label>
                    <Input
                      id="secretAnswer1"
                      placeholder={t('enter-answer-placeholder')}
                      value={secretAnswer1}
                      onChange={(e) => setSecretAnswer1(e.target.value)}
                      className="border-2 focus:border-green-600 focus:ring-green-600"
                    />
                  </div>

                  {/* Security Question 2 */}
                  <div className="space-y-2">
                    <Label htmlFor="secretQuestion2">{t('Security Question 2')}</Label>
                    <Select value={secretQuestion2} onValueChange={setSecretQuestion2}>
                      <SelectTrigger className="border-2 focus:border-green-600 focus:ring-green-600">
                        <SelectValue placeholder={t('select-question-placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="favorite_book">{t('What is your favorite book?')}</SelectItem>
                        <SelectItem value="first_car">{t('What was your first car?')}</SelectItem>
                        <SelectItem value="favorite_teacher">{t('Who was your favorite teacher?')}</SelectItem>
                        <SelectItem value="street_grew_up">{t('What street did you grow up on?')}</SelectItem>
                        <SelectItem value="favorite_food">{t('What is your favorite food?')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secretAnswer2">{t('Answer 2')}</Label>
                    <Input
                      id="secretAnswer2"
                      placeholder={t('enter-answer-placeholder')}
                      value={secretAnswer2}
                      onChange={(e) => setSecretAnswer2(e.target.value)}
                      className="border-2 focus:border-green-600 focus:ring-green-600"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-gray-600 text-gray-600 hover:bg-gray-50"
              >
                {t('Cancel')}
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? t('saving') : user ? t('Update User') : t('Create User')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserForm;
