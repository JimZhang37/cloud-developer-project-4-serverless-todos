import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'
const docClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const userId = parseUserId(jwtToken)
  
  const parsedBody: CreateTodoRequest = JSON.parse(event.body)
  console.log('parsedBody from CreateTodo request', parsedBody)
  const itemId = uuid.v4()

  const NewItem = {
    
    userId,
    todoId: itemId,
    ...parsedBody
  }
  const item = {
    todoId: itemId,
    ...parsedBody
  }
  console.log('new Item for createTodo', NewItem)

  await docClient.put({
    TableName: todosTable,
    Item: NewItem
  }).promise()

  // TODO: Implement creating a new TODO item
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item
    })
  }
}
