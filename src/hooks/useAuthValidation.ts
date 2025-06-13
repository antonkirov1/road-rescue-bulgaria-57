
import { useFieldValidation, loadBlacklist } from './useFieldValidation';
import { useState, useEffect } from 'react';

// Simulated "database" - moved from RegisterForm
const simulatedExistingUsernames = ['admin', 'testuser', 'user123', 'account_admin'];
const simulatedExistingEmails = ['admin@example.com', 'test@example.com', 'roadsaverapp.acc.manager@gmail.com'];

export const useUsernameValidation = (t: (key: string) => string) => {
  const [usernameBlacklist, setUsernameBlacklist] = useState<string[]>([]);

  useEffect(() => {
    loadBlacklist('/lovable-uploads/bad-words.txt').then(setUsernameBlacklist);
  }, []);

  return useFieldValidation<string>(
    '',
    [
      (username) => {
        if (!username) {
          return { isValid: false, errorMessage: '' };
        }
        
        // Convert to lowercase for validation
        const lowerUsername = username.toLowerCase();
        
        // Length validation - more relaxed (3-30 characters)
        if (username.length < 3 || username.length > 30) {
          return { isValid: false, errorMessage: 'Username must be between 3-30 characters' };
        }
        
        // Allow more flexible characters - letters, numbers, underscore, dash, dot
        if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
          return { isValid: false, errorMessage: 'Username can only contain letters, numbers, periods, dashes, and underscores' };
        }
        
        // Must not start or end with special characters
        if (/^[._-]|[._-]$/.test(username)) {
          return { isValid: false, errorMessage: 'Username cannot start or end with special characters' };
        }
        
        // No consecutive special characters
        if (/[._-]{2,}/.test(username)) {
          return { isValid: false, errorMessage: 'Username cannot contain consecutive special characters' };
        }
        
        // Check against existing usernames
        if (simulatedExistingUsernames.includes(lowerUsername)) {
          return { isValid: false, errorMessage: t('username-taken-error') };
        }
        
        // Check against blacklist
        if (usernameBlacklist.some(word => lowerUsername.includes(word))) {
          return { isValid: false, errorMessage: 'Username contains inappropriate content' };
        }
        
        return { isValid: true, errorMessage: null };
      }
    ],
    [t, usernameBlacklist]
  );
};

export const useEmailValidation = (t: (key: string) => string) => {
  return useFieldValidation<string>(
    '',
    [
      (email) => {
        if (!email) {
          return { isValid: false, errorMessage: '' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return { isValid: false, errorMessage: t('email-invalid-format') };
        }
        if (simulatedExistingEmails.includes(email.toLowerCase())) {
          return { isValid: false, errorMessage: t('email-taken-error') };
        }
        return { isValid: true, errorMessage: null };
      }
    ],
    [t]
  );
};

export const usePhoneNumberValidation = (t: (key: string) => string) => {
  return useFieldValidation<string>(
    '+359',
    [
      (phoneNumber) => {
        // Allow empty or default placeholder initially without error
        if (!phoneNumber || phoneNumber === '+359' || phoneNumber.trim() === '+359') {
          return { isValid: true, errorMessage: null };
        }
        // Validate only if it's not empty and not the placeholder
        if (phoneNumber.length !== 13 || !phoneNumber.startsWith('+359')) {
          return { isValid: false, errorMessage: t('phone-invalid-format') };
        }
        return { isValid: true, errorMessage: null };
      }
    ],
    [t]
  );
};

export const usePasswordValidation = (t: (key: string) => string) => {
  const [passwordBlacklist, setPasswordBlacklist] = useState<string[]>([]);

  useEffect(() => {
    loadBlacklist('/lovable-uploads/password blacklist.txt').then(setPasswordBlacklist);
  }, []);

  return useFieldValidation<string>(
    '',
    [
      (password) => {
        if (!password) {
          return { isValid: false, errorMessage: '' };
        }
        
        // More relaxed length validation (6 characters minimum)
        if (password.length < 6) {
          return { isValid: false, errorMessage: 'Password must be at least 6 characters long' };
        }
        
        // Only require one of the following character types (not all)
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^a-zA-Z0-9]/.test(password);
        
        // Must have at least letters and one other type
        if (!hasLetter) {
          return { isValid: false, errorMessage: 'Password must contain at least one letter' };
        }
        
        if (!hasNumber && !hasSpecial) {
          return { isValid: false, errorMessage: 'Password must contain at least one number or special character' };
        }
        
        // Check against blacklist (only common weak passwords)
        const commonWeakPasswords = ['password', '123456', 'qwerty', 'admin', 'letmein'];
        if (commonWeakPasswords.some(weak => password.toLowerCase().includes(weak))) {
          return { isValid: false, errorMessage: 'Password is too common. Please choose a more unique password' };
        }
        
        // Check against custom blacklist if available
        if (passwordBlacklist.length > 0 && passwordBlacklist.some(word => password.toLowerCase().includes(word.toLowerCase()))) {
          return { isValid: false, errorMessage: 'Password contains forbidden content' };
        }
        
        return { isValid: true, errorMessage: null };
      }
    ],
    [t, passwordBlacklist]
  );
};

export const useConfirmPasswordValidation = (password: string, t: (key: string) => string) => {
  return useFieldValidation<string>(
    '',
    [
      (confirmPassword) => {
        if (!confirmPassword && !password) {
          return { isValid: false, errorMessage: '' };
        }
        if (password && confirmPassword && password !== confirmPassword) {
          return { isValid: false, errorMessage: t('passwords-do-not-match') };
        }
        if (password && !confirmPassword) {
          return { isValid: false, errorMessage: t('passwords-do-not-match') };
        }
        if (!password && confirmPassword) {
          return { isValid: false, errorMessage: '' };
        }
        return { isValid: true, errorMessage: null };
      }
    ],
    [password, t]
  );
};
