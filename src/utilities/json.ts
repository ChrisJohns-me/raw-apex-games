export function JSONTryParse<T = AnyObject>(text?: string): T | undefined {
    if (!text || !text.length) return undefined;
    try {
        return JSON.parse(text) as T;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
