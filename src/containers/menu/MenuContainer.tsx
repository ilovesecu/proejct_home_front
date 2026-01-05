import React, {useCallback, useEffect, useState} from "react";
import type {MenuItem} from "../../types/menu.ts";
import {fetchMenuItems} from "../../api/menuApi.ts";
import Navbar from "../../components/menu/Navbar.tsx";

const MenuContainer: React.FC = () => {
    const [menus, setMenus] = useState<MenuItem[]>([]);

    const fetchMenuItem = useCallback(async ()=>{
        const response = await fetchMenuItems();
        setMenus(response);
    },[]);

    useEffect(() => {
        fetchMenuItem();
    }, [fetchMenuItem]);

    return <Navbar menus={menus}/>;
}

export default MenuContainer;