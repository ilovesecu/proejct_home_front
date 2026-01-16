import {usePopup} from "../context/PopupContext.tsx";

const PlaygroundPage:React.FC = () => {
    const { fireAlert, fireConfirm, fireCustom } = usePopup();

    const handleScenario = async () => {
        // 1. Alert (반환 타입: Promise<boolean>)
        await fireAlert('TS 프로젝트에 오신 것을 환영합니다.');

        // 2. Custom Popup - 문자열을 반환받겠다고 명시 <string>
        const userName = await fireCustom<string>((close) => (
            <div className="space-y-4">
                <h3 className="text-lg font-bold">이름을 입력하세요</h3>
                <input id="nameInput" className="border p-2 w-full" placeholder="홍길동" />
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                        const input = document.getElementById('nameInput') as HTMLInputElement;
                        close(input.value); // 여기서 string을 넘겨야 함 (타입 체크 됨)
                    }}
                >
                    제출
                </button>
            </div>
        ));

        // userName은 string | undefined 타입으로 자동 추론됨
        if (userName) {
            await fireAlert(`반갑습니다, ${userName}님!`);
        } else {
            await fireAlert('입력을 취소하셨군요.');
        }

        // 3. Confirm (반환 타입: Promise<boolean>)
        const isExit = await fireConfirm('종료하시겠습니까?');
        if(isExit) console.log('Bye!');
    };

    return (
        <>
            <div className="p-10">
                <button onClick={handleScenario} className="bg-indigo-600 text-white px-4 py-2 rounded">
                    TS 팝업 테스트
                </button>
            </div>
        </>
    );
}

export default PlaygroundPage;