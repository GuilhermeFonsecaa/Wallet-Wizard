import { Coins, Wallet } from "lucide-react"

const Logo = () => {
    return (
        <a href="/" className="flex items-center gap-2">
            <Wallet className="stroke h-10 w-10 stroke-violet-400 stroke-[1.5]" />
            <p className="bg-gradient-to-r from-violet-400 to-orange-400 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">WalletWizard</p>
        </a>
    );
}

export default Logo;
