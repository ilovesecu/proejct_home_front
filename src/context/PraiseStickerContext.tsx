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

//보드관련
export interface Board{
    id: string;
    title: string;
    goal: string;
    placedStickers: PlacedStickersType;
    status: 'in-progress' | 'completed';
    createdAt: string;
    totalSlot:number;
}


interface PlacedStickersType {
    [key:number]:string; //Record<number, string>
}
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
    currentBoardId: string | null;
    setCurrentBoardId: (id: string) => void;
    createNewBoard: (title: string, goal: string) => void;
    updateSticker: (slotId: number) => void;

    STICKERS: StickerType[];
    TOTAL_SLOTS:number;
    selectedSticker:string;
    setSelectedSticker:Dispatch<SetStateAction<string>>;
    placedStickers:PlacedStickersType;
    setPlacedStickers:Dispatch<SetStateAction<PlacedStickersType>>;
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
    const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);

    //현재 선택된 보드
    const activeBoard = useMemo(()=>
        boards.find(b => b.id === currentBoardId) || null
    ,[boards, currentBoardId]);

    //새로운 보드판
    const createNewBoard = (title:string, goal:string, totalSlot:number) => {
        const newBoard:Board = {
            id: Date.now().toString(),
            title: title || `${boards.length + 1}번째 보드판`,
            goal: goal || "기본 목표",
            placedStickers: {},
            status: 'in-progress',
            createdAt: Date.now().toString(),
        };
        setBoards(prev => [...prev, newBoard]);
        setCurrentBoardId(newBoard.id);
    }

    // 현재 보드에 스티커 업데이트
    const updateSticker = (slotId: number) => {
        if (!currentBoardId) return;

        setBoards(prev => prev.map(board => {
            if (board.id === currentBoardId) {
                const nextStickers = { ...board.placedStickers, [slotId]: selectedSticker };
                // 25개가 다 차면 완료 상태로 변경
                const isFinished = Object.keys(nextStickers).length === 25;
                return {
                    ...board,
                    placedStickers: nextStickers,
                    status: isFinished ? 'completed' : board.status
                };
            }
            return board;
        }));
        playPopSound();
    };

    // 초기 보드 생성 (데이터가 하나도 없을 때)
    useEffect(() => {
        if (boards.length === 0) {
            createNewBoard("첫 번째 칭찬판", "스스로 정리정돈 하기 ✨");
        }
    }, []);


    const STICKERS = useMemo(()=>{
        return [
            { id: 'bear', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392471.png' },
            { id: 'rabbit', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392455.png' },
            { id: 'cat', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392502.png' },
            { id: 'dog', url: 'https://cdn-icons-png.flaticon.com/512/4392/4392515.png' },
        ];
    },[])
    const TOTAL_SLOTS = 25;

    const [selectedSticker, setSelectedSticker] = useState<string>(STICKERS[0].url);
    const [placedStickers, setPlacedStickers] = useState<PlacedStickersType>({});
    const [mousePos, setMousePos] = useState<MousePosType>({ x: -100, y: -100 });
    const [showCelebration, setShowCelebration] = useState(false);
    //보드판 위에 있는지 확인
    const [isHoveringBoard, setIsHoveringBoard] = useState(false);

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

    // 25개 완성 체크
    useEffect(() => {
        if (Object.keys(placedStickers).length === TOTAL_SLOTS) {
            setShowCelebration(true);
            // 축하 사운드 추가 가능
            const fanfare = new Audio('https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3');
            fanfare.play();
        }
    }, [placedStickers]);

    const handleSlotClick = (id:number) => {
        // 이미 찍힌 곳이어도 다시 찍을 수 있게 하거나, 사운드를 위해 호출
        playPopSound();
        setPlacedStickers((prev) => ({ ...prev, [id]: selectedSticker }));
    };

    return (
        <PraiseStickerContext.Provider value={{
            STICKERS,
            TOTAL_SLOTS,
            selectedSticker,
            setSelectedSticker,
            placedStickers,
            setPlacedStickers,
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