import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOrgAccount, setIsOrgAccount] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedIsOrg = localStorage.getItem('isOrgAccount') === 'true';

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsOrgAccount(storedIsOrg);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken, isOrg = false) => {
    setUser(userData);
    setToken(authToken);
    setIsOrgAccount(isOrg);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isOrgAccount', isOrg.toString());
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsOrgAccount(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isOrgAccount');
  };

  const value = {
    user,
    token,
    isOrgAccount,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
