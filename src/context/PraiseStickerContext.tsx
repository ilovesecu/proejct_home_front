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

interface PlacedStickersType {
    [key:number]:string;
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