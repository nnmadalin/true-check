import Image from "next/image";


export default function Navbar(){
    
    return (
        <nav className="w-full h-[80px] sticky top-0 shadow-[0px_0px_35px_2px_rgba(0,0,0,0.1)] flex items-center gap-3 p-3 overflow-hidden">
            <a href="/dashboard"><Image src="/logo.jpeg" alt="" width={60} height={60} className="rounded"/></a>
            <a href="/dashboard" className="font-firaSans font-bold text-[17px] tracking-wider text-[#193452]">TrueCheck</a>
        </nav>
    )
}