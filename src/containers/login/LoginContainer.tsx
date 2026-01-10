import LoginComponent from "../../components/login/LoginComponent.tsx";
import {type FormEvent, useState} from "react";
import {loginProc} from "../../api/loginApi.ts";
import {useNavigate} from "react-router-dom";

const LoginContainer = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e:FormEvent) => {
        e.preventDefault();
        const response = await loginProc({email, password});
        const accessToken = response.accessToken;

        //토큰 LocalStorage 저장
        localStorage.setItem('accessToken', accessToken);
        console.log(accessToken);
        navigate('/');

        return ;
    }

    return (
        <LoginComponent handleLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword}/>
    )
}

export default LoginContainer;