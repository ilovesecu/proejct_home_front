import React from "react";
import MenuContainer from "../../containers/menu/MenuContainer.tsx";
import {Outlet} from "react-router-dom";

const MainLayout:React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-slate-900">
            {/* 공통 상단 메뉴 */}
            <MenuContainer />

            {/* 실제 페이지 콘텐츠가 갈아끼워지는 영역 */}
            <main className="pt-16 min-h-[calc(100vh-64px)] flex flex-col">
                <div className="flex-1 w-full max-w-6xl mx-auto bg-white shadow-sm border-x border-gray-200 p-6 md:p-10">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default MainLayout;