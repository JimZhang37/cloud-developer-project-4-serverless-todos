import 'source-map-support/register'
import {parseUserId} from '../auth/utils'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

//const docClient = new AWS.DynamoDB.DocumentClient()

const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE
const todosIndex = process.env.INDEX_NAME

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Processing event: ', event)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken)

  //const validUserId = await userExists(userId)

  // if (!validUserId) {
  //   return {
  //     statusCode: 404,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*'
  //     },
  //     body: JSON.stringify({
  //       error: 'User does not exist'
  //     })
  //   }
  // }
  // const result = await docClient.scan({
  //   TableName: todosTable
  // }).promise()

  // const items = result.Items


  
  const todosOfTheUser = await getTodosPerUser(userId)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todosOfTheUser
    })
  }
  
}

async function getTodosPerUser(userId: string) {
  console.log('Get users todo: ')
  const result = await docClient.query({
    TableName: todosTable,
    IndexName: todosIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  }).promise()

  return result.Items
}

// async function userExists(userId: string) {
//   console.log('Get user Function!', userId)
//   const result = await docClient
//     .get({
//       TableName: todosTable,
//       Key: {
//         userId: userId
//       }
//     })
//     .promise()

//   console.log('Get user: ', result)
//   return !!result.Item
// }