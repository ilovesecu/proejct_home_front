import React, { useState } from 'react';
import { Plus, Trash2, Check, X, Calendar, Search } from 'lucide-react';

// 1. 타입 정의 (TypeScript)
interface TodoItem {
    id: number;
    content: string;
    isCompleted: boolean;
}

interface KeywordGroup {
    id: number;
    keyword: string;
    updatedAt: string;
    todos: TodoItem[];
}

function App() {
    // 2. 초기 더미 데이터 (Mattermost 스크린샷 참고)
    const [groups, setGroups] = useState<KeywordGroup[]>([
        {
            id: 1,
            keyword: '다이소',
            updatedAt: '2025-12-24 16:32:13',
            todos: [
                { id: 11, content: '심포니 심포포포니 심포', isCompleted: false },
                { id: 10, content: '성은이 냄비 구매 하하이 호호이', isCompleted: true },
                { id: 9, content: '성은이', isCompleted: false },
            ],
        },
        {
            id: 2,
            keyword: '컴퓨터',
            updatedAt: '2025-12-26 16:21:17',
            todos: [
                { id: 12, content: '미니PC 구매해', isCompleted: false },
            ],
        },
    ]);

    const [newKeyword, setNewKeyword] = useState('');

    // --- 기능 구현 (CRUD) ---

    // 1. 키워드 그룹 추가
    const addGroup = () => {
        if (!newKeyword.trim()) return;
        const newGroup: KeywordGroup = {
            id: Date.now(),
            keyword: newKeyword,
            updatedAt: new Date().toLocaleString(),
            todos: [],
        };
        setGroups([newGroup, ...groups]);
        setNewKeyword('');
    };

    // 2. 키워드 삭제
    const deleteGroup = (groupId: number) => {
        if (window.confirm('정말 이 키워드 목록을 삭제하시겠습니까?')) {
            setGroups(groups.filter((g) => g.id !== groupId));
        }
    };

    // 3. 할 일 추가
    const addTodo = (groupId: number, content: string) => {
        const updatedGroups = groups.map((group) => {
            if (group.id === groupId) {
                return {
                    ...group,
                    todos: [
                        ...group.todos,
                        { id: Date.now(), content, isCompleted: false }, // 새 할 일
                    ],
                };
            }
            return group;
        });
        setGroups(updatedGroups);
    };

    // 4. 할 일 삭제
    const deleteTodo = (groupId: number, todoId: number) => {
        setGroups(
            groups.map((group) =>
                group.id === groupId
                    ? { ...group, todos: group.todos.filter((t) => t.id !== todoId) }
                    : group
            )
        );
    };

    // 5. 할 일 완료 토글 (수정의 일종)
    const toggleTodo = (groupId: number, todoId: number) => {
        setGroups(
            groups.map((group) =>
                group.id === groupId
                    ? {
                        ...group,
                        todos: group.todos.map((t) =>
                            t.id === todoId ? { ...t, isCompleted: !t.isCompleted } : t
                        ),
                    }
                    : group
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* 헤더 영역 */}
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">TODO Keyword Manager</h1>
                    <p className="text-gray-500">키워드별로 할 일을 효율적으로 관리하세요</p>
                </header>

                {/* 키워드 추가 입력창 */}
                <div className="flex justify-center mb-12">
                    <div className="relative w-full max-w-md flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="새로운 키워드 추가 (예: 장보기)"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addGroup()}
                            />
                        </div>
                        <button
                            onClick={addGroup}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-md"
                        >
                            <Plus className="w-5 h-5" /> 추가
                        </button>
                    </div>
                </div>

                {/* 메인 컨텐츠: 카드 그리드 레이아웃 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {groups.map((group) => (
                        <TodoCard
                            key={group.id}
                            group={group}
                            onDeleteGroup={deleteGroup}
                            onAddTodo={addTodo}
                            onDeleteTodo={deleteTodo}
                            onToggleTodo={toggleTodo}
                        />
                    ))}
                </div>

                {groups.length === 0 && (
                    <div className="text-center text-gray-400 py-20">
                        등록된 키워드가 없습니다. 새로운 키워드를 추가해보세요! 🚀
                    </div>
                )}
            </div>
        </div>
    );
}

// --- 컴포넌트 분리: 개별 카드 ---
interface TodoCardProps {
    group: KeywordGroup;
    onDeleteGroup: (id: number) => void;
    onAddTodo: (groupId: number, content: string) => void;
    onDeleteTodo: (groupId: number, todoId: number) => void;
    onToggleTodo: (groupId: number, todoId: number) => void;
}

function TodoCard({ group, onDeleteGroup, onAddTodo, onDeleteTodo, onToggleTodo }: TodoCardProps) {
    const [todoInput, setTodoInput] = useState('');

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!todoInput.trim()) return;
        onAddTodo(group.id, todoInput);
        setTodoInput('');
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            {/* 카드 헤더 */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-5 border-b border-gray-100 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
              KEYWORD
            </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {group.updatedAt.split(' ')[0]}
            </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{group.keyword}</h3>
                </div>
                <button
                    onClick={() => onDeleteGroup(group.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="그룹 삭제"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            {/* 할 일 리스트 영역 */}
            <div className="p-5">
                <ul className="space-y-3 mb-6 min-h-[100px]">
                    {group.todos.length === 0 ? (
                        <li className="text-gray-400 text-sm text-center py-4">할 일이 없습니다.</li>
                    ) : (
                        group.todos.map((todo) => (
                            <li key={todo.id} className="group flex items-start gap-3 text-gray-700">
                                <button
                                    onClick={() => onToggleTodo(group.id, todo.id)}
                                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                        todo.isCompleted
                                            ? 'bg-indigo-500 border-indigo-500 text-white'
                                            : 'border-gray-300 hover:border-indigo-500'
                                    }`}
                                >
                                    {todo.isCompleted && <Check className="w-3.5 h-3.5" />}
                                </button>
                                <span className={`flex-1 text-sm leading-relaxed ${todo.isCompleted ? 'text-gray-400 line-through' : ''}`}>
                  {todo.content}
                </span>
                                <button
                                    onClick={() => onDeleteTodo(group.id, todo.id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </li>
                        ))
                    )}
                </ul>

                {/* 할 일 입력 폼 */}
                <form onSubmit={handleAddSubmit} className="relative">
                    <input
                        type="text"
                        placeholder="할 일 추가..."
                        className="w-full bg-gray-50 text-sm pl-4 pr-10 py-3 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-200 transition-all"
                        value={todoInput}
                        onChange={(e) => setTodoInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 p-1"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default App;