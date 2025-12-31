import {client} from "./client.ts";
import type {TodoAddResponse, TodoKeywordResponse, TodoTaskAddRequest} from "../types/todo.ts";
import type {ApiResponse} from "../types/api.ts";

export const getTodoAll = async () => {
    return await client.get<TodoKeywordResponse[]>('/todo/list/all');
}

export const createTodoKeyword = async() => {
    const response = await client.post('/todo/keyword', {});
    return response;
}

export const createTask = async (keyword:string,content:string) => {
    const param = createTaskParam(keyword,content);
    return await client.post<ApiResponse<TodoAddResponse>>('/todo/add', param);
}

export const deleteTask = async (taskId:number) => {
    return await client.post<ApiResponse<number>>(`/todo/delete/task/${taskId}`);
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