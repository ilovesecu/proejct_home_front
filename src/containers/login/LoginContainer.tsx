import LoginComponent from "../../components/login/LoginComponent.tsx";
import {type FormEvent, useState} from "react";
import {loginProc} from "../../api/loginApi.ts";

const LoginContainer = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async (e:FormEvent) => {
        e.preventDefault();
        const response = await loginProc({email, password});
        console.log(response);
        return ;
    }

    return (
        <LoginComponent handleLogin={handleLogin} email={email} setEmail={setEmail} password={password} setPassword={setPassword}/>
    )
}

export default LoginContainer;