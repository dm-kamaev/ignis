export {};
declare global {
    namespace jest {
        interface Matchers<R> {
            equal_content(content: string): R;
        }
    }
}
