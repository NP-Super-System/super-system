import React from 'react';

const GlobalContext = React.createContext({
    user: {},
    setUser: index => {},
    monthIndex: 0,
    setMonthIndex: index => {},
});

export default GlobalContext;