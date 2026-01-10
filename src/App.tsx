import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.tsx";
import {MenuProvider, useMenu} from "./context/MenuContext.tsx";
import React, {useMemo} from "react";
import {ComponentRegistry} from "./routes/ComponentRegistry.tsx";

//실제 라우트 정보를 설정하는 내부 컴포넌트
const AppRoutes = () => {
    const {menus, loading} = useMenu();

    const allRoutes = useMemo(()=>{
        const routes: { path: string; contentName: string }[] = [];
        const extract = (items: any[]) => {
            items.forEach(item => {
                if (item.contentName && ComponentRegistry[item.contentName]) {
                    routes.push({ path: item.link, contentName: item.contentName });
                }
                if (item.subMenu) extract(item.subMenu);
            });
        };
        extract(menus);
        console.log(routes);
        return routes;
    },[menus]);

    if(loading) return <div>Menu Loading...</div>;
    return (
        <Routes>
            <Route element={<MainLayout/>}>
                {allRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={React.createElement(ComponentRegistry[route.contentName])}
                    />
                ))}
                {/* 기본 경로 설정 */}
                <Route path="/" element={React.createElement(ComponentRegistry['todoKeyword'])} />
                <Route path="/login" element={React.createElement(ComponentRegistry['login'])} />
            </Route>
        </Routes>
    )
}



function App() {
    return(
        <MenuProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </MenuProvider>
    )
}

export default App;