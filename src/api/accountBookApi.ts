import type {ApiResponse} from "../types/api.ts";
import type {TransactionUploadResponse} from "../types/accountBook.ts";
import {client} from "./client.ts";

export const uploadTransactionHistory = async (file: File): Promise<TransactionUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await client.post<ApiResponse<TransactionUploadResponse>>(
        "/account-book/transactions/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            timeout: 60000,
        },
    );

    return response.data;
};
