// ThemeContext.js
import { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('...');
  const [hospital, setHospital] = useState(null);

  const toggleTheme = (data) => {
    setTheme(data);
  };

  const toggleHospital = (data) => {
    setHospital(data);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, hospital,  toggleHospital }}>
      {children} 
    </ThemeContext.Provider>
  );
};
