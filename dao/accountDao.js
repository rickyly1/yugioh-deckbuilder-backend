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
 */

async function registerUser(user) {
    const command = new PutCommand({
        TableName,
        Item: user
    });


    try {
        const response = await documentClient.send(command);
        return response;

    } catch (err) {
        console.error("Error registering user: ", err);
        return null;
    }
}

module.exports = {
    registerUser,
};