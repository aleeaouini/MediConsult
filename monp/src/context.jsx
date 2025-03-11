import {createContext, useContext, useEffect, useState} from 'react';

const AuthContext = createContext();

export const useUser = () => {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [user, SetUser] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            SetUser(parsedUser);
            console.log("Utilisateur chargé :", parsedUser); // Utilisation de `user` pour éviter l'erreur
        }
    }, []);
    
    const HandleLoginUser = (user) => {
        if (user) {
            SetUser(user);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            SetUser(null);
            localStorage.removeItem('user'); // Supprime l'utilisateur du localStorage
        }
    };
    

    return (
        <AuthContext.Provider value={{user, HandleLoginUser}}>
            {children}
        </AuthContext.Provider>
    );
}