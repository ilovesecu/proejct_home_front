import {createContext, type ReactNode, useCallback, useContext, useState} from "react";
import type {CustomContentGenerator, GlobalPopupContextType, PopupItem, PopupRendererProps} from "../types/popup.ts";
import DefaultPopLayout from "../components/layout/DefaultPopLayout.tsx";
import ModalLayout from "../components/layout/ModalLayout.tsx";

const PopupContext = createContext<GlobalPopupContextType | undefined>(undefined);

export const usePopup = () => {
    const context = useContext(PopupContext);
    if(!context) throw new Error("팝업 프로바이더 에러");
    return context;
}

export const GlobalPopupProvider:React.FC<{children: ReactNode}> = ({children}) => {
    const [queue, setQueue] = useState<PopupItem[]>([]);

    const closePop = useCallback(()=>{
        // (보통은 PopupRenderer에서 resolve를 호출하고 이 함수를 부름)
        setQueue(prev => prev.slice(1));
    },[]);

    const addToQueue = (item:Omit<PopupItem, 'id'>) => {
        const id = Date.now() + Math.random();
        setQueue((prev) => [...prev, {...item, id}]);
    }

    const fireAlert = (message: ReactNode, title?:string):Promise<boolean> => {
        return new Promise((resolve) => {
            addToQueue({
                type: 'alert',
                title,
                message,
                resolve: (val) => resolve(val),
            })
        });
    }

    const fireConfirm = (message:ReactNode, title?:string):Promise<boolean> => {
        return new Promise((resolve)=>{
            addToQueue({
                type:'confirm',
                title,
                message,
                resolve: (val) => resolve(val),
            })
        })
    }

    const fireCustom = <T = void> (content:ReactNode | CustomContentGenerator<T>):Promise<T> => {
        return new Promise((resolve)=>{
           addToQueue({
               type:'custom',
               content: content as ReactNode | CustomContentGenerator, //타입단언
               resolve: (val) => resolve(val),
           })
        });
    }

    return (
        <PopupContext.Provider value={{ fireAlert, fireConfirm, fireCustom }}>
            {children}
            {queue.length > 0 && (
                <PopupRenderer item={queue[0]} onClose={closePop} />
            )}
        </PopupContext.Provider>
    )
}

const PopupRenderer:React.FC<PopupRendererProps> = ({item, onClose}) => {
    const { type, title, message, content, resolve } = item;
    const handleClose = (result : any) => {
        // 1. Promise 해결
        resolve(result);

        //2. 큐에서 제거 (STATE가 변경되므로 화면에서 제거)
        onClose();
    }

    let renderContent: ReactNode;

    if(type === 'custom'){
        if (typeof content === 'function') {
            // 함수형 컨텐츠면 close 핸들러를 주입
            renderContent = (content as CustomContentGenerator)(handleClose);
        } else {
            renderContent = content;
        }
    }else{
        // Alert, Confirm
        renderContent = (
            <DefaultPopLayout type={type} message={message} title={title} onConfirm={()=>handleClose(true)} onCancel={()=>handleClose(false)} />
        );
    }

    // Custom이 아닌 경우나, Custom인데 내부에서 닫기 버튼을 따로 구현 안 했을 때를 대비해
    // 배경 클릭 시 닫히게 하려면 handleClose(null) 등을 넣을 수 있음.
    // 여기서는 명시적 액션을 위해 배경 클릭 닫기는 일단 막아두거나 null 전달.
    return (
        <ModalLayout isOpen={true} onClose={() => handleClose(null)}>
            {renderContent}
        </ModalLayout>
    );
}