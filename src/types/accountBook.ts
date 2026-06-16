export interface TransactionParseError {
    rowNumber: number;
    message: string;
}

export interface TransactionUploadResponse {
    fileName: string;
    parsedCount: number;
    insertedCount: number;
    failedCount: number;
    errors: TransactionParseError[];
}
