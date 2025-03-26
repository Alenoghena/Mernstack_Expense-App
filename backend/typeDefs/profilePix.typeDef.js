const profilePixTypeDef = `#graphql

scalar Upload

type ProfilePix{
    _id:ID!
    userId:ID!
    profilePhoto:String!
    # size: Int!

}

# from tutorial
# type File{
#     filename:String!
#     mimetype:String!
#     encoding:String!
# url:String! //this is important
# }
#  type Query{
#     uploads:[File]
#  }
# type Mutation{
#     singleUpload(file:Upload!):File!
# }



type Query{

    pix:ProfilePix!
}

type Mutation{
   createProfilePix(file:FileInput!):ProfilePix!
   updateProfilePix(file:File!):ProfilePix!
   deleteProfilePix(userId:ID!):ProfilePix!

}

input FileInput{
    profilePhoto:String


}
input File{
    photoId:ID
    profilePhoto:Upload

}


`;

export default profilePixTypeDef;
