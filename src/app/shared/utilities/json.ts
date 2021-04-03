export function JSONTryParse<T = AnyObject>(text?: string, onError?: (err?: any) => void): Optional<T> {
    if (!text || !text.length) return undefined;
    try {
        return JSON.parse(text) as T;
    } catch (error) {
        if (typeof onError === "function") onError(error);
        return undefined;
    }
}
