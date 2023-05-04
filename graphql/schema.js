const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type User {
        _id:ID!
        name:String!
        email:String!
        password:String
        status:String!
        posts:[Posts!]!
    }

    type Posts{
        _id:ID!
        title:String!
        content:String!
        imageUrl :String!
        creator:User!
        createdAt:String!
        updatedAt:String!
    }




    input UserInputData{
        email:String!
        name:String!
        password:String!
    }

    input UserInputPost{
        content:String!
        date:String!
        id:ID
    }

    input getUserId{
        id:ID
    }

    type RootQuery{
        getUser(userId:getUserId):User!
    }

    type RootMutation {
        createUser(userInput:UserInputData):User!
        createPost(userPost:UserInputPost):Posts!
    }


    schema{
        query:RootQuery
        mutation:RootMutation
    }

`);
