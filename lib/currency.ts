export const Currencies = [
    {value: "BRL", label: "R$ Real", locale:"br-BR"},
    {value: "USD", label: "$ Dólar", locale:"en-US"},
    {value: "EUR", label: "€ Euro", locale:"de-DE"},
    {value: "JPY", label: "¥ Yen", locale:"ja-JP"},
    {value: "GBP", label: "£ Pound", locale:"en-GB"},
]

export type Currency = (typeof Currencies)[0];