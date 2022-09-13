export const fetcher = async (url: string) => await fetch(url).then((r) => r.json())
