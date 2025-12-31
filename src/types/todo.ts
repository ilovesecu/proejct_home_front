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

export interface TodoTaskAddRequest{
    channelId: string;
    channelName: string;
    command: string;
    responseUrl: string;
    teamDomain: string;
    teamId: string;
    text: string;
    token: string;
    triggerId: string;
    userId: string;
    userName: string;
}

export interface TodoAddResponse{
    result: number;
    todoAddTaskParams: Array<{
        keywordId: number;
        id: number;
        content: string;
        status: number;
        createdAt : string; //이건 안들어있음.
    }>
}