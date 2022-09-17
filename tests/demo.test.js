const method = require('@or13/did-jwk')

let k

describe('countess-ada accessibility credential demo', () => {
  it('key generation', async () => {
    // k = await method.generateKeyPair('ES256')
    k = {
      publicKeyJwk: {
        kid: 'urn:ietf:params:oauth:jwk-thumbprint:sha-256:1MELFccN3bm8o3g7rpWKlOI5xphtiCJW3H5Fet-7vcQ',
        kty: 'EC',
        crv: 'P-256',
        alg: 'ES256',
        x: 'H02QiAQaokpw1AC6ep6LEcl2TULwiOD1FUBfZmds4os',
        y: 'mbp_9Kd2D1qIqAoVwqtx4kuWY0DA945mVioGCdDvMgU',
      },
      privateKeyJwk: {
        kid: 'urn:ietf:params:oauth:jwk-thumbprint:sha-256:1MELFccN3bm8o3g7rpWKlOI5xphtiCJW3H5Fet-7vcQ',
        kty: 'EC',
        crv: 'P-256',
        alg: 'ES256',
        x: 'H02QiAQaokpw1AC6ep6LEcl2TULwiOD1FUBfZmds4os',
        y: 'mbp_9Kd2D1qIqAoVwqtx4kuWY0DA945mVioGCdDvMgU',
        d: '9JrNHQfA2FmTdwuxV0Ft1DbeM9eO8LGqsNeal4v0ncM',
      },
    }
  })

  it('can sign and verify', async () => {
    const m = Buffer.from(JSON.stringify({ issuer: '', credentialSubject: '' }))
    const jws = await method.signAsDid(m, k.privateKeyJwk)
    const v = await method.verifyWithKey(jws, k.publicKeyJwk)
    expect(v.protectedHeader.alg).toBe(k.publicKeyJwk.alg)
  })

  let vc
  it('can issue accessibility credential', async () => {
    const m = Buffer.from(
      JSON.stringify({
        vc: {
          '@context': [
            // 'https://www.w3.org/ns/credentials/v2',
            {
              '@version': 1.1,
              id: '@id',
              type: '@type',
              '@vocab': 'https://www.w3.org/ns/credentials#',
              credentialSubject: {
                '@type': '@id',
              },
            },
          ],
          id: 'urn:uuid:e4390388-e819-4f18-b257-3a11841dbc00',
          type: ['VerifiableCredential', 'ADA-Accessibility-Preferences'],
          issuer: k.publicKeyJwk.kid,
          issuanceDate: '2010-01-01T19:23:24Z',
          credentialSubject: {
            id: k.publicKeyJwk.kid,
            style: `p { font-size: 150% !important; }`,
          },
        },
      })
    )
    jws = await method.signAsDid(m, k.privateKeyJwk)
    console.log(`https://lucid.did.cards/credentials/${jws}`)
    const v = await method.verifyWithKey(jws, k.publicKeyJwk)
    expect(v.protectedHeader.alg).toBe(k.publicKeyJwk.alg)
    ;({ vc } = JSON.parse(v.payload.toString()))
    // console.log(JSON.stringify(vc, null, 2))
  })

  //  run this in developer console on a web page you trust, that contains at least 1 p tag.
  it('can inject style tag from credential', () => {
    console.log(`
Open https://en.wikipedia.org/wiki/Americans_with_Disabilities_Act_of_1990, and past this script into developer console:


;(() => {
const vc = ${JSON.stringify(vc, null, 2)}
const style = document.createElement('style')
style.appendChild(document.createTextNode(vc.credentialSubject.style))
document.getElementsByTagName('head')[0].appendChild(style)
})()
    `)
  })
})
