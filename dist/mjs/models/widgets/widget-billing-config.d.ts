import { BaseWidgetConfig } from './shared.js';
export declare const WidgetBillingConfigVersion = "1";
export declare class WidgetBillingConfig extends BaseWidgetConfig {
    counters: BillingCounterEntry[];
    currencyCode: string;
    constructor();
}
export interface BillingCounterEntry {
    signalId: string;
    mwst: {
        type: string;
        signalId: string;
        value: number;
    };
    rate: {
        type: string;
        signalId: string;
        value: number;
    };
}
export interface BillingDatasourceEntry {
    description: string;
    amount: number;
    amountUnit: string;
    mwst: number;
    rate: number;
    decimals?: number;
}
export declare enum SelectionType {
    SIGNAL = "signal",
    VALUE = "value"
}
export interface CurrencyCode {
    symbol: string;
    name: string;
    symbol_native: string;
    decimal_digits: number;
    rounding: number;
    code: string;
    name_plural: string;
}
export declare const CURRENCY_CODES: {
    [key: string]: CurrencyCode;
}[];
