# serverless_todos

There are two branchs, master and dev.

Master branch is the most stable branch. 
In terms of function, it supports 2 API calls, getTodos and createTodo. It creates a simplifed DynamoDB table with two fields, userId and todoId. It also supports a fake authorization. A custom authorizer is attached to getTodos. When a token of 123 is included in request, the authorizer will grant rights to the caller.


Dev branch tries to implement a real authorizer with RS 256 algorithm, but it still fails. Additionally, currently the dynamodb can't extend its field from 2 to more. If I change instructions about dynamodb in serverless.yml, the the sls deploy process fails.

My objective:
1) correct customer authorizer
2) modify getTodos to return current user's todo only.
3) modify createTodo to create todo for current user.
4) extend dynamoDB to include more fields. ??why we need local secondary index??
