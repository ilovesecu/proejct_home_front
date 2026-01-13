import {client} from "./client.ts";
import type {ApiResponse} from "../types/api.ts";
import type {BoardCreateRequest, BoardResponse, PlacedSticker, StickerStampRequest} from "../types/PraiseSticker.ts";

export const createBoard = async (newBoard : BoardCreateRequest) => {
    return await client.post<ApiResponse<BoardResponse>>('/praise/board', newBoard);
}

export const stampBaord = async (param:StickerStampRequest) => {
    return await client.post<ApiResponse<PlacedSticker>>('/praise/sticker', param);
}

export const getBoardSticker = async () => {
    return await client.get<ApiResponse<BoardResponse[]>>('/praise/boardSticker');
}

export const helloApi = async () => {
    return await client.get('/guest/hello');
}