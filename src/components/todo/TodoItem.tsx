import type {TodoTask} from "../../types/todo.ts";
import {Check, X} from "lucide-react";

interface Props {
    todo: TodoTask
    keywordId: number;
    onToggle: (keywordId: number, taskId: number) => void;
    onDelete: (keywordId: number, taskId: number) => void;
}

/*
할 일 한줄 보여주는 컴포넌트
 */
export default function TodoItem({todo, keywordId, onToggle, onDelete}: Props) {
    return (
        <li className="group flex items-start gap-3 text-gray-700">
            <button
                onClick={() => onToggle(keywordId, todo.taskId)}
                className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    todo.status === 1
                        ? 'bg-indigo-500 border-indigo-500 text-white'
                        : 'border-gray-300 hover:border-indigo-500'
                }`}
            >
                {todo.status === 1 && <Check className="w-3.5 h-3.5"/>}
            </button>
            <span className={`flex-1 text-sm leading-relaxed ${todo.status === 1 ? 'text-gray-400 line-through' : ''}`}>
                {todo.content}
            </span>
            <button
                onClick={() => onDelete(keywordId, todo.taskId)}
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity"
            >
                <X className="w-4 h-4"/>
            </button>
        </li>
    )
}