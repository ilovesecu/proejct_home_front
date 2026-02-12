import {useState} from "react";

interface BoardCreateFormProps {
    onClose: (data: any) => void;
    onSubmit: (title: string, goal: string, totalSlots:number, rewardItem:string) => void;
}

const BoardCreateForm = ({onClose,onSubmit}:BoardCreateFormProps) => {
    const [form, setForm] = useState({
        title: '',
        goal: '',
        totalSlots: 25,
        rewardItem: '기본 보상(나의 사랑)'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'totalSlots' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true); //로딩시작

        try {
            await onSubmit(form.title, form.goal, form.totalSlots, form.rewardItem);
            onClose(true);
        }catch(error) {
            console.error(error);
        } finally {
            setIsSubmitting(false); //로딩종료
        }

    }


    return (
        <div className="p-2">
            {/* 헤더: 이미지의 노란색 타이틀 스타일 반영 */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-yellow-800 mb-1">새 칭찬판 만들기 🎨</h2>
                <p className="text-sm text-gray-500 font-medium">새로운 목표를 향해 스티커를 모아봐요!</p>
            </div>

            <div className="space-y-5">
                {/* 제목 입력 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">보드판 제목</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="예: 1월의 멋진 어린이"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-yellow-100 rounded-2xl focus:border-yellow-400 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                    />
                </div>

                {/* 목표 입력 */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">칭찬 목표</label>
                    <input
                        name="goal"
                        value={form.goal}
                        onChange={handleChange}
                        placeholder="예: 스스로 신발 정리하기"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-yellow-100 rounded-2xl focus:border-yellow-400 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* 칸 수 선택: 이미지에 25, 30칸이 보이므로 셀렉트박스로 구성 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">전체 칸 수</label>
                        <select
                            name="totalSlots"
                            value={form.totalSlots}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-yellow-100 rounded-2xl focus:border-yellow-400 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value={10}>10칸</option>
                            <option value={20}>20칸</option>
                            <option value={25}>25칸 (기본)</option>
                            <option value={30}>30칸</option>
                            <option value={50}>50칸</option>
                        </select>
                    </div>

                    {/* 보상 입력 */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">완성 보상</label>
                        <input
                            name="rewardItem"
                            value={form.rewardItem}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-yellow-100 rounded-2xl focus:border-yellow-400 focus:bg-white outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="flex gap-3 mt-8">
                <button
                    onClick={() => onClose(null)}
                    className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                >
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    className="flex-1 py-4 bg-yellow-400 text-yellow-900 font-black rounded-2xl hover:bg-yellow-500 shadow-md shadow-yellow-200 transition-all active:scale-95"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            생성 중...
                        </span>) : "생성하기"}
                </button>
            </div>
        </div>
    );
};

export default BoardCreateForm;
