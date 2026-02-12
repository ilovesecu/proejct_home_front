
interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onDelete: () => void;
    onChangeImage: () => void;
    selectedCount: number;
}

const StickerContextMenu = ({x,y,onClose,onChangeImage,selectedCount,onDelete}: ContextMenuProps) => {
    return (
        <>
            {/* 메뉴 밖 클릭 시 닫기 위한 오버레이 */}
            <div className="fixed inset-0 z-[10000]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />

            <div
                className="fixed z-[10001] bg-white border border-gray-200 shadow-xl rounded-lg py-1 w-48 text-sm text-gray-700"
                style={{ left: x, top: y }}
            >
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 font-bold text-gray-500">
                    스티커 {selectedCount}개 선택됨
                </div>
                <button
                    onClick={() => { onChangeImage(); onClose(); }}
                    className="w-full text-left px-4 py-2 hover:bg-yellow-50 hover:text-yellow-700 transition-colors"
                >
                    🖼️ 이미지 변경
                </button>
                <button
                    onClick={() => { onDelete(); onClose(); }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors"
                >
                    🗑️ 스티커 삭제
                </button>
            </div>
        </>
    );
}

export default StickerContextMenu