import PraiseStickerBoard from "./containers/sticker/StickerContainer.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TodoPage from "./pages/TodoPage.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";

function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout/>}>
                    <Route path={"/"} element={<TodoPage/>}/>
                    <Route path={"/praise_sticker"} element={<PraiseStickerBoard/>}/>
                </Route>
            </Routes>
        </BrowserRouter>

    )
}

export default App;