/**
 * A payload of a JWT token
 */
export interface JwtToken {

  iss: string
  sub: string
  aud: number
  exp: number
  at_hash: string
  nonce:string
  
}
