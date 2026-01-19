import {usePraiseSticker} from "../../context/PraiseStickerContext.tsx";
import {useState} from "react";

interface CreateBoardPopupProps {
    onClose: (result:boolean | null) => void;
    // 칭찬판 생성 함수를 Props로 정의합니다.
    createNewBoard: (title: string, goal: string, totalSlots: number, rewardItem: string) => Promise<void>;
}

const CreateBoardPopup = ({onClose,createNewBoard}:CreateBoardPopupProps) => {
    const [form,setForm] = useState({
        title:'',
        goal:'',
        totalSlots:25,
        rewardItem: '기본 보상(나의 사랑)',
    });

    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({
           ...prev,
           [name]: name === 'totalSlots' ? Number(value) : value,
        }))
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title.trim() || !form.goal.trim()) {
            alert("제목과 목표를 입력해주세요!");
            return;
        }

        try {
            // Context의 createNewBoard 호출
            await createNewBoard(
                form.title,
                form.goal,
                form.totalSlots,
                form.rewardItem
            );
            onClose(true); // 성공 시 팝업 닫기
        } catch (error) {
            console.error("보드 생성 실패:", error);
            alert("보드 생성 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <div className="p-2">
                <h2 className="text-2xl font-black text-yellow-800 mb-6 text-center">새 칭찬판 만들기 🎨</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">보드판 제목</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="예: 1월의 멋진 어린이"
                            className="w-full px-4 py-2 border-2 border-yellow-100 rounded-xl focus:border-yellow-400 outline-none transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">칭찬 목표</label>
                        <input
                            type="text"
                            name="goal"
                            value={form.goal}
                            onChange={handleChange}
                            placeholder="예: 스스로 신발 정리하기"
                            className="w-full px-4 py-2 border-2 border-yellow-100 rounded-xl focus:border-yellow-400 outline-none transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">전체 칸 수</label>
                            <select
                                name="totalSlots"
                                value={form.totalSlots}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border-2 border-yellow-100 rounded-xl focus:border-yellow-400 outline-none transition-colors bg-white"
                            >
                                <option value={10}>10칸</option>
                                <option value={20}>20칸</option>
                                <option value={25}>25칸</option>
                                <option value={30}>30칸</option>
                                <option value={50}>50칸</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">완성 보상</label>
                            <input
                                type="text"
                                name="rewardItem"
                                value={form.rewardItem}
                                onChange={handleChange}
                                placeholder="예: 초콜릿 1개"
                                className="w-full px-4 py-2 border-2 border-yellow-100 rounded-xl focus:border-yellow-400 outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => onClose(null)}
                            className="flex-1 py-3 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-2xl hover:bg-yellow-500 shadow-md transition-all active:scale-95"
                        >
                            생성하기
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CreateBoardPopup;