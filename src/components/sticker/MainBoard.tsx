import {usePraiseSticker} from "../../context/PraiseStickerContext.tsx";
import MainBoardTop from "./MainBoardTop.tsx";
import {useRef, useState} from "react";
import StickerContextMenu from "./StickerContextMenu.tsx";

const MainBoard = () => {
    const {handleSlotClick, activeBoard, deleteStickers} = usePraiseSticker();

    const [selectedSlots, setSelectedSlots] = useState<number[]>([]); //선택된 슬롯 ID
    const [dragStart, setDragStart] = useState<{x:number, y:number} | null>(null);
    const [dragEnd, setDragEnd] = useState<{x:number, y:number} | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    // 드래그 시작 이벤트
    const onMouseDown = (e:React.MouseEvent) => {
        if(e.button !== 0) return ; //좌클릭만 허용
        const rect = boardRef.current?.getBoundingClientRect(); //보드판 영역에 있는지 검사하는 역할인듯!
        if(!rect) return ;

        setDragStart({x: e.clientX, y:e.clientY});
        setDragEnd({x: e.clientX, y:e.clientY});
        setSelectedSlots([]);
    }

    //드래그 중
    const onMouseMove = (e:React.MouseEvent)=>{
        if(!dragStart) return ;
        setDragEnd({x: e.clientX, y:e.clientY});

        const selectionRect = {
            left: Math.min(dragStart.x, e.clientX), // ← 왼쪽으로 드래그 했을 때 작은쪽이 left
            right: Math.max(dragStart.x, e.clientX), // ← 왼쪽 드래그 했을 때 큰쪽이 right
            top: Math.min(dragStart.y, e.clientY),  // ↑ 위쪽으로 드래그 헀을 때 작은 쪽이 top
            bottom: Math.max(dragStart.y, e.clientY), // ↑ 위쪽으로 드래그 했을 때 큰 쪽이 bottom값이 된다.
        }

        const newSelected:number[] = []; //선택된 Slot ID를 담는 변수
        const slots = boardRef.current?.querySelectorAll('.sticker-slot');
        slots?.forEach((slot: any) => {
            const slotRect = slot.getBoundingClientRect();
            // 영역 충돌 검사
            if (!(slotRect.left > selectionRect.right ||
                slotRect.right < selectionRect.left ||
                slotRect.top > selectionRect.bottom ||
                slotRect.bottom < selectionRect.top)) {
                newSelected.push(Number(slot.dataset.id));
            }
        });
        setSelectedSlots(newSelected);
        console.log(selectedSlots);
    }

    //드래그 종료
    const onMouseUp = () => setDragStart(null);

    //우클릭 핸들러
    const handleContextMenu = (e:React.MouseEvent, id?:number) => {
        e.preventDefault();

        //개별 스티커 위에서 우클릭 했는데 선택된 목록에 없다면 해당 스티커만 선택
        if(id && !selectedSlots.includes(id)){
            setSelectedSlots([id]);
        } else if(!id && selectedSlots.length === 0){
            return ; //빈 공간 우클릭 무시
        }
        setContextMenu({x:e.clientX, y:e.clientY});
    }

    return (
        <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-yellow-200 relative select-none"
             ref={boardRef}
             onMouseDown={onMouseDown}
             onMouseMove={onMouseMove}
             onMouseUp={onMouseUp}
             onContextMenu={(e) => handleContextMenu(e)}
        >
            {/* 보드 상단 */}
            <MainBoardTop/>

            {/* 드래그 선택 영역 표시용 박스 */}
            {dragStart && dragEnd && (
                <div
                    className="fixed border-2 border-yellow-400 bg-yellow-200/30 z-[50] pointer-events-none"
                    style={{
                        left: Math.min(dragStart.x, dragEnd.x),
                        top: Math.min(dragStart.y, dragEnd.y),
                        width: Math.abs(dragStart.x - dragEnd.x),
                        height: Math.abs(dragStart.y - dragEnd.y)
                    }}
                />
            )}

            {/* 그리드 보드 */}
            <div className="p-10 grid grid-cols-5 gap-6 bg-[radial-gradient(#fef3c7_1px,transparent_1px)] [background-size:20px_20px]">
                {[...Array(activeBoard?.totalSlots)].map((_, i) => {
                    const slotId = i + 1;
                    const isSelected = selectedSlots.includes(slotId);

                    return (
                        <div
                            key={slotId}
                            data-id={slotId}
                            onClick={() => handleSlotClick(slotId)}
                            onContextMenu={(e) => handleContextMenu(e, slotId)}
                            className={`relative aspect-square rounded-2xl border-2 flex items-center justify-center overflow-hidden transition-all sticker-slot
                            ${isSelected
                                ? 'border-yellow-500 bg-yellow-50 scale-105 shadow-md z-10'
                                : 'border-yellow-100 bg-white shadow-inner hover:border-yellow-300'
                            }
                            `}
                        >
                            <span className="text-gray-100 font-black text-3xl select-none">{slotId}</span>
                            {activeBoard?.placedStickers[slotId] && (
                                <img
                                    src={activeBoard?.placedStickers[slotId].stickerUrl}
                                    className="absolute w-[85%] h-[85%] animate-stamp"
                                    alt="stamped"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 컨텍스트 메뉴 렌더링 */}
            {contextMenu && (
                <StickerContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    selectedCount={selectedSlots.length}
                    onClose={() => setContextMenu(null)}
                    onDelete={() => deleteStickers(selectedSlots)}
                    onChangeImage={() => null}
                />
            )}

        </div>
    )
}

export default MainBoard;