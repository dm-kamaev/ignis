export declare const getById: (id: any) => HTMLElement;
export declare function addCss(code: string, file_url?: string): void;
export declare function getTarget(e: any): any;
export declare function debounce(cb: (...arg: any) => any, ms: number): () => void;
export declare const get_uid: (len?: number) => string;
/**
 * function for add js, css or link to head
 * @param content {string}
 */
export declare function addToHead(content: string): void;
export declare function createFakeEvent(eventName: string, target: HTMLElement): Event;
export declare const logger: (...arg: any[]) => void;
