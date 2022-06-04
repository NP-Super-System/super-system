import React, {useState, useEffect} from 'react';

import GlobalContext from './GlobalContext';
import dayjs from 'dayjs';

export default function ContextWrapper(props){
    const [user, setUser] = useState(null);
    const [monthIndex, setMonthIndex] = useState(dayjs().month());
    return (
        <GlobalContext.Provider value={{
            user,
            setUser,
            monthIndex, 
            setMonthIndex,
            }}>
            {props.children}
        </GlobalContext.Provider>
    );
}