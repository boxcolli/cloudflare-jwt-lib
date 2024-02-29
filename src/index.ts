import { encode, decode } from "./util";

export interface Header {
    typ?: string
    cty?: string
    alg?: string
    kid?: string
}

export interface Payload {
    iss?: string
    sub?: string
    aud?: string | string[]
    exp?: number
    nbf?: number
    iat?: number
    jti?: string
}

export async function getToken<H = Header, P = Payload>(
    header: H,
    payload: P,
    sign: (data: string) => Promise<string>,
): Promise<string> {
    const h = encode(JSON.stringify(header))
    const p = encode(JSON.stringify(payload))
    const part = h + "." + p
    const s = await sign(part)

    return part + "." + s
}

export async function verifyToken<H = Header, P = Payload>(
    token: string,
    verifyPayload: (p: P) => Promise<boolean>,
    signByHeader: (h: H, data: string) => Promise<string>,
): Promise<[boolean, P]> {
    const parts = token.split(".")
    const h: H = JSON.parse(decode(parts[0]))
    const p: P = JSON.parse(decode(parts[1]))

    if (! await verifyPayload(p)) return [false, p]

    const s = await signByHeader(h, parts[0] + "." + parts[1])

    return [parts[2] == s, p]
}
