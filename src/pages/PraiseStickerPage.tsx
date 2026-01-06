import React from "react";
import PraiseStickerBoard from "../containers/sticker/StickerContainer.tsx";
import {PraiseStickerProvider} from "../context/PraiseStickerContext.tsx";

const PraiseStickerPage:React.FC = () => {
    return (
        <>
            <PraiseStickerProvider>
                <PraiseStickerBoard/>
            </PraiseStickerProvider>
        </>
    )
}
export default PraiseStickerPage;