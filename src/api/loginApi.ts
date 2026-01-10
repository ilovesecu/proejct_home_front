import type {LoginRequest} from "../types/login.ts";
import {client} from "./client.ts";

export const loginProc = async ({email, password}:LoginRequest) => {
    const response = await client.post('/login',{email, password});
    return response;
}