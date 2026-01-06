import {usePraiseSticker} from "../../context/PraiseStickerContext.tsx";


const EndOverlay = () => {
    const {setPlacedStickers, setShowCelebration} = usePraiseSticker();
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-700">
            <div className="text-center animate-bounce">
                <h2 className="text-6xl font-black text-white mb-4">🎉 대단해요! 🎉</h2>
                <p className="text-2xl text-yellow-300 font-bold">칭찬 스티커 25개를 모두 모았어요!</p>
            </div>
            <button
                onClick={() => { setPlacedStickers({}); setShowCelebration(false); }}
                className="mt-12 px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black rounded-full text-xl shadow-xl transition-transform hover:scale-110"
            >
                새 판 시작하기
            </button>
        </div>
    )
}

export default EndOverlay;