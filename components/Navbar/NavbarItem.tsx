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
        <div className="relative flex items-center">
            <Link className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start text-muted-foreground hover:text-foreground", isActive && "text-foreground")} href={link} onClick={() => {
                if (clickCallback) {
                    clickCallback();
                }
            }}>
                {label}
            </Link>
            {isActive && (
                <div className="absloute bottom-0.5 left-1/2 hidden h-0.5 w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block"></div>
            )}
        </div>
    )
}

export default NavbarItem;