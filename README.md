# Cloudflare JWT Library

A simple library to generate JWT in cloudflare.

There is not much to show off. This package might provide a hint how to do JWT tasks in Cloudflare. You may skip install and copy the codes.

## Description

Those functions are intended to make & verify JWT with given cryptography algorithm.

### getToken
```typescript
export async function getToken<H = Header, P = Payload>(    // (1)
    header: H,                                              // (2)
    payload: P,
    sign: (data: string) => Promise<string>,                // (3)
): Promise<string> {                                        // (4)
    const h = base64UrlEncode(JSON.stringify(header))
    const p = base64UrlEncode(JSON.stringify(payload))
    const part = h + "." + p
    const s = await sign(part)

    return part + "." + s
}
```
1. You can provide custom Header and Payload type.
2. You must set `alg` and other fields manually. There is no autofill.
3. Provide your desired cryptography algorithm.
4. This function returns a complete JWT.

### verifyToken
```typescript
export async function verifyToken<H = Header, P = Payload>(     // (1)
    token: string,                                              // (2)
    verifyPayload: (p: P) => Promise<boolean>,                  // (3)
    signByHeader: (h: H, data: string) => Promise<string>,      // (4)
): Promise<[boolean, P]> {                                      // (5)
    const parts = token.split(".")
    const h: H = JSON.parse(base64UrlDecode(parts[0]))
    const p: P = JSON.parse(base64UrlDecode(parts[1]))

    if (! await verifyPayload(p)) return [false, p]             // (6)

    const s = await signByHeader(h, parts[0] + "." + parts[1])

    return [parts[2] == s, p]
}
```
1. You can provide custom Header and Payload type.
2. Provide JWT directly.
3. Provide a complete payload verification function.
4. Provide a function that reads the Header and generates appropriate signature.
5. This function returns a verification result and the parsed Payload.
6. The payload verfication function will be applied before comparing the signatures.
