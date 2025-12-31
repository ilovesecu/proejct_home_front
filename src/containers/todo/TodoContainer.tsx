/*
    UI에 대한 고민을 최소화, 데이터를 어떻게 조작할지만 담당
    API 연동은 여기에서 담당한다.
*/

import type {TodoKeywordResponse} from "../../types/todo.ts";
import {useEffect, useState} from "react";
import TodoHeader from "../../components/todo/TodoHeader.tsx";
import TodoCard from "../../components/todo/TodoCard.tsx";
import {getTodoAll} from "../../api/todoApi.ts";

export default function TodoContainer(){
    // --- state 관리 ---
    const DUMMY_TODO_DATA: TodoKeywordResponse[] = [
        {
            keywordId: 1,
            mmUserId: "user_abc123",
            keyword: "장보기",
            isDeleted: 0,
            keywordCreated: "2024-05-20 10:00:00",
            tasks: [
                {
                    taskId: 101,
                    content: "우유 900ml 구매",
                    status: 1, // 1: 완료됨 가정
                    taskCreated: "2024-05-20 10:05:00",
                },
                {
                    taskId: 102,
                    content: "계란 한 판",
                    status: 0, // 0: 미완료 가정
                    taskCreated: "2024-05-20 10:06:00",
                },
                {
                    taskId: 103,
                    content: "삼겹살 600g",
                    status: 0,
                    taskCreated: "2024-05-20 12:30:00",
                },
            ],
        },
        {
            keywordId: 2,
            mmUserId: "user_abc123",
            keyword: "개인 프로젝트",
            isDeleted: 0,
            keywordCreated: "2024-05-21 09:00:00",
            tasks: [
                {
                    taskId: 201,
                    content: "DB 스키마 설계",
                    status: 1,
                    taskCreated: "2024-05-21 09:10:00",
                },
                {
                    taskId: 202,
                    content: "API 명세서 작성",
                    status: 0,
                    taskCreated: "2024-05-21 14:00:00",
                },
            ],
        },
        {
            keywordId: 3,
            mmUserId: "user_xyz987",
            keyword: "운동",
            isDeleted: 0,
            keywordCreated: "2024-05-22 18:00:00",
            tasks: [], // 할 일이 없는 경우 (빈 배열)
        },
    ];
    const [newKeyword, setNewKeyword] = useState('');
    const getInitData = async () => {
        const  todoKeywordResponse = await getTodoAll();
        console.log(todoKeywordResponse);
    }

    useEffect(() => {
        getInitData();
    }, []);

    // --- 비즈니스 로직 ---
    // 키워드 추가 함수
    const handleAddKeyword = () => {
        if(!newKeyword.trim()) return;
        setNewKeyword('');
    }
    // 키워드 삭제 함수
    const handleDeleteKeyword = () => {

    }
    // 할 일 추가 함수
    const handleAddTask = () => {

    }
    // 할 일 완료 함수
    const handleToggleTask = () => {

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
                        DUMMY_TODO_DATA.map((keyword)=>(
                            <TodoCard
                                key={keyword.keywordId}
                                keyword={keyword}
                                onDeleteGroup={handleDeleteKeyword}
                                onAddTask={handleAddKeyword}
                                onDeleteTask={handleAddTask}
                                onToggleTask={handleToggleTask}
                            />
                        ))
                    }
                </div>
                {
                    DUMMY_TODO_DATA.length === 0 && (
                        <div className='text-center text-gray-400 py-20'>
                            등록된 키워드가 없습니다. 새로운 키워드를 추가해보세요!
                        </div>
                    )
                }
            </div>
        </div>
    )
    
}