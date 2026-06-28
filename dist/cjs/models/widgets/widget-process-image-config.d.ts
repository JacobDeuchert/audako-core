import { BaseWidgetConfig } from './shared.js';
export declare const WidgetProcessImageConfigVersion = "3";
export declare class WidgetProcessImageConfig extends BaseWidgetConfig {
    processImageId: string;
    backgroundColor: string;
    basetag: string;
    crossTabs: boolean;
    mode: CrossTabMode;
    transferToken: string;
    preloadImages: boolean;
    constructor();
}
export declare enum CrossTabMode {
    Send = "Send",
    Receive = "Receive"
}
