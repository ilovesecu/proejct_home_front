import {client} from "./client.ts";
import type {TodoAddResponse, TodoKeywordAddResponse, TodoKeywordResponse, TodoTaskAddRequest} from "../types/todo.ts";
import type {ApiResponse} from "../types/api.ts";

export const getTodoAll = async () => {
    return await client.get<TodoKeywordResponse[]>('/todo/list/all');
}

export const createTodoKeyword = async(keyword:string, mmUserId='react_user') => {
    const param = {keyword, mmUserId};
    return await client.post<ApiResponse<TodoKeywordAddResponse>>('/todo/add/keyword', param);
}

export const deleteKeyword = async (keywordId:number) => {
    return await client.delete<ApiResponse<never>>(`/todo/keyword/${keywordId}`);
}

export const createTask = async (keyword:string,content:string) => {
    const param = createTaskParam(keyword,content);
    return await client.post<ApiResponse<TodoAddResponse>>('/todo/add', param);
}

export const deleteTask = async (taskId:number) => {
    return await client.delete<ApiResponse<number>>(`/todo/delete/task/${taskId}`);
}

export const toggleTask = async (taskId:number) => {
    return await client.patch<ApiResponse<number>>(`/todo/toggle/task/${taskId}`);
}

const createTaskParam = (keyword:string,todoInput:string) :TodoTaskAddRequest=> {
    return {
        channelId:'react_front',
        channelName:'react_front_channel',
        command:'/react_add',
        responseUrl:'',
        teamDomain:'',
        teamId:'',
        text:`${keyword} ${todoInput}`,
        token:'',
        triggerId:'',
        userId:'react_user',
        userName:'react_user',
    }
}