import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser, loadUserFromStorage, clearError } from '../store/slices/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, activeSessions, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Charger l'utilisateur depuis le stockage au démarrage
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const login = async (username, password, rememberMe = false) => {
    const result = await dispatch(loginUser({ username, password, rememberMe }));
    if (loginUser.fulfilled.match(result)) {
      return result.payload;
    } else {
      throw new Error(result.payload || 'Erreur de connexion');
    }
  };

  const logout = async () => {
    await dispatch(logoutUser());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    activeSessions,
    login,
    logout,
    clearAuthError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};