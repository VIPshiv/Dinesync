// src/context/AuthContext.jsx
import { createContext, useState, useContext } from 'react';

/**
 * Authentication context for managing token and role.
 * @type {React.Context}
 */
const AuthContext = createContext();

/**
 * Provides authentication context and methods.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} AuthProvider component.
 */
export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  const login = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access the authentication context.
 * @returns {Object} Authentication context value containing token, role, login, and logout functions.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * Authentication context object.
 * @type {React.Context}
 */
export { AuthContext };