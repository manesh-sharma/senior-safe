import { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

const STORAGE_KEY = 'seniorsafe_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        // Check if token is still valid (not expired)
        if (parsed.exp && parsed.exp * 1000 > Date.now()) {
          setUser(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle successful Google login
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        givenName: decoded.given_name,
        familyName: decoded.family_name,
        exp: decoded.exp,
      };
      
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error decoding credential:', error);
      return null;
    }
  };

  // Handle logout
  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    handleGoogleSuccess,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
