import axios, {type AxiosInstance, type AxiosRequestConfig} from "axios";
import type {LoginResponse} from "../types/login.ts";

let isRefreshing = false; //현재 재발급인지 체크하는 플래그
let refreshSubscribers = []; //재발급을 기다리는 요청들의 목록 (대기열)

//새 토큰을 받으면 새 토큰으로 대기요청을 일괄 처리한다.
const onRefreshed = (accessToken) => {
    refreshSubscribers.forEach((callback)=>callback(accessToken));
    refreshSubscribers = [];
}
//대기열에 엑세스 토큰 받고 실행할 함수들을 추가해준다.
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
}

export const client:AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000, //5초 타임아웃
    headers:{
        'Content-Type': 'application/json',
    },
    withCredentials: true, //CORS 쿠키 전송
});

//요청 인터셉터 (Requet Interceptor) - 요청 보내기 직전에 실행
client.interceptors.request.use(
    (config) => {
        //엑세스 토큰 (AccessToken) Header에 넣어준다.
        const accessToken = localStorage.getItem('accessToken');
        if(accessToken){
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

//응답 인터셉터 (Response Interceptor) - 응답 받은 직후 실행
client.interceptors.response.use(
    (response) => {
        //onFulfilled - 정상응답
        return response.data; //--> 타입 추론을 위해 data를 바로 꺼내서 준다.
    },
    async(error) => {
        const originalRequest = error.config;

        //onRejected - 실패
        if(error.response && error.response.data.code === 'TOKEN_001' && !originalRequest._retry){

            console.error('로그인 필요!');
            try{
                //이미 다른 요청이 재발급 진행중인지 체크한다. (true:재발급 진행중)
                if(isRefreshing){
                    return new Promise((resolve)=>{
                        addRefreshSubscriber((accessToken)=>{
                            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                            resolve(client(originalRequest)); // 새 토큰으로 재요청 후 결과 반환
                        })
                    });
                }

                //내가 처음으로 401을 받았으면 직접 재발급 시작해야함.
                console.error('Refresh Proc...');
                originalRequest._retry = true; // 무한 루프 방지용 플래그 설정(한번만 시도 후 안되면 포기)
                isRefreshing = true;

                const response = await client.post<LoginResponse>('/auth/reissue');
                const newAccessToken = response.accessToken;
                console.log(newAccessToken);

                //재발급 성공!
                localStorage.setItem('accessToken', newAccessToken);
                isRefreshing = false;

                //대기열에 있떤 친구들 모두 실행
                onRefreshed(newAccessToken);

                //내 원래 요청도 새로운 토큰으로 재실행
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return client(originalRequest); //Token 만료 때문에 실패했던 원래 요청을 새 토큰으로 다시 시도한다.
            }catch (refreshError){
                //재발급 조차 실패? (Refresh Token 만료 등) -> 진짜로 로그아웃 후 로그인 페이지로 이동
                console.error('Refresh Error!');
                localStorage.removeItem('accessToken');
                return Promise.reject(refreshError);
            }
        }
        //401이 아니라 다른 에러면 그냥 반환
        return Promise.reject(error);
    }
)

// Axios 인스턴스의 메서드 타입 오버라이딩
// client.get<T>를 호출하면 Promise<T>가 반환된다고 선언합니다.  (기존 : AxiosResponse<T> 반환)
declare module 'axios'{
    export interface AxiosInstance{
        request<T = any>(config: AxiosRequestConfig): Promise<T>;
        get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
        post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    }
}