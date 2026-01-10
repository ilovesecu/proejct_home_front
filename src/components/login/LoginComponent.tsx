import type {Dispatch, FormEvent, SetStateAction} from "react";

interface LoginProps {
    email:string;
    setEmail:Dispatch<SetStateAction<string>>;
    password:string;
    setPassword:Dispatch<SetStateAction<string>>;
    handleLogin:(e:FormEvent) => void;
}

const LoginComponent = ({email, setEmail, password, setPassword, handleLogin}:LoginProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">로그인</h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">이메일 주소</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:offset-2 focus:ring-indigo-500"
                    >
                        로그인하기
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    계정이 없으신가요?{' '}
                    <button onClick={() => {}} className="font-medium text-indigo-600 hover:text-indigo-500">
                        회원가입
                    </button>
                </p>
            </div>
        </div>
    );
}

export default LoginComponent;