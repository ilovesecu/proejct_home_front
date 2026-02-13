//보드관련
export interface Board{
    id: number;
    title: string;
    goal: string;
    placedStickers: PlacedStickersType;
    status: 'IN_PROGRESS' | 'COMPLETED';
    createdAt: string;
    totalSlots:number;
    rewardItem: string;
    rewarded:boolean;
    completedAt:string;
}

export interface PlacedStickersType {
    [slotId:number]:PlacedSticker; //Record<number, string>
}

export interface PlacedSticker {
    boardId: number;
    nickname: string;
    slotId: number;
    stickerUrl: string;
    stampedAt: string;
}

export interface StickerStampRequest {
    boardId:number;
    slotId:number;
    stickerUrl:string;
}

export interface StickerDeleteRequest {
    boardId:number;
    slotIds:number[];
}

export type BoardResponse = Omit<Board, 'placedStickers'> & {
    placedStickers: PlacedSticker[]; // 이름에 맞게 배열로 설정
};

export interface BoardCreateRequest{
    title:string;
    goal:string;
    totalSlots:number;
    rewardItem:string;
}

/*
결론부터 말씀드리면, 규모가 있는 프로젝트나 객체 지향적인 설계를 지향한다면 **API Response Type(DTO)**과 **UI State Type(Model/ViewModel)**을 **분리하여 서로 변환(Mapping)**하는 것이 훨씬 권장되는 방식입니다.

1. 왜 따로 써서 변환해야 할까요?
단순히 타입을 재사용하면 편할 것 같지만, 다음과 같은 상황에서 한계가 옵니다.

데이터 구조의 최적화: 백엔드는 조인(Join)의 편의를 위해 데이터를 배열(List) 형태로 주지만, 프론트엔드는 특정 칸의 데이터를 즉시 찾기 위해 객체(Key-Value Map) 형태가 필요할 때가 많습니다. (우리가 앞에서 했던 placedStickers 사례가 대표적입니다.)

명명 규칙(Naming Convention): 백엔드(DB)는 stamped_at처럼 snake_case를 쓰는데, 프론트엔드는 stampedAt 같은 camelCase를 유지하고 싶을 때 필요합니다.

유효성 검사 및 기본값: API 결과가 null로 올 수 있는 항목에 대해 프론트엔드 상태에서는 빈 문자열이나 기본값을 채워넣어 런타임 에러를 방지할 수 있습니다.

의존성 분리: 백엔드 API 구조가 살짝 바뀌더라도 프론트엔드 전체 코드를 고치는 대신, 데이터를 변환하는 Mapper 함수만 수정하면 됩니다.
*/

export const convertBoardResponse = (boardResponseArray:BoardResponse[]) => {
    if(!boardResponseArray || boardResponseArray.length === 0)return [];
    const formattedBoards: Board[] = boardResponseArray.map((board:BoardResponse) => ({
        id: board.id,
        title: board.title,
        goal: board.goal,
        rewardItem: board.rewardItem,
        rewarded: board.rewarded,
        status: board.status,
        totalSlots: board.totalSlots,
        createdAt: board.createdAt,
        completedAt: board.completedAt,

        // 중요: 배열 형태를 { slotId: { url, stampedAt } } 객체 형태로 변환
        /*placedStickers: board.placedStickers.reduce((acc:PlacedStickersType, s) => {
            if (s.slotId) { // 스티커가 있는 경우만 추가
                acc[s.slotId] = {
                    stickerUrl: s.stickerUrl,
                    stampedAt: s.stampedAt,
                    nickname: s.nickname,
                    boardId: s.boardId,
                    slotId: s.slotId,
                };
            }
            return acc;
        }, {})*/
        placedStickers: convertPlacedStickers(board.placedStickers),
    }));
    return formattedBoards;
}
export const convertBoardResponseOne = (boardResponse:BoardResponse):Board=>{
    return {
        id: boardResponse.id,
        title: boardResponse.title,
        goal: boardResponse.goal,
        rewardItem: boardResponse.rewardItem,
        rewarded: boardResponse.rewarded,
        status: boardResponse.status,
        totalSlots: boardResponse.totalSlots,
        createdAt: boardResponse.createdAt,
        completedAt: boardResponse.completedAt,

        placedStickers: convertPlacedStickers(boardResponse.placedStickers)
    }
}

export const convertPlacedStickers = (placedStickers:PlacedSticker[]) => {
    if(!placedStickers || placedStickers.length === 0) return {};

    return placedStickers.reduce((acc:PlacedStickersType, s) => {
        if (s.slotId) { // 스티커가 있는 경우만 추가
            acc[s.slotId] = {
                stickerUrl: s.stickerUrl,
                stampedAt: s.stampedAt,
                nickname: s.nickname,
                boardId: s.boardId,
                slotId: s.slotId,
            };
        }
        return acc;
    }, {})
}