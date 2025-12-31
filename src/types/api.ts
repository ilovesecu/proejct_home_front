export interface ApiResponse<T = unknown>{
    status : "SUCCESS" | "FAIL" | "ERROR";
    message: string;
    code : string; //에러코드 (AUTH_001, LOGIN_FAIL_PWD 등), 성공코드 (200, 201 등등)
    data: T;
}