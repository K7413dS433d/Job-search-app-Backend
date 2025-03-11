import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { adminMutation, adminQuery } from "./admin/admin.controller.js";

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQuery",
    description: "This is the root query for the Admin",
    fields: {
      ...adminQuery,
    },
  }),

  mutation: new GraphQLObjectType({
    name: "RootMutation",
    description: "This is the root mutation for the Admin",
    fields: {
      ...adminMutation,
    },
  }),
});
