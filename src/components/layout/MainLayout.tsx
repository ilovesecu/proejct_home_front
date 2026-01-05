import React from "react";
import MenuContainer from "../../containers/menu/MenuContainer.tsx";
import {Outlet} from "react-router-dom";

const MainLayout:React.FC = () => {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* 공통 상단 메뉴 */}
            <MenuContainer />

            {/* 실제 페이지 콘텐츠가 갈아끼워지는 영역 */}
            <main className="pt-28 px-4 max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout;