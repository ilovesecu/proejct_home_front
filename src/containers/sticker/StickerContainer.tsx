import React, { useState, useEffect, useRef } from 'react';

const STICKERS = [
    { id: 'bear', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392471.png' },
    { id: 'rabbit', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392455.png' },
    { id: 'cat', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392502.png' },
    { id: 'dog', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392515.png' },
];

const TOTAL_SLOTS = 25;

const PraiseStickerBoard = () => {
    const [selectedSticker, setSelectedSticker] = useState(STICKERS[0].url);
    const [placedStickers, setPlacedStickers] = useState({});
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [showCelebration, setShowCelebration] = useState(false);

    // 사운드 재생 함수 (무료 'Pop' 사운드 주소)
    const playPopSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.5;
        audio.play();
    };

    // 마우스 이동 감지
    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // 25개 완성 체크
    useEffect(() => {
        if (Object.keys(placedStickers).length === TOTAL_SLOTS) {
            setShowCelebration(true);
            // 축하 사운드 추가 가능
            const fanfare = new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3');
            fanfare.play();
        }
    }, [placedStickers]);

    const handleSlotClick = (id) => {
        // 이미 찍힌 곳이어도 다시 찍을 수 있게 하거나, 사운드를 위해 호출
        playPopSound();
        setPlacedStickers((prev) => ({ ...prev, [id]: selectedSticker }));
    };

    return (
        <div className={`min-h-screen p-8 flex flex-col items-center transition-colors duration-500 ${showCelebration ? 'bg-yellow-400' : 'bg-emerald-50'} cursor-none`}>

            {/* 1. 커스텀 마우스 도장 */}
            <div
                className="fixed pointer-events-none z-50 w-16 h-16"
                style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%) rotate(-5deg)' }}
            >
                <img src={selectedSticker} alt="cursor" className="w-full h-full drop-shadow-2xl" />
            </div>

            {/* 2. 축하 오버레이 (25개 완성 시) */}
            {showCelebration && (
                <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-700">
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
            )}

            {/* 메인 보드 */}
            <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-yellow-200 relative">
                <div className="bg-yellow-100 p-8 text-center">
                    <h1 className="text-4xl font-black text-yellow-800 mb-2">어린이 칭찬판</h1>
                    <div className="inline-block px-4 py-1 bg-white rounded-full text-yellow-600 font-bold shadow-sm">
                        목표: 스스로 정리정돈 하기 ✨
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

                {/* 그리드 보드 */}
                <div className="p-10 grid grid-cols-5 gap-6 bg-[radial-gradient(#fef3c7_1px,transparent_1px)] [background-size:20px_20px]">
                    {[...Array(TOTAL_SLOTS)].map((_, i) => {
                        const id = i + 1;
                        return (
                            <div
                                key={id}
                                onClick={() => handleSlotClick(id)}
                                className="relative aspect-square rounded-2xl border-2 border-yellow-100 bg-white shadow-inner flex items-center justify-center overflow-hidden hover:border-yellow-300 transition-all"
                            >
                                <span className="text-gray-100 font-black text-3xl select-none">{id}</span>
                                {placedStickers[id] && (
                                    <img
                                        src={placedStickers[id]}
                                        className="absolute w-[85%] h-[85%] animate-stamp"
                                        alt="stamped"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

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