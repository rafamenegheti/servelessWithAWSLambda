import { APIGatewayProxyHandler } from "aws-lambda";
interface ICreateTodo {
    title: string,
    deadline: Date
}


import { dynamoClient } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler =
    async (event) => {
        const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
        const { id: user_id } = event.pathParameters;

        const id = Math.round((Math.random() * 1000)).toString() //example purpose

        const values = {
            TableName: "todosTable",
            Item: {
                id,
                user_id,
                title,
                done: false,
                deadline,
            },
        }

        try {
            await dynamoClient.put(
                values
            ).promise();
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

        return {
            statusCode: 201,
            body: JSON.stringify({
                message: "Todo created!",
            })
        };
    }  