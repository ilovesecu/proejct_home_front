/*
    UI에 대한 고민을 최소화, 데이터를 어떻게 조작할지만 담당
    API 연동은 여기에서 담당한다.
*/

import type {TodoKeywordResponse} from "../../types/todo.ts";
import {useEffect, useState} from "react";
import TodoHeader from "../../components/todo/TodoHeader.tsx";
import TodoCard from "../../components/todo/TodoCard.tsx";
import {createTask, createTodoKeyword, deleteKeyword, deleteTask, getTodoAll, toggleTask} from "../../api/todoApi.ts";
import {useImmer} from "use-immer";

export default function TodoContainer(){
    // --- state 관리 ---

    const [todoData,setTodoData] = useImmer<TodoKeywordResponse[]>([]);
    const [newKeyword, setNewKeyword] = useState('');
    const getInitData = async () => {
        const todoKeywordResponse = await getTodoAll();
        console.log(todoKeywordResponse);
        setTodoData(todoKeywordResponse);
    }

    useEffect(() => {
        getInitData();
    }, []);

    // --- 비즈니스 로직 ---
    // 키워드 추가 함수
    const handleAddKeyword = async () => {
        if(!newKeyword.trim()) return;
        const response = await createTodoKeyword(newKeyword.trim());
        if(response.status === 'SUCCESS'){
            await getInitData();
        }
        setNewKeyword('');
    }
    // 키워드 삭제 함수
    const handleDeleteKeyword = async (keywordId:number) => {
        const response = await deleteKeyword(keywordId);
        if(response.status === 'SUCCESS'){
            setTodoData(draft => {
                //immer가 처리함.
                return draft.filter(k => k.keywordId !== keywordId);
            });
        }
    }
    // 할 일 추가 함수
    const handleAddTask = async (keyword:string, content:string) => {
        const response = await createTask(keyword, content);
        console.log(response);
        if(response.status === "SUCCESS" && (response.data.result === 1 || response.data.result === 2)){
            //const todoAddTaskParam = response.data.todoAddTaskParams;
            await getInitData();
        }
    }
    // 할 일 토글 함수
    const handleToggleTask = async (keywordId:number, taskId:number) => {
        const response = await toggleTask(taskId);
        if(response.status === 'SUCCESS' && response.data > 0){
            setTodoData(draft => {
                const targetKeyword = draft.find(k => k.keywordId === keywordId);
                if(targetKeyword){
                    const targetTask = targetKeyword.tasks.find(t => t.taskId === taskId);
                    if(targetTask){
                        targetTask.status = targetTask.status === 1 ? 0 : 1;
                    }
                }
            })
        }
    }
    //할 일 제거 함수
    const handleDeleteTask = async (keywordId:number, taskId:number) => {
        const response = await deleteTask(taskId);
        if(response.data > 0){
            //todoData에서 keywordId, taskId인 것을 골라서 삭제해줘야함.
            setTodoData(draft => {
                const targetKeyword = draft.find(k => k.keywordId === keywordId);
                if(targetKeyword){
                    targetKeyword.tasks = targetKeyword.tasks.filter(t => t.taskId !== taskId);
                }
            })
        }
    }

    // --- RENDER (화면 조합)
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/*  Header 및 Keyword INPUT 영역  */}
                <TodoHeader newKeyword={newKeyword} setNewKeyword={setNewKeyword} onAddKeyword={handleAddKeyword}/>
                {/* 메인 리스트 영역 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                    {
                        todoData.map((keyword)=>(
                            <TodoCard
                                key={keyword.keywordId}
                                keyword={keyword}
                                onDeleteGroup={handleDeleteKeyword}
                                onAddTask={handleAddTask}
                                onDeleteTask={handleDeleteTask}
                                onToggleTask={handleToggleTask}
                            />
                        ))
                    }
                </div>
                {
                    todoData.length === 0 && (
                        <div className='text-center text-gray-400 py-20'>
                            등록된 키워드가 없습니다. 새로운 키워드를 추가해보세요!
                        </div>
                    )
                }
            </div>
        </div>
    )
    
}