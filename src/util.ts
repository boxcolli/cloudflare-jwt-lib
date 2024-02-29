export function encode(str: string): string {
    return base64ToBase64Url(
        stringToBase64(str)
    )
}

export function decode(base64Url: string): string {
    return base64ToString(
        base64UrlToBase64(base64Url)
    )
}

function base64ToBase64Url(base64: string): string {
    return base64
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
}

function base64UrlToBase64(base64Url: string): string {
    const pad = 4 - base64Url.length % 4
    return base64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        + "=".repeat((pad == 4) ? 0 : pad)
}

function stringToBase64(s: string): string {
    return btoa(s)
}

function base64ToString(base64: string): string {
    return atob(base64)
}
