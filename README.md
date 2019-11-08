# Serverless_todos

# Introduction

## Folders
* backend <br>

* client <br>
A simple react app
* images <br>

* screenshots <br>
screenshots taken from AWS console and terminal after the serverless successfully built a stack.
## Branches
There are two branchs, master and dev.

Master branch is the most stable branch. 
In terms of function, it supports 2 API calls, getTodos and createTodo. It creates a simplifed DynamoDB table with two fields, userId and todoId. It also supports a fake authorization. A custom authorizer is attached to getTodos. When a token of 123 is included in request, the authorizer will grant rights to the caller.


Dev branch tries to implement a real authorizer with RS 256 algorithm, but it still fails. Additionally, currently the dynamodb can't extend its field from 2 to more. If I change instructions about dynamodb in serverless.yml, the the sls deploy process fails, indicating inconsistency between attributes and schema..
## Related topics
* Backend <br> 
Nodejs, promise, aws sdk for nodejs, dynamodb, s3 
* Image related library <br> 
like jimp, to manipulate images
* Frontend framework <br> 
React
* Automation <br> 
sls

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend
### How to setup Auth0

### How to setup client

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.
## Challenges
* It's hard to test in serverless environment. I firstly have to run sls deploy to upload my code to cloud and then read cloudwatch log stream to find any clues. Are there any method to alliviate the effort?
* If I skip some videos from the course, it will become hard. For example, the configuration of auth0 is described in the exerse instruction, but I started to run my client before I read it. 
* SLS's document is bad. I need to know how to get log, but I still couldn't find how.
* I can create table with local secondary index now, but I don't know which key can be a good candidate for local secondary index.


## Remaining issues

* how to add image url? option 1, in get presigned url, I update the related field as well. option 2, once the image object is uploaded, s3's event trigers an action to add image url.
* a few best practise, for example, ports and adaptor, log, deployment, etc.
* in client, create a todo, delete it and then create again with the same name, then a error occurs. The CreateTodo API received a request with name = ''. I think this is client's problem. If user don't key in the todo name again, it just put name = '' in the request. But why dynamodb fails to this value?






## Finished Tasks
1) correct custom authorizer//public key moved from serverless.yml to auth*.ts
2) modify getTodos to return current user's todo only.
3) modify createTodo to create todo for current user.
4) extend dynamoDB to include more fields. ??why we need local secondary index??
5) add requestValidator at API Gateway, including models, API request validator and associate them with API method.
6) integrate with client to see if the interface is correct. Do we need to return userId in response?
7 To understand when the getImageURL is called and how to do it.
8) implement other functions: delete, modify Todos.
9) updatetodo is not working. The dynamodb document's API is not returning expected result.

