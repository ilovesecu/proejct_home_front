import {client} from "./client.ts";
import type {TodoKeywordResponse} from "../types/todo.ts";

export const getTodoAll = async () => {
    return await client.get<TodoKeywordResponse[]>('/todo/list/all');
}

export const createTodoKeyword = async() => {
    const response = await client.post('/todo/keyword', {});
    return response.data;
}