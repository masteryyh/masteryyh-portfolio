type FetchJsonOptions = {
    signal?: AbortSignal;
    headers?: HeadersInit;
};

export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}): Promise<T> {
    const res = await fetch(url, {
        headers: {
            Accept: "application/json",
            ...options.headers,
        },
        signal: options.signal,
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as T;
}
