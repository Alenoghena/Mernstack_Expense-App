const userTypeDef = `#graphql
type User{
    id:ID!,
    username:String!,
    name:String!,
    password:String!,
    profilePicture:String,
    gender:String!
    token:String!
    transactions:[Transaction!]
    photo:ProfilePix!
}
type Query{
#  Note: authUser.User does not require this=> !
    authUser:User
    user(userId:ID):User!




}
type Mutation{
    signUp(input:SignUpInput!):User
    login(input:LoginInput!):User!
    logout:LogoutResponse
}
input SignUpInput{
    username:String!
    name:String!
    password:String!
    gender:String!
}
input LoginInput{
    username:String!
    password:String!
}
type LogoutResponse{
    message:String
}
`;

export default userTypeDef;
