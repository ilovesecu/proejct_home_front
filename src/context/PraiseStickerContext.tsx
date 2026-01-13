import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {createBoard, getBoardSticker, helloApi, stampBaord} from "../api/praiseStickerApi.ts";
import {
    type Board,
    convertBoardResponse,
    convertBoardResponseOne
} from "../types/PraiseSticker.ts";


interface MousePosType {
    x:number;
    y:number;
}
interface StickerType {
    id:string;
    url:string;
}

interface PraiseStickerContextType {
    boards: Board[];
    activeBoard: Board | null;
    currentBoardId: number;
    setCurrentBoardId: (id: number) => void;
    createNewBoard: (title: string, goal: string, totalSlots:number, rewardItem:string) => void;

    STICKERS: StickerType[];
    selectedSticker:string;
    setSelectedSticker:Dispatch<SetStateAction<string>>;
    mousePos:MousePosType;
    setMousePos:Dispatch<SetStateAction<MousePosType>>;
    showCelebration:boolean;
    setShowCelebration:Dispatch<SetStateAction<boolean>>;
    isHoveringBoard:boolean;
    setIsHoveringBoard:Dispatch<SetStateAction<boolean>>;
    playPopSound:()=>void;
    handleSlotClick:(id:number)=>void;
}
const PraiseStickerContext = createContext<PraiseStickerContextType | undefined>(undefined);


export const PraiseStickerProvider = ({children}:{children:ReactNode}) => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [currentBoardId, setCurrentBoardId] = useState<number>(0);

    const STICKERS = useMemo(()=>{
        return [
            { id: 'bear', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392471.png' },
            { id: 'rabbit', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392455.png' },
            { id: 'cat', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392502.png' },
            { id: 'dog', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392515.png' },
        ];
    },[])
    //const TOTAL_SLOTS = 25;

    const [selectedSticker, setSelectedSticker] = useState<string>(STICKERS[0].url);
    //const [placedStickers, setPlacedStickers] = useState<PlacedStickersType>({});
    const [mousePos, setMousePos] = useState<MousePosType>({ x: -100, y: -100 });
    const [showCelebration, setShowCelebration] = useState(false);
    //보드판 위에 있는지 확인
    const [isHoveringBoard, setIsHoveringBoard] = useState(false);

    //현재 선택된 보드
    const activeBoard = useMemo(()=>
        boards.find(b => b.id === currentBoardId) || null
    ,[boards, currentBoardId]);

    //새로운 보드판
    const createNewBoard = async (title:string, goal:string, totalSlots:number, rewardItem:string) => {
        /*const newBoard:Board = {
            id: 2,
            title: title || `${boards.length + 1}번째 보드판`,
            goal: goal || "기본 목표",
            placedStickers: {},
            status: 'IN_PROGRESS',
            createdAt: new Date().toISOString(),
            totalSlots : totalSlots || 25,
            rewardItem: rewardItem || '기본보상(나의 사랑)',
            rewarded:false,
            completedAt:'',
        };*/
        const boardCreateReuqest = {
            title, goal, totalSlots, rewardItem
        };
        const response = await createBoard(boardCreateReuqest);
        const newBoardResponse = response.data;
        const newBoard = convertBoardResponseOne(newBoardResponse);

        setBoards(prev => [...prev, newBoard]);
        setCurrentBoardId(newBoard.id);
        setShowCelebration(false); // 새 보드판은 축하 효과 리셋
    }

    //보드, 스티커 정보 가져오기
    const fetchBoardStickers = async () => {
        const response = await getBoardSticker();
        const formattedBoards = convertBoardResponse(response.data);

        const currentId = formattedBoards?.[0]?.id ;
        setBoards(formattedBoards);
        setCurrentBoardId(currentId);//맨 마지막 보드판을 현재 보드판으로 설정해준다.
    }

    // 사운드 재생 함수 (무료 'Pop' 사운드 주소)
    const playPopSound = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
        audio.volume = 0.5;
        audio.play();
    };

    // 마우스 이동 감지
    useEffect(() => {
        const handleMouseMove = (e:MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // 초기 보드 생성 (데이터가 하나도 없을 때)
    useEffect(() => {
        /*if (boards.length === 0) {
            createNewBoard("첫 번째 칭찬판1", "스스로 정리정돈 하기 ✨", 25, 'BASIC BONUS');
        }*/
        fetchBoardStickers();
        test();
    }, []);

    const test = async ()=>{
        //TODO 연속 API 호출 TEST
        const testResponse = await helloApi();
        console.log(testResponse);
    }

    //스티커 업데이트
    const handleSlotClick = async (slotId:number) => {
        if (!currentBoardId || !activeBoard) return;
        // 이미 찍힌 곳이어도 다시 찍을 수 있게 하거나, 사운드를 위해 호출
        playPopSound();

        const params = {
            boardId: currentBoardId,
            slotId,
            stickerUrl: selectedSticker,
        }
        const responseData = await stampBaord(params);
        if(responseData.status === 'SUCCESS' && responseData.data){
            setBoards(prev => prev.map(board => {
                if(board.id === currentBoardId){
                    const nextStickers = {...board.placedStickers,
                        [slotId]: {
                            stickerUrl:responseData.data.stickerUrl,
                            boardId:responseData.data.boardId,
                            stampedAt:responseData.data.stampedAt,
                            nickname:responseData.data.nickname,
                            slotId:slotId,
                    }};
                    // 해당 보드의 totalSlot 기준으로 완료 체크
                    const isFinished = Object.keys(nextStickers).length === board.totalSlots;

                    if(isFinished){
                        setShowCelebration(true);
                        new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3').play();
                    }
                    return {
                        ...board,
                        placedStickers: nextStickers,
                        status: isFinished ? 'COMPLETED' : board.status,
                    }
                }
                return board;
            }));
        }
    };

    return (
        <PraiseStickerContext.Provider value={{
            boards,
            activeBoard,
            currentBoardId,
            setCurrentBoardId,
            createNewBoard,

            STICKERS,
            //TOTAL_SLOTS,
            selectedSticker,
            setSelectedSticker,
            mousePos,
            setMousePos,
            showCelebration,
            setShowCelebration,
            isHoveringBoard,
            setIsHoveringBoard,
            playPopSound,
            handleSlotClick
        }}>
            {children}
        </PraiseStickerContext.Provider>
    )
}

export const usePraiseSticker = () => {
    const context = useContext(PraiseStickerContext);
    if(!context) throw new Error("스티커 프로바이더 에러");
    return context;
}