import { APIGatewayEvent } from 'aws-lambda';

export function getUser(event: APIGatewayEvent) {
    console.log(event)
    console.log(event.requestContext)
    console.log(event.requestContext.authorizer)
    const { requestContext } = event;
    const authorizer = (requestContext.authorizer) ? requestContext.authorizer : null;

    if (authorizer != undefined || authorizer != null)
        return JSON.parse(authorizer.payload as string).user;
}
