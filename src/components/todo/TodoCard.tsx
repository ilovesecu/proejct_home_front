/*
할 일들의 집합인 키워드 카드를 보여주는 컴포넌트
 */

import type {TodoKeywordResponse, TodoTask} from "../../types/todo.ts";
import {useState} from "react";
import {Calendar, Plus, Trash2} from "lucide-react";
import TodoItem from "./TodoItem.tsx";

interface Props {
    keyword: TodoKeywordResponse;
    onDeleteGroup: (keywordId: number) => void;
    onAddTask: (keyword: string, content: string) => void;
    onDeleteTask: (keywordId: number, taskId: number) => void;
    onToggleTask: (keywordId: number, taskId: number) => void;
}

export default function TodoCard({
                                     keyword,
                                     onDeleteGroup,
                                     onAddTask,
                                     onDeleteTask,
                                     onToggleTask
                                 }: Props) {
    //내부 입력창 (taskInput) 은 UI 관련이라 여기서 관리 OK
    const [taskInput, setTaskInput] = useState('');

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskInput.trim()) return;
        onAddTask(keyword.keyword, taskInput);
        setTaskInput('');
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            {/* 카드 헤더 */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-5 border-b border-gray-100 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">KEYWORD</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3"/> {keyword.keywordCreated.split(' ')[0]}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{keyword.keyword}</h3>
                </div>
                <button
                    onClick={() => onDeleteGroup(keyword.keywordId)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="그룹 삭제"
                >
                    <Trash2 className="w-5 h-5"/>
                </button>
            </div>

            {/* 할 일 리스트 */}
            <div className="p-5">
                <ul className="space-y-3 mb-6 min-h-[100px]">
                    {keyword.tasks.length === 0 ? (
                        <li className="text-gray-400 text-sm text-center py-4">할 일이 없습니다.</li>
                    ) : (
                        keyword.tasks.map((todo:TodoTask) => (
                            <TodoItem
                                key={todo.taskId}
                                todo={todo}
                                keywordId={keyword.keywordId}
                                onToggle={onToggleTask}
                                onDelete={onDeleteTask}
                            />
                        ))
                    )}
                </ul>

                {/* 할 일 입력 폼 */}
                <form onSubmit={handleAddSubmit} className="relative">
                    <input
                        type="text"
                        placeholder="할 일 추가..."
                        className="w-full bg-gray-50 text-sm pl-4 pr-10 py-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-200 transition-all"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                    />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 p-1">
                        <Plus className="w-5 h-5"/>
                    </button>
                </form>
            </div>
        </div>
    );

}