import {client} from "./client.ts";
import type {ApiResponse} from "../types/api.ts";
import type {Board, BoardResponse, StickerStampRequest} from "../types/PraiseSticker.ts";

export const createBoard = async (newBoard : Board) => {
    return await client.post<ApiResponse<unknown>>('/praise/board', newBoard);
}

export const stampBaord = async (param:StickerStampRequest) => {
    return await client.post<ApiResponse<unknown>>('/praise/sticker', param);
}

export const getBoardSticker = async () => {
    return await client.get<ApiResponse<BoardResponse[]>>('/praise/boardSticker');
}