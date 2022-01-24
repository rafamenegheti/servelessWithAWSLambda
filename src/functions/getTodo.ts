import { APIGatewayProxyHandler } from "aws-lambda";



import { dynamoClient } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler =
    async (event) => {

        const { id } = event.pathParameters;


        try {
            const todo = await dynamoClient.query({
                TableName: "todosTable",
                KeyConditionExpression: "id = :id",
                ExpressionAttributeValues: {
                    ":id": id,
                },
            }).promise();

            if (!todo) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: "Todo not found"
                    })
                };
            }

            return {
                statusCode: 200,
                body: JSON.stringify({
                    todo
                })
            };

        } catch (err) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: err.message
                }),
                headers: {
                    "Content-type": "application/json",
                },
            };
        }




    }  