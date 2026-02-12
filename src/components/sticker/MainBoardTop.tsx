import {usePraiseSticker} from "../../context/PraiseStickerContext.tsx";

const MainBoardTop = () => {
    const {STICKERS, setSelectedSticker, selectedSticker, activeBoard} = usePraiseSticker();

    return (
        <>
            <div className="bg-yellow-100 p-8 text-center">
                <h1 className="text-4xl font-black text-yellow-800 mb-2">{activeBoard?.title || '기본'}</h1>
                <div className="inline-block px-4 py-1 bg-white rounded-full text-yellow-600 font-bold shadow-sm">
                    목표: {activeBoard?.goal || '스스로 정리정돈 하기(기본)'} ✨
                </div>
            </div>

            {/* 스티커 선택창 */}
            <div className="flex justify-center gap-6 p-4 bg-gray-50 border-b-2 border-dashed border-gray-200">
                {STICKERS.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setSelectedSticker(s.url)}
                        className={`group relative transition-all ${selectedSticker === s.url ? 'scale-125' : 'hover:scale-110 opacity-50'}`}
                    >
                        <img src={s.url} className="w-14 h-14" alt="sticker" />
                        {selectedSticker === s.url && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full" />}
                    </button>
                ))}
            </div>
        </>
    )
}

export default MainBoardTop;