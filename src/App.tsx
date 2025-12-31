import React, { useState } from 'react';
import { Plus, Trash2, Check, X, Calendar, Search } from 'lucide-react';
import TodoContainer from "./containers/todo/TodoContainer.tsx";

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
    return(
        <TodoContainer/>
    )
}

export default App;