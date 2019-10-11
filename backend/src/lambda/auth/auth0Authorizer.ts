import { CustomAuthorizerEvent, CustomAuthorizerResult, CustomAuthorizerHandler } from 'aws-lambda'
import 'source-map-support/register'
import {verify} from 'jsonwebtoken'
import {JwtToken} from '../../../auth/JwtPayload'

const auth0secret = process.env.AUTH_0_SECRET

export const handler: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    console.log('We are going to start authorization')
    console.log('certificate is: ', auth0secret)
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
  return verify(token, auth0secret, { algorithms: ['RS256'] }) as JwtToken
}

