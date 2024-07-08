import { Currencies } from "./currency"

export const DateToUTCDate = (date: Date) => {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        )
    )
}

export const GetFormatterForCurrency = (currency: string) => {
    const locale = Currencies.find(c => c.value === currency)?.locale; //acessar propriedade locale do currency

    //formatar número de acordo com a localidade
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency
    })
}