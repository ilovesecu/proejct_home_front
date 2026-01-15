import type {DefaultPopupLayoutProps} from "../../types/popup.ts";

const DefaultPopLayout:React.FC<DefaultPopupLayoutProps> = ({
    type = 'alert',
    onCancel,
    onConfirm,
    message,
    title
}) => {
    return (
        <div className="text-center">
            {title && (
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {title}
                </h3>
            )}

            <div className="mb-6 text-gray-600 whitespace-pre-wrap">
                {message}
            </div>

            <div className="flex justify-center gap-3">
                {type === 'confirm' && (
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        취소
                    </button>
                )}
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                    확인
                </button>
            </div>
        </div>
    )
}
export default DefaultPopLayout;