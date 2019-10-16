# serverless_todos

There are two branchs, master and dev.

Master branch is the most stable branch. 
In terms of function, it supports 2 API calls, getTodos and createTodo. It creates a simplifed DynamoDB table with two fields, userId and todoId. It also supports a fake authorization. A custom authorizer is attached to getTodos. When a token of 123 is included in request, the authorizer will grant rights to the caller.


Dev branch tries to implement a real authorizer with RS 256 algorithm, but it still fails. Additionally, currently the dynamodb can't extend its field from 2 to more. If I change instructions about dynamodb in serverless.yml, the the sls deploy process fails, indicating inconsistency between attributes and schema.

My objective:

2) modify getTodos to return current user's todo only.
3) modify createTodo to create todo for current user.
4) extend dynamoDB to include more fields. ??why we need local secondary index??
5) add requestValidator at API Gateway, including models, API request validator and associate them with API method.

Finished Tasks:
1) correct custom authorizer

Challenges:
1) it's hard to test in serverless environment. I firstly have to run sls deploy to upload my code to cloud and then read cloudwatch log stream to find any clues. Are there any method to alliviate the effort?
2) if I skip some videos from the course, it will become hard. For example, the configuration of auth0 is described in the exerse instruction, but I started to run my client before I read it. 
3) SLS's document is bad. I need to know how to get log, but I still couldn't find how.
4) I can create table with local secondary index now, but I don't know which key can be a good candidate for local secondary index.
