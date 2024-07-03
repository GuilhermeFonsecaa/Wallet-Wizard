import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

interface NavbarItemProps {
    link: string,
    label: string
    clickCallback?: () => void
}

const NavbarItem = ({ link, label, clickCallback }: NavbarItemProps) => {
    const pathName = usePathname();
    const isActive = pathName === link;

    return (
        <div className="relative flex items-center h-full">
            <Link className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start text-muted-foreground hover:text-foreground text-lg p-5", isActive && "text-foreground")} href={link} onClick={() => {
                if (clickCallback) {
                    clickCallback();
                }
            }}>
                {label}
            </Link>
            {isActive && (
                 <div className="absolute top-[58px] left-1/2 transform -translate-x-1/2 h-0.5 w-[80%] rounded-xl bg-foreground md:block">
                </div>
            )}
        </div>
    )
}

export default NavbarItem;