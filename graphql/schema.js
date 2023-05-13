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
    type GetUsers {
        _id:ID
        name:String
        email:String
        password:String
        status:String
        posts:[Posts!]
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

    type AuthData{
        token:String!
        userId:String!
    }



    input UserInputData{
        email:String!
        name:String!
        password:String!
    }

    input UserId {
        id:ID
    }

    input UserInputPost{
        title:String
        content:String!
        imageUrl:String
    }

    input getUserId{
        id:ID
    }
    input loginData{
        email:String!
        password:String!
    }

    type RootQuery{
        getUser(userId:getUserId):User!
        getAllUsers:[GetUsers!]!
        login(email:String!,password:String!):AuthData!
    }

    type RootMutation {
        createUser(userInput:UserInputData):User!
        updateUser(userId:UserId!,userInput: UserInputData!):User!
        deleteUser(userId:getUserId!):String!
        createPost(userPost:UserInputPost):Posts!
    }


    schema{
        query:RootQuery
        mutation:RootMutation
    }

`);
