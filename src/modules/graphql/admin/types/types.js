import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export const pictureType = new GraphQLObjectType({
  name: "pictureType",
  fields: {
    secure_url: { type: GraphQLString },
    public_id: { type: GraphQLString },
  },
});

export const userType = new GraphQLObjectType({
  name: "userType",
  fields: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    mobileNumber: { type: GraphQLString },
    username: { type: GraphQLString },
    profilePic: { type: pictureType },
    coverPic: { type: pictureType },
  },
});

export const companyType = new GraphQLObjectType({
  name: "companyType",
  fields: {
    description: { type: GraphQLString },
    industry: { type: GraphQLString },
    address: { type: GraphQLString },
    numberOfEmployees: { type: GraphQLString },
    companyEmail: { type: GraphQLString },
    createdBy: { type: GraphQLString },
    logo: { type: pictureType },
    coverPic: { type: pictureType },
    HRs: { type: new GraphQLList(GraphQLString) },
    bannedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
    legalAttachment: { type: pictureType },
    approvedByAdmin: { type: GraphQLBoolean },
  },
});
