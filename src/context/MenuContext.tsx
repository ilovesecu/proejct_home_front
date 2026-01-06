import {createContext, type ReactNode, useCallback, useContext, useEffect, useState} from "react";
import type {MenuItem} from "../types/menu.ts";
import {fetchMenuItems} from "../api/menuApi.ts";

interface MenuContextType {
    menus: MenuItem[];
    loading: boolean;
}
const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({children}: {children: ReactNode}) => {
    const [loading, setLoading] = useState(true);
    const [menus, setMenus] = useState<MenuItem[]>([]);

    const fetchMenuItem = useCallback(async ()=>{
        const response = await fetchMenuItems();
        setMenus(response);
        setLoading(false);
    },[]);

    useEffect(() => {
        fetchMenuItem();
    }, [fetchMenuItem]);

    return (
        <MenuContext.Provider value={{menus, loading}}>
            {children}
        </MenuContext.Provider>
    )
}

export const useMenu = () => {
    const context = useContext(MenuContext);
    if(!context) throw new Error("useMenu must be used within a MenuProvider");
    return context;
}