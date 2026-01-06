import type {ApiResponse} from "../types/api.ts";
import {client} from "./client.ts";
import type {MenuItem} from "../types/menu.ts";


/*
2. DB에서 메뉴를 받아오는 것이 의미가 있을까?
결론부터 말씀드리면, "매우 의미가 있습니다." 단순히 Element를 갈아끼우는 용도가 아니라 시스템 관리 차원에서 접근해야 합니다.

왜 DB에서 관리해야 하나요?
권한 제어 (RBAC):

로그인한 사용자의 **권한(Role)**에 따라 메뉴를 동적으로 보여줘야 합니다. (예: 관리자에게만 '회원관리' 메뉴 노출)

프론트엔드 코드에 하드코딩하면 보안상 취약하며, 권한이 바뀔 때마다 프론트 코드를 수정해서 빌드/배포해야 합니다.

실시간 상태 관리:

특정 메뉴에 'N'(New) 배지를 달거나, 점검 중인 메뉴를 일시적으로 숨기는 작업을 DB 값 변경만으로 즉시 반영할 수 있습니다.

순서 및 이름 변경:

기획팀에서 "메뉴 순서를 바꿔주세요" 또는 "메뉴 이름을 '커뮤니티'에서 '게시판'으로 바꿔주세요"라고 할 때 코드를 건드리지 않고 DB 데이터만 수정하면 됩니다.

"Element 지정 문제"는 어떻게 해결하나요? (Component Registry)
질문하신 대로 리액트 컴포넌트는 코드이므로 DB에 저장할 수 없습니다. 이를 해결하기 위해 보통 Mapping Table 방식을 사용합니다.
 */


export const fetchMenuItems = async ():Promise<MenuItem[]> => {
    //const response = await client.get<ApiResponse<unknown>>('/menu');
    return [
        { id: 1, title: '강의', link: '/courses', iconName: 'lecture', contentName:'lecture' },
        { id: 2, title: '챌린지', link: '/challenge', iconName: 'challenge', badge: 'N', contentName:'challenge' },
        { id: 3, title: '커뮤니티', link: '/community', iconName: 'community', contentName:'community' },
        {
            id:4,
            title:'놀이터',
            link:'/playground',
            contentName:'playground',
            subMenu:[
                {id:31, title: '투두 리스트', link:'/todo', contentName:'todoKeyword'},
                {id:32, title: '칭찬 스티커', link:'/praise_sticker', contentName:'praiseSticker'},
            ]
        }
    ]
}