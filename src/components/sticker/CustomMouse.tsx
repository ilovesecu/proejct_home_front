import {usePraiseSticker} from "../../context/PraiseStickerContext.tsx";

export function CustomMouse(){
    const {mousePos, selectedSticker} = usePraiseSticker();
    return (
        <div
            className="fixed pointer-events-none z-[9999] w-16 h-16"
            style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%) rotate(-5deg)' }}
        >
            <img src={selectedSticker} alt="cursor" className="w-full h-full drop-shadow-2xl" />
        </div>
    )
}