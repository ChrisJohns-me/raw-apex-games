export function JSONTryParse<T = AnyObject>(text?: string): T | undefined {
    if (!text || !text.length) return undefined;
    try {
        return JSON.parse(text);
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
