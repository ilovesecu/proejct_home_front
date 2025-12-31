import {Plus, Search} from "lucide-react";

interface Props{
    newKeyword: string;
    setNewKeyword:(val:string) => void;
    onAddKeyword: ()=>void;
}
/*
    페이지 상단 제목과 키워드 추가 영역
*/
export default function TodoHeader({newKeyword, setNewKeyword, onAddKeyword}:Props){
    return (
        <>
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">TODO Keyword Manager</h1>
                <p className="text-gray-500">키워드별로 할 일을 효율적으로 관리하세요</p>
            </header>
            <div className="flex justify-center mb-12">
                <div className="relative w-full max-w-md flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="새로운 키워드 추가 (예: 장보기)"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onAddKeyword()}
                        />
                    </div>
                    <button
                        onClick={onAddKeyword}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-md"
                    >
                        <Plus className="w-5 h-5" /> 추가
                    </button>
                </div>
            </div>
        </>
    )
}