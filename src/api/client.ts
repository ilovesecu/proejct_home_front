import axios, {type AxiosInstance, type AxiosRequestConfig} from "axios";
import type {LoginResponse} from "../types/login.ts";

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
        // TODO accessToken 만료 코드 정하기
        if(error.response && error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true; // 무한 루프 방지용 플래그 설정(한번만 시도 후 안되면 포기)
            console.error('로그인 필요!');
            try{
                console.error('Refresh Proc...');
                const response = await client.post<LoginResponse>('/auth/reissue');
                const newAccessToken = response.accessToken;
                console.log(newAccessToken);

                localStorage.setItem('accessToken', newAccessToken);
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