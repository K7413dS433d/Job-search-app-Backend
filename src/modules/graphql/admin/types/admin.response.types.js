import { GraphQLList } from "graphql";
import { responseSchema } from "../../../../utils/index.utils.js";
import { companyType, userType } from "./types.js";

export const getAllDataResponseType = responseSchema({
  name: "getAllDataResponse",
  dataFields: {
    users: {
      type: new GraphQLList(userType),
    },
    companies: { type: new GraphQLList(companyType) },
  },
});


