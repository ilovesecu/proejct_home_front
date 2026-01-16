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

export interface PopupItem{
    id: number; //key Porps를 위해 추가
    type: PopupType,
    title?:string;
    message?:ReactNode;
    content?:ReactNode | CustomContentGenerator; //커스텀용
    resolve: (value:any) => void; //Promise Resolve용
}

export interface GlobalPopupContextType {
    fireAlert: (message: ReactNode, title?: string) => Promise<boolean>;
    fireConfirm: (message: ReactNode, title?: string) => Promise<boolean>;
    // 제네릭 <T>를 사용하여 반환 타입을 지정할 수 있게 함
    fireCustom: <T = any>(content: ReactNode | CustomContentGenerator<T>) => Promise<T | undefined>;
}


export interface PopupRendererProps {
    item: PopupItem,
    onClose: () => void;
}