"use client"

import { UserButton } from "@clerk/nextjs";
import Logo from "../Logo/Logo";
import NavbarItem from "./NavbarItem";
import ThemeSwitcherBtn from "../ThemeSwitcherBtn/ThemeSwitcherBtn";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
    return (
        <>
            <DesktopNavbar />
            <MobileNavbar />
        </>
    );
}

const items = [
    { label: "Dashboard", link: "/" },
    { label: "Transações", link: "/transacoes" },
    { label: "Gerenciar", link: "/gerenciar" }
]

const MobileNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="block border-separate bg-background md:hidden">
            <nav className="flex container items-center justify-between px-7">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px]" side={"left"}>
                        <SheetHeader>
                            <SheetTitle>
                                <Logo />
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col gap-1 pt-4">
                            {items.map((item) => (
                                <NavbarItem
                                    key={item.label}
                                    link={item.link}
                                    label={item.label}
                                    clickCallback={() => setIsOpen(prev => !prev)}
                                />
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="flex h-20 min-h-16 items-center gap-x-4">
                    <Logo />
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitcherBtn />
                    <UserButton afterSignOutUrl="/sign-in" />
                </div>
            </nav>
        </div>
    )
}


const DesktopNavbar = () => {
    return (
        <div className="hidden border-separate border-b bg-background md:block">
            <nav className="flex container items-center justify-between px-8">
                <div className="flex h-20 min-h-16 items-center gap-x-4">
                    <Logo />
                    <div className="flex h-full">
                        {items.map(item => (
                            <NavbarItem key={item.label}
                                link={item.link}
                                label={item.label}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeSwitcherBtn />
                        <UserButton afterSignOutUrl="/sign-in" />
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;