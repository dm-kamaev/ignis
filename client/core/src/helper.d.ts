export declare const getById: (id: any) => HTMLElement;
export declare function addCss(code: string, file_url?: string): void;
export declare function getTarget(e: any): any;
export declare function debounce(cb: (...arg: any) => any, ms: number): () => void;
export declare const get_uid: (len?: number) => string;
export declare function parser_delay(input_number: string, input_measure: string, el: string): {
    delay: number;
    measure: "s" | "ms" | "m";
};
export declare const logger: (...arg: any[]) => void;
