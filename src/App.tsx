import React from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import CodeGenerator from './components/CodeGenerator';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="App">
      {isAuthenticated ? <CodeGenerator /> : <LoginForm />}
    </div>
  );
};

export default App;
