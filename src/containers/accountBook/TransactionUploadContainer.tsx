import React, {type ChangeEvent, useMemo, useRef, useState} from "react";
import {AlertCircle, CheckCircle2, FileSpreadsheet, Loader2, Upload, X} from "lucide-react";
import {uploadTransactionHistory} from "../../api/accountBookApi.ts";
import type {TransactionUploadResponse} from "../../types/accountBook.ts";

const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"];

const TransactionUploadContainer: React.FC = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<TransactionUploadResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const fileSizeLabel = useMemo(() => {
        if (!file) return "";
        if (file.size < 1024 * 1024) return `${Math.max(1, Math.round(file.size / 1024))} KB`;
        return `${(file.size / 1024 / 1024).toFixed(1)} MB`;
    }, [file]);

    const isAllowedFile = (target: File) => {
        const lowerName = target.name.toLowerCase();
        return ACCEPTED_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
    };

    const selectFile = (target: File | null) => {
        setResult(null);
        setErrorMessage("");

        if (!target) {
            setFile(null);
            return;
        }

        if (!isAllowedFile(target)) {
            setFile(null);
            setErrorMessage("CSV, XLS, XLSX 파일만 업로드할 수 있습니다.");
            return;
        }

        setFile(target);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        selectFile(event.target.files?.[0] ?? null);
        event.target.value = "";
    };

    const handleUpload = async () => {
        if (!file || isUploading) return;

        setIsUploading(true);
        setErrorMessage("");
        setResult(null);

        try {
            const uploadResult = await uploadTransactionHistory(file);
            setResult(uploadResult);
        } catch (error: unknown) {
            setErrorMessage(getUploadErrorMessage(error));
        } finally {
            setIsUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setResult(null);
        setErrorMessage("");
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col gap-3 border-b border-slate-200 pb-6">
                <span className="text-sm font-semibold text-emerald-600">Household Account Book</span>
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-950">거래내역 업로드</h1>
                    <p className="max-w-2xl text-sm leading-6 text-slate-500">
                        토스뱅크 거래내역 파일을 업로드하면 헤더와 메타데이터를 제외하고 DB에 저장합니다.
                    </p>
                </div>
            </header>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
                <div className="space-y-4">
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => inputRef.current?.click()}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
                        }}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(event) => {
                            event.preventDefault();
                            setIsDragging(false);
                            selectFile(event.dataTransfer.files?.[0] ?? null);
                        }}
                        className={[
                            "flex min-h-72 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed px-6 py-10 text-center transition",
                            isDragging
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/40",
                        ].join(" ")}
                    >
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".csv,.xls,.xlsx"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200">
                            <FileSpreadsheet size={30} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-semibold text-slate-900">파일을 선택하거나 여기에 놓으세요</p>
                            <p className="text-sm text-slate-500">토스뱅크 CSV, XLS, XLSX 형식을 지원합니다.</p>
                        </div>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            <Upload size={16} />
                            파일 선택
                        </button>
                    </div>

                    {file && (
                        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                                    <FileSpreadsheet size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                                    <p className="text-xs text-slate-500">{fileSizeLabel}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={clearFile}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                                    aria-label="선택한 파일 제거"
                                    title="선택한 파일 제거"
                                >
                                    <X size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="inline-flex h-10 items-center gap-2 rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                                >
                                    {isUploading ? <Loader2 size={17} className="animate-spin" /> : <Upload size={17} />}
                                    {isUploading ? "업로드 중" : "업로드"}
                                </button>
                            </div>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <p>{errorMessage}</p>
                        </div>
                    )}
                </div>

                <aside className="rounded-lg border border-slate-200 bg-white p-5">
                    <h2 className="text-base font-bold text-slate-900">파싱 기준</h2>
                    <dl className="mt-4 space-y-4 text-sm">
                        <div>
                            <dt className="font-semibold text-slate-700">건너뛰는 행</dt>
                            <dd className="mt-1 text-slate-500">1~8행 메타데이터, 9행 헤더</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-700">데이터 시작</dt>
                            <dd className="mt-1 text-slate-500">10행부터 실제 거래내역으로 저장</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-700">거래 일시</dt>
                            <dd className="mt-1 text-slate-500">yyyy.MM.dd HH:mm:ss</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-700">금액</dt>
                            <dd className="mt-1 text-slate-500">출금은 음수, 입금은 양수 정수</dd>
                        </div>
                    </dl>
                </aside>
            </section>

            {result && (
                <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-emerald-600" />
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg font-bold text-emerald-950">업로드 처리 완료</h2>
                            <p className="mt-1 truncate text-sm text-emerald-700">{result.fileName}</p>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <ResultMetric label="파싱 성공" value={result.parsedCount} />
                        <ResultMetric label="DB 저장" value={result.insertedCount} />
                        <ResultMetric label="파싱 실패" value={result.failedCount} />
                    </div>

                    {result.errors?.length > 0 && (
                        <div className="mt-5 rounded-lg border border-amber-200 bg-white p-4">
                            <h3 className="text-sm font-bold text-amber-800">확인이 필요한 행</h3>
                            <ul className="mt-3 max-h-56 space-y-2 overflow-auto text-sm text-slate-600">
                                {result.errors.map((item) => (
                                    <li key={`${item.rowNumber}-${item.message}`} className="rounded-md bg-amber-50 px-3 py-2">
                                        <span className="font-semibold text-amber-900">{item.rowNumber}행</span>
                                        <span className="mx-2 text-amber-300">|</span>
                                        {item.message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

const getUploadErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null) {
        const maybeError = error as {
            message?: string;
            response?: {
                data?: {
                    message?: string;
                };
            };
        };
        return maybeError.response?.data?.message || maybeError.message || "거래내역 업로드에 실패했습니다.";
    }

    return "거래내역 업로드에 실패했습니다.";
};

interface ResultMetricProps {
    label: string;
    value: number;
}

const ResultMetric: React.FC<ResultMetricProps> = ({label, value}) => (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-emerald-100">
        <p className="text-xs font-semibold uppercase text-emerald-600">{label}</p>
        <p className="mt-2 text-2xl font-bold text-slate-950">{value.toLocaleString()}건</p>
    </div>
);

export default TransactionUploadContainer;
