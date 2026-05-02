'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type SoundContextType = {
    isSoundEnabled: boolean;
    toggleSound: () => void;
};

const SoundContext = createContext<SoundContextType>({
    isSoundEnabled: false,
    toggleSound: () => {},
});

export const SoundProvider = ({ children }: { children: ReactNode }) => {
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);

    const toggleSound = () => setIsSoundEnabled(prev => !prev);

    return (
        <SoundContext.Provider value={{ isSoundEnabled, toggleSound }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => useContext(SoundContext);
