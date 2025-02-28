const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE;

const createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
    },
    body: JSON.stringify(body),
  };
};

// 🟢 Create Card
module.exports.createCard = async (event) => {
  const { name, position, image } = JSON.parse(event.body);
  const newCard = { id: uuidv4(), name, position, image };

  await dynamoDB.put({ TableName: TABLE_NAME, Item: newCard }).promise();

  return createResponse(201, newCard);
};

// 🟢 Get All Cards
module.exports.getAllCards = async () => {
  const result = await dynamoDB.scan({ TableName: TABLE_NAME }).promise();

  return createResponse(200, result.Items);
};

// 🔵 Get Card by ID
module.exports.getCard = async (event) => {
  const { id } = event.pathParameters;
  const result = await dynamoDB
    .get({ TableName: TABLE_NAME, Key: { id } })
    .promise();

  if (!result.Item) {
    return createResponse(404, { error: "Card not found" });
  }

  return createResponse(200, result.Item);
};

// 🟡 Update Card
module.exports.updateCard = async (event) => {
  const { id } = event.pathParameters;
  const { name, position, image } = JSON.parse(event.body);

  await dynamoDB
    .update({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: "SET #name = :n, #position = :p, image = :i",
      ExpressionAttributeNames: {
        "#name": "name",
        "#position": "position",
      },
      ExpressionAttributeValues: { ":n": name, ":p": position, ":i": image },
      ReturnValues: "ALL_NEW",
    })
    .promise();

  return createResponse(200, { id, name, position, image });
};

// 🔴 Delete Card
module.exports.deleteCard = async (event) => {
  const { id } = event.pathParameters;

  await dynamoDB.delete({ TableName: TABLE_NAME, Key: { id } }).promise();

  return createResponse(200, { message: "Card deleted" });
};
