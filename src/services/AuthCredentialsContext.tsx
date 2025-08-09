import React, { createContext, useContext, useState, ReactNode } from 'react';

import type { OAuthStrategy } from '@clerk/types';

type Credentials = {
	strategy?: OAuthStrategy | 'enterprise_sso';
	identifier: string;
	password?: string;
	provider: boolean;
} | null;

type AuthCredentialsContextType = {
	storedCredentials: Credentials;
	setStoredCredentials: React.Dispatch<React.SetStateAction<Credentials>>;
};

const AuthCredentialsContext = createContext<AuthCredentialsContextType | undefined>(undefined);

export const AuthCredentialsProvider = ({ children }: { children: ReactNode }) => {
	const [storedCredentials, setStoredCredentials] = useState<Credentials>(null);

	return (
		<AuthCredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
			{children}
		</AuthCredentialsContext.Provider>
	);
};

// Хук для удобного доступа к контексту
export const useAuthCredentials = () => {
	const context = useContext(AuthCredentialsContext);
	if (!context) {
		throw new Error('useAuthCredentials must be used within an AuthCredentialsProvider');
	}
	return context;
};
