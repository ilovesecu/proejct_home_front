import type {ReactNode} from "react";

export type PopupType = 'custom' | 'alert' | 'confirm';

export interface CustomModalProps {
    isOpen: boolean;
    onOpen?:() => void;
    onClose:() => void;
    children: ReactNode;
}

export interface DefaultPopupLayoutProps {
    title?: string;
    message: React.ReactNode; // 문자열뿐만 아니라 JSX도 허용
    type?: Extract<PopupType, "alert" | "confirm">;
    onConfirm: () => void;
    onCancel: () => void;
}

// 커스텀 팝업의 컨텐츠 함수 타입: close 함수를 인자로 받고 ReactNode를 반환
// T는 닫힐 때 반환할 데이터의 타입
export type CustomContentGenerator<T = void> = (close: (result?: T) => void) => ReactNode;

