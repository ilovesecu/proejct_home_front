import type {CustomModalProps} from "../../types/popup.ts";
import ReactDOM from 'react-dom';
import {useEffect} from "react";

const ModalLayout: React.FC<CustomModalProps> = ({isOpen, onOpen, onClose, children}:CustomModalProps) => {

    useEffect(() => {
        if(onOpen && typeof onOpen() === 'function' && isOpen){
            onOpen();
        }
    }, []);

    if(!isOpen) return null;

    // Next.js 등을 쓴다면 document 체크 필요, CRA/Vite는 바로 사용 가능
    const portalRoot = typeof document !== 'undefined' ? document.body : null;
    if(!portalRoot) return null;

    return ReactDOM.createPortal(
        <div
            // 부모 div에 bg-black/50 (또는 bg-black bg-opacity-50)을 추가합니다.
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md p-6 m-4 bg-white rounded-lg shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>, portalRoot);
};

export default ModalLayout;