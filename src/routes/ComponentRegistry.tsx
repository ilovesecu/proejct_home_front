import React from "react";
import TodoPage from "../pages/TodoPage.tsx";
import PraiseStickerPage from "../pages/PraiseStickerPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import PlaygroundPage from "../pages/PlaygroundPage.tsx";
import AccountBookUploadPage from "../pages/AccountBookUploadPage.tsx";

export const ComponentRegistry:Record<string, React.FC> = {
    lecture: () => <div>준비중</div>,
    challenge: () => <div>준비중</div>,
    community:() => <div>준비중</div>,
    playground:PlaygroundPage,
    todoKeyword: TodoPage,
    praiseSticker: PraiseStickerPage,
    accountBookUpload: AccountBookUploadPage,
    login: LoginPage,
}
