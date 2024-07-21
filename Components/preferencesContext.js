import React from 'react';

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false,
  toggleTextSize: () => {},
  textSize: 'small', // Default text size
});
