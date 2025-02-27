const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE;

// 🟢 Create Card
module.exports.createCard = async (event) => {
  const { name, position, image } = JSON.parse(event.body);
  const newCard = { id: uuidv4(), name, position, image };

  await dynamoDB.put({ TableName: TABLE_NAME, Item: newCard }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(newCard),
  };
};

// 🟢 Get All Cards
module.exports.getAllCards = async () => {
  const result = await dynamoDB.scan({ TableName: TABLE_NAME }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
};

// 🔵 Get Card by ID
module.exports.getCard = async (event) => {
  const { id } = event.pathParameters;
  const result = await dynamoDB
    .get({ TableName: TABLE_NAME, Key: { id } })
    .promise();

  if (!result.Item) {
    return { statusCode: 404, body: JSON.stringify({ error: "Card not found" }) };
  }

  return { statusCode: 200, body: JSON.stringify(result.Item) };
};

// 🟡 Update Card
module.exports.updateCard = async (event) => {
  const { id } = event.pathParameters;
  const { name, position, image } = JSON.parse(event.body);

  await dynamoDB
    .update({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: "set name = :n, position = :p, image = :i",
      ExpressionAttributeValues: { ":n": name, ":p": position, ":i": image },
      ReturnValues: "ALL_NEW",
    })
    .promise();

  return { statusCode: 200, body: JSON.stringify({ id, name, position, image }) };
};

// 🔴 Delete Card
module.exports.deleteCard = async (event) => {
  const { id } = event.pathParameters;

  await dynamoDB.delete({ TableName: TABLE_NAME, Key: { id } }).promise();

  return { statusCode: 200, body: JSON.stringify({ message: "Card deleted" }) };
};
