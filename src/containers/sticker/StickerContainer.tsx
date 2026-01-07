import {CustomMouse} from "../../components/sticker/CustomMouse.tsx";
import EndOverlay from "../../components/sticker/EndOverlay.tsx";
import {usePraiseSticker} from "../../context/PraiseStickerContext.tsx";
import MainBoard from "../../components/sticker/MainBoard.tsx";
import BoardArchive from "../../components/sticker/BoardArchive.tsx";



const PraiseStickerBoard = () => {
    const {
        showCelebration,
        isHoveringBoard,
        setIsHoveringBoard,
    } = usePraiseSticker();

    return (
        <div onMouseEnter={()=>setIsHoveringBoard(true)}
             onMouseLeave={()=>setIsHoveringBoard(false)}
             className={`min-h-screen p-8 flex flex-col items-center transition-colors duration-500 ${showCelebration ? 'bg-yellow-400' : 'bg-emerald-50'} cursor-none`}>

            {/* 1. 커스텀 마우스 도장 - 마우스가 보드판 위에 있을 때만 */}
            {
                isHoveringBoard && <CustomMouse />
            }

            {/* 2. 축하 오버레이 (25개 완성 시) */}
            {showCelebration && <EndOverlay />}

            {/* 3. 메인 보드 */}
            <MainBoard/>
            <BoardArchive/>
            <style>{`
                @keyframes stamp {
                  0% { transform: scale(3) rotate(20deg); opacity: 0; }
                  50% { transform: scale(0.8) rotate(-10deg); }
                  100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                .animate-stamp {
                  animation: stamp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default PraiseStickerBoard;