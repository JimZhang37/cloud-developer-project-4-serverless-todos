# serverless_todos

There are two branchs, master and dev.

Master branch is the most stable branch. 
In terms of function, it supports 2 API calls, getTodos and createTodo. It creates a simplifed DynamoDB table with two fields, userId and todoId. It also supports a fake authorization. A custom authorizer is attached to getTodos. When a token with 123 is included in request, the authorizer will grant rights to the caller.


Dev branch tries to implement a real authorizer with RS 256 algorithm, but it still fails.
