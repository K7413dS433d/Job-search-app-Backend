import { GraphQLID, GraphQLNonNull } from "graphql";

export const banOrUnPanUserRequestType = {
  userId: { type: new GraphQLNonNull(GraphQLID) },
};

export const CompanyIDRequestType = {
  companyId: { type: new GraphQLNonNull(GraphQLID) },
};
