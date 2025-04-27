import { createContext, useState } from "react";




interface AppContextType {
    backendUrl: string;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    userData: boolean;
    setUserData: (value: boolean) => void;
  }

export const AppContent = createContext<AppContextType | null>(null);
export const AppContextProvider = (props: React.PropsWithChildren<{}>) => {
 
    
 const backendUrl = import.meta.env.VITE_BACKEND_URL
 const [isLoggedIn, setIsLoggedIn] = useState(false)
 const [userData, setUserData] = useState(false)
 
 const value ={
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,


 }
 return(
    <AppContent.Provider value={value}>
        {props.children}
    </AppContent.Provider>
 )



}