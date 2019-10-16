import { CustomAuthorizerEvent, CustomAuthorizerResult, CustomAuthorizerHandler } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import {JwtToken} from '../../auth/JwtPayload'


const cert = `-----BEGIN CERTIFICATE-----
MIIDBTCCAe2gAwIBAgIJBA/Md6StcerVMA0GCSqGSIb3DQEBCwUAMCAxHjAcBgNV
BAMTFXpoYW5neWFvaHVhLmF1dGgwLmNvbTAeFw0xOTEwMTUwNTA4MDRaFw0zMzA2
MjMwNTA4MDRaMCAxHjAcBgNVBAMTFXpoYW5neWFvaHVhLmF1dGgwLmNvbTCCASIw
DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM8fOMGkuyYuZQa7Ui0KumfKbC5D
Trjd4zZtS3j+O7m7jtjzcS9filqTuXzL3knF9gT4Bv2Lx/xGa9pvtRG0RwmV3L2u
wh6XnOUGMJM83RJPyJT/YwMWzWPAxXFnElIpFm/oF4hXu5CjKWuazSJ0bUiCNV5V
B1sugVMWFWQll8VA2DTZBMX8aQKNpSR/pomsMGUm/nmLAMNrU8LoOsET13XA8A9O
5Va+o5d8g3GxxYyYfZxQy0HbZWgsiXTli8rL4OGx3Bm+xtrj1K6U0C1iW1+q3NrH
XcaIkDHGNLJk6+BwMF4CAVPi836xmAcvTnVgr8u8PX3clxWE2u5VvyoeSYMCAwEA
AaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUyhCCoUy7iw42AU9cFO/r
Vib7Q70wDgYDVR0PAQH/BAQDAgKEMA0GCSqGSIb3DQEBCwUAA4IBAQCByemKd8bC
RJlWxVpqW2xxpX08bmov3WTRN3Ldd811euPojz4smTuVVfk0SyWyIRByhOpEFLTj
S7UTySGyC/twTyhnsLy+KVsp5kwwhzNDUxrParq9M+VEa2za/8SfUop9q3m+UCCl
94jCa+TtGesZb6GfYyp82Vsak5pGDf9YKgMRYxEX7qUJoGVPXwh5dXFF4j0xqhjx
woWVGK2VUJ8apdvQNhaOyWE11ypFzjhBwVqum5HV74wy/WJ+ax/zgtUyXcG9Hevc
9TuFltD9hHA1+VyF/19n0hWRzDDeSp03u1wKszEYpMSll71aiACyaXAEhkWf6cFK
ttaxKN9NCKEQ
-----END CERTIFICATE-----`
export const handler: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    console.log('We are going to start authorization')
    console.log('certificate is: ', cert)
    const decodedToken = verifyToken(
      event.authorizationToken
    )
    console.log('User was authorized')

    return {
      principalId: decodedToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User was not authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string) :JwtToken{
  if (!authHeader)
    throw new Error('No authentication header')
  console.log('authHeader is the following string: ', authHeader)
  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]
  console.log("token is", token)
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken

}

