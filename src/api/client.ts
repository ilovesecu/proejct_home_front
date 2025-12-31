import axios, {type AxiosInstance, type AxiosRequestConfig} from "axios";

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

)

//응답 인터셉터 (Response Interceptor) - 응답 받은 직후 실행
client.interceptors.response.use(
    (response) => {
        //onFulfilled - 정상응답
        return response.data; //--> 타입 추론을 위해 data를 바로 꺼내서 준다.
    },
    async(error) => {
        //onRejected - 실패
        if(error.response && error.response.status === 401){
            console.error('로그인이 필요합니다.');
        }
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