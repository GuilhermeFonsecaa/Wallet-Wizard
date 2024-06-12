import { Wallet } from "lucide-react"

const Logo = () => {
    return (
        <>
            <LogoDesktop />
            <LogoMobile />
        </>
    )
}

const LogoDesktop = () => {
    return (
        <div className="hidden md:block">
            <a href="/" className="flex items-center gap-2 ">
                <Wallet className="stroke h-9 w-9 stroke-violet-400 stroke-[1.5]" />
                <p className="bg-gradient-to-r from-violet-400 to-orange-400 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">WalletWizard</p>
            </a>
        </div>
    );
}

const LogoMobile = () => {
    return (
        <a href="/" className="flex items-center gap-2 md:hidden">
            <p className="bg-gradient-to-r from-violet-400 to-orange-400 bg-clip-text text-[27px] font-bold leading-tight tracking-tighter text-transparent">WalletWizard</p>
        </a>
    )
}

export default Logo;


