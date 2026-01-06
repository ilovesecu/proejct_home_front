import React from "react";
import Navbar from "../../components/menu/Navbar.tsx";
import {useMenu} from "../../context/MenuContext.tsx";

const MenuContainer: React.FC = () => {
    const {menus} = useMenu();
    return <Navbar menus={menus}/>;
}

export default MenuContainer;