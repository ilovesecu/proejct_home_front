// BoardArchive.tsx
import { useState } from 'react';
import { usePraiseSticker } from '../../context/PraiseStickerContext';
import {usePopup} from "../../context/PopupContext.tsx";
import CreateBoardPopup from "./CreateBoardPopup.tsx";

const BoardArchive = () => {
    const { boards, currentBoardId, setCurrentBoardId, createNewBoard } = usePraiseSticker();
    const [activeTab, setActiveTab] = useState<'IN_PROGRESS' | 'COMPLETED'>('IN_PROGRESS');
    const filteredBoards = boards.filter(b => b.status === activeTab);
    const {fireCustom} = usePopup();

    const handleOpenCreatePopup = async () => {

        const result = await fireCustom((close) => (
            <CreateBoardPopup onClose={close} createNewBoard={createNewBoard} />
        ));

        if (result) {
            console.log("보드판이 성공적으로 생성되었습니다.");
            // 필요 시 추가적인 알림(fireAlert) 등을 띄울 수 있습니다.
        }
    }

    return (
        <div className="w-full max-w-4xl mt-12 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">📁 보드판 보관함</h2>
                <button
                    onClick={() => handleOpenCreatePopup()} // 새 보드판 생성
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                >
                    + 새 보드판 만들기
                </button>
            </div>

            {/* 탭 메뉴 */}
            <div className="flex gap-4 border-b border-gray-100 mb-6">
                {['IN_PROGRESS', 'COMPLETED'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 px-2 text-sm font-bold transition-all ${
                            activeTab === tab ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400'
                        }`}
                    >
                        {tab === 'in-progress' ? '진행 중' : '완료됨'}
                    </button>
                ))}
            </div>

            {/* 보드 리스트 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredBoards.map(board => (
                    <div
                        key={board.id}
                        onClick={() => setCurrentBoardId(board.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            currentBoardId === board.id ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 hover:border-gray-200'
                        }`}
                    >
                        <p className="font-bold text-gray-700 truncate">{board.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{Object.keys(board.placedStickers).length}/25 개</p>
                    </div>
                ))}
                {filteredBoards.length === 0 && (
                    <div className="col-span-full py-10 text-center text-gray-400 text-sm">
                        보드판이 비어있습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardArchive;