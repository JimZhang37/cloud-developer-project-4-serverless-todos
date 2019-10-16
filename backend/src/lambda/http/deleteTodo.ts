import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import {parseUserId} from '../auth/utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const uId = parseUserId(jwtToken)

  const item = {
    userId: uId,
    todoId: todoId
  }

  const result = await docClient.delete({
    TableName: todosTable,
    Key: item
  }).promise()

  console.log('result of a delete operation',result)
  // TODO: Remove a TODO item by id
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ""
  }
}

