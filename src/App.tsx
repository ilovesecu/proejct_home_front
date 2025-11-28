import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

    return (
        // Tailwind 클래스 적용: 배경색 빨강, 텍스트 큼, 폰트 굵게, 글자색 흰색
        <div className="bg-red-500 text-3xl font-bold text-white p-10">
            Tailwind CSS 설치 성공! 🎉
        </div>
    )
}

export default App
