import React, { createContext, useContext, useState } from 'react';

type PathContextType = {
    changeRoute: (route: string) => void;
    currentRoute: string;
};

const PathContext = createContext<PathContextType | null>(null);

export const PathProvider = ({ children }:{children:any}) => {
    const [currentRoute, setCurrentRoute] = useState("main");
    const changeRoute = (route: string) => {
        if (["main", "editor","myNews"].includes(route)) {
            setCurrentRoute(route);
        }
    }

    return (
        <PathContext.Provider value={{ changeRoute, currentRoute }}>
            {children}
        </PathContext.Provider>
    );
};

export const usePath = () => {
    const context = useContext(PathContext);
    if (!context) {
        throw new Error('usePath must be used within PathProvider');
    }
    return context;
};

