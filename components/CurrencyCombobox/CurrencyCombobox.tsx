"use client"

import * as React from "react"

import { useMediaQuery } from "../../hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Currencies, Currency } from "@/lib/currency"
import { useMutation, useQuery } from "@tanstack/react-query"
import SkeletonWrapper from "../SkeletonWrapper/SkeletonWrapper"
import { UserSettings } from "@prisma/client"
import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings"
import { toast } from "sonner"


export function CurrencyCombobox() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
        null
    )
    const userSettings = useQuery<UserSettings>({
        queryKey: ["userSettings"],
        queryFn: () => fetch("/api/user-settings").then((res) => res.json())
    })

    const mutation = useMutation({
        mutationFn: UpdateUserCurrency,
        onSuccess: (data: UserSettings) => {
            toast.success("Moeda principal atualizada com sucesso 🎉", {
                id: "update-currency"
            });
            setSelectedOption(
                Currencies.find((currency) => currency.value === data.currency) || null
            );
        },

        onError: (e) => {
            console.log(e)
            toast.error("Ocorreu um erro ao atualizar sua moeda principal, tente novamente!", {
                id: "update-currency"
            })
        }
    });

    //Não criar uma nova instância dessa função toda vez que o componente renderiza, manter memorizada até que mutation mude(atualização da currency)
    const selectOption = React.useCallback((currency: Currency | null) => {
        if (!currency) {
            toast.error("Por favor, selecione sua moeda principal")
            return;
        }

        toast.loading("Atualizando sua moeda principal...", {
            id: "update-currency"
        })
        console.log(currency.value)
        mutation.mutate(currency.value)
    }, [mutation])

    React.useEffect(() => {
        if (!userSettings.data) {
            return;
        }
        const userCurrency = Currencies.find((currency) => currency.value === userSettings.data.currency);
        if (userCurrency) {
            setSelectedOption(userCurrency);
        }
    }, [userSettings.data])

    if (isDesktop) {
        return (
            <SkeletonWrapper isLoading={userSettings.isFetching}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
                            {selectedOption ? <>{selectedOption.label}</> : <>+ Definir moeda</>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
                    </PopoverContent>
                </Popover>
            </SkeletonWrapper>
        )
    }

    return (
        <SkeletonWrapper isLoading={userSettings.isFetching}>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full justify-start" disabled={mutation.isPending}>
                        {selectedOption ? <>{selectedOption.label}</> : <>+ Definir moeda</>}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mt-4 border-t">
                        <OptionList setOpen={setOpen} setSelectedOption={selectOption} />
                    </div>
                </DrawerContent>
            </Drawer>
        </SkeletonWrapper>
    )
}

function OptionList({
    setOpen,
    setSelectedOption,
}: {
    setOpen: (open: boolean) => void
    setSelectedOption: (status: Currency | null) => void
}) {
    return (
        <Command>
            <CommandInput placeholder="Filtrar moeda..." />
            <CommandList>
                <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                <CommandGroup>
                    {Currencies.map((currency: Currency) => (
                        <CommandItem
                            key={currency.value}
                            value={currency.label}
                            onSelect={(value) => {
                                setSelectedOption(
                                    Currencies.find((priority) => priority.label === value) || null
                                )
                                setOpen(false)
                            }}
                        >
                            {currency.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
