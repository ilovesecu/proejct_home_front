export interface TodoTask{
    taskId: number;
    content: string;
    status: number;
    taskCreated: string;
}

export interface TodoKeywordResponse{
    keywordId: number;
    mmUserId: string;
    keyword: string;
    isDeleted: number;
    keywordCreated: string;
    tasks: TodoTask[]
}