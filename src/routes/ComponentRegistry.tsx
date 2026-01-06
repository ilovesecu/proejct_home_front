import React from "react";
import TodoPage from "../pages/TodoPage.tsx";
import PraiseStickerPage from "../pages/PraiseStickerPage.tsx";

export const ComponentRegistry:Record<string, React.FC> = {
    lecture: () => <div>준비중</div>,
    challenge: () => <div>준비중</div>,
    community:() => <div>준비중</div>,
    playground:() => <div>준비중</div>,
    todoKeyword: TodoPage,
    praiseSticker: PraiseStickerPage,
}