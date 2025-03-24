const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const TableName = process.env.DYNAMODB_TABLE_NAME;
const AwsRegion = process.env.AWS_REGION || "us-west-1";

const client = new DynamoDBClient({ region: `${AwsRegion}`});
const documentClient = DynamoDBDocumentClient.from(client);

/**
 * YugiohDeckBuilder Object Model
 * identifier : String, primary key, format DECK{uuidstring} or USER{uuidstring}
 * username : String
 * password : String
 * email : String
 * deck_owner : String, points to username
 * deck_name : String
 * main_deck : list, max length 60
 * side_deck : list, max length 15
 * extra_deck : list, max length 15
 * notes: String
 * 
 * GSI's (partition/sort key)
 * deck_owner-deck_name-index : deck_owner/deck_name
 * username-email-index : username/email
 * email-username-index : email/username
 */

async function getUserByUsername(username) {
    const command = new QueryCommand({
        TableName,
        IndexName: "username-email-index",
        KeyConditionExpression: "#username = :username",
        ExpressionAttributeNames: {
            "#username" : "username",
        },
        ExpressionAttributeValues: { 
            ":username" : { S: username },
        }
    });

    try {
        const response = await documentClient.send(command);
        return response.Items[0] || null;

    } catch (err) {
        console.error("Error retrieving user by username: ", err);
        throw { status: 500, message: "Error retrieving user by username" };
    }
}

async function getUserByEmail(email) {
    const command = new QueryCommand({
        TableName,
        IndexName: "email-username-index",
        KeyConditionExpression: "#email = :email",
        ExpressionAttributeNames: {
            "#email" : "email",
        },
        ExpressionAttributeValues: { 
            ":email" : { S: email },
        }
    });

    try {
        const response = await documentClient.send(command);
        return response.Items[0] || null;

    } catch (err) {
        console.error("Error retrieving user by email: ", err);
        throw { status: 500, message: "Error retrieving user by email" };
    }
}

async function registerUser(user) {
    const command = new PutCommand({
        TableName,
        Item: user
    });

    try {
        await documentClient.send(command);
        return user;

    } catch (err) {
        console.error("Error registering user: ", err);
        throw { status: 500, message: "Error registering user" };
    }
}

module.exports = {
    registerUser,
    getUserByUsername,
    getUserByEmail
};