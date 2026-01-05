export interface SubMenuItem{
    id:number;
    title:string;
    contentName:string;
    badge?:string;
    link:string;
}

export interface MenuItem{
    id:number;
    title:string;
    contentName:string;
    badge?:string; // 'N' 또는 숫자 표시용
    link: string;
    iconName?: string; // lucide-react 아이콘 이름 등
    subMenu?: SubMenuItem[];
}