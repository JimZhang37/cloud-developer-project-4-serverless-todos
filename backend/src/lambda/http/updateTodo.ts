import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import {parseUserId} from '../auth/utils'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //const todoId = event.pathParameters.todoId
  //const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  console.log("event is", event)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const parsedBody: UpdateTodoRequest = JSON.parse(event.body)
  const todoId = event.pathParameters.todoId

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const uId = parseUserId(jwtToken)



  const param = {
    TableName: todosTable,
    Key: {
      userId: uId,
      todoId: todoId
    },
    UpdateExpression: "set dueDate = :dueDate, done = :done",

    ExpressionAttributeValues: {
        ":dueDate": parsedBody.dueDate,
        ":done": parsedBody.done,

    }
  }
  const result = await docClient.update( param
  ).promise()

  console.log('the result of update is ', result)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ""
  }
}
