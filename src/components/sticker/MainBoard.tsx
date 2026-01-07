import {usePraiseSticker} from "../../context/PraiseStickerContext.tsx";
import MainBoardTop from "./MainBoardTop.tsx";

const MainBoard = () => {
    const {handleSlotClick, activeBoard} = usePraiseSticker();

    return (
        <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-yellow-200 relative">
            {/* 보드 상단 */}
            <MainBoardTop/>

            {/* 그리드 보드 */}
            <div className="p-10 grid grid-cols-5 gap-6 bg-[radial-gradient(#fef3c7_1px,transparent_1px)] [background-size:20px_20px]">
                {[...Array(activeBoard?.totalSlot)].map((_, i) => {
                    const slotId = i + 1;
                    return (
                        <div
                            key={slotId}
                            onClick={() => handleSlotClick(slotId)}
                            className="relative aspect-square rounded-2xl border-2 border-yellow-100 bg-white shadow-inner flex items-center justify-center overflow-hidden hover:border-yellow-300 transition-all"
                        >
                            <span className="text-gray-100 font-black text-3xl select-none">{slotId}</span>
                            {activeBoard?.placedStickers[slotId] && (
                                <img
                                    src={activeBoard?.placedStickers[slotId]}
                                    className="absolute w-[85%] h-[85%] animate-stamp"
                                    alt="stamped"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default MainBoard;