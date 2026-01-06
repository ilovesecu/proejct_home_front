import type {MenuItem, SubMenuItem} from "../../types/menu.ts";
import {NavLink} from "react-router-dom";
import {Bell, BookOpen, Flag, Grid, Menu, MessageSquare, Paperclip, ShoppingCart, Users, X} from "lucide-react";
import {useState} from "react";

interface Props{
    menus: MenuItem[]
}

export default function Navbar({menus}:Props){
    const [isOpen, setIsOpen] = useState(false);

    // 아이콘 매핑 함수 (데이터베이스에서 이름으로 올 경우 대비)
    const getIcon = (name?: string) => {
        switch (name) {
            case 'lecture': return <BookOpen size={18} />;
            case 'challenge': return <Flag size={18} />;
            case 'mentoring': return <MessageSquare size={18} />;
            case 'clip': return <Paperclip size={18} />;
            case 'community': return <Users size={18} />;
            default: return null;
        }
    };

    return (
        <nav className="fixed top-0 w-full bg-white border-b border-gray-100 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    <div className="flex items-center gap-8">
                        <NavLink to="/" className="text-xl font-bold text-green-600">LearnProject</NavLink>

                        {/* 데스크톱 메뉴 */}
                        <div className="hidden md:flex items-center gap-6">
                            {menus.map((menu) => (
                                <div key={menu.id} className="relative group h-16 flex items-center">
                                    <NavLink
                                        to={menu.link}
                                        className={({ isActive }) => `
                                          flex items-center gap-2 px-1 py-2 text-[15px] font-medium transition-all
                                          ${isActive ? 'text-green-600' : 'text-gray-600 hover:text-green-500'}
                                        `}
                                    >
                                        {getIcon(menu.iconName)}
                                        {menu.title}
                                        {menu.badge && (
                                            <span className="absolute-top-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border border-white">
                                                {menu.badge}
                                            </span>
                                        )}
                                        {menu.subMenu && <span className="text-[10px] opacity-40">▼</span>}
                                    </NavLink>

                                    {/* 서브 메뉴 드롭다운 (인프런 스타일의 깔끔한 박스) */}
                                    {menu.subMenu && (
                                        <div className="absolute top-[64px] left-0 hidden group-hover:block w-48 bg-white border border-gray-100 shadow-xl rounded-b-lg py-2 transition-all">
                                            {menu.subMenu.map((sub:SubMenuItem) => (
                                                <NavLink
                                                    key={sub.id}
                                                    to={sub.link}
                                                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-green-600"
                                                >
                                                    {sub.title}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 오른쪽: 유틸리티 메뉴 (데스크톱) */}
                    <div className="hidden md:flex items-center gap-4">
                        <button className="text-sm font-semibold text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-md">지식공유</button>
                        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-100">
                            <Grid size={20} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                            <div className="relative">
                                <ShoppingCart size={20} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">9+</span>
                            </div>
                            <div className="relative">
                                <div className="w-8 h-8 bg-gray-200 rounded-full border border-gray-100 cursor-pointer"></div>
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                            </div>
                        </div>
                    </div>

                    {/* 모바일 햄버거 버튼 */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2 focus:outline-none">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* 모바일 메뉴 드로어 */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white ${isOpen ? 'max-h-screen border-b' : 'max-h-0'}`}>
                <div className="px-4 pt-2 pb-6 space-y-1 shadow-inner">
                    {menus.map((menu) => (
                        <NavLink
                            key={menu.id}
                            to={menu.link}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg font-medium transition-colors"
                        >
                            {getIcon(menu.iconName)}
                            {menu.title}
                        </NavLink>
                    ))}
                    <div className="pt-4 mt-4 border-t border-gray-100 flex justify-around">
                        <ShoppingCart size={22} className="text-gray-400" />
                        <Bell size={22} className="text-gray-400" />
                        <Users size={22} className="text-gray-400" />
                    </div>
                </div>
            </div>
        </nav>
    );
}