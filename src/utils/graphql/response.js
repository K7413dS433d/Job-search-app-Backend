import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const dataObjectSchema = (dataFields, name) =>
  new GraphQLObjectType({
    name: `dataKeyInResponse_${name}`,
    fields: {
      ...dataFields,
    },
  });

const dataListSchema = (dataFields, name) =>
  new GraphQLList(
    new GraphQLObjectType({
      name: `dataKeyInResponse_${name}`,
      fields: {
        ...dataFields,
      },
    })
  );

export const responseSchema = ({ dataFields, name, list = false }) =>
  new GraphQLObjectType({
    name: `globalResponse_${name}`,
    fields: {
      success: { type: GraphQLBoolean },
      status: { type: GraphQLInt },
      message: { type: GraphQLString },
      //optional fields
      ...(dataFields && {
        data: {
          type: list
            ? dataListSchema(dataFields, name)
            : dataObjectSchema(dataFields, name),
        },
      }),
    },
  });

export const messageResponse = responseSchema({ name: "messageResponse" });

export const setResponse = ({
  success = true,
  status = 500,
  message = "server error",
  data,
}) => {
  return {
    success,
    status,
    message,
    data,
  };
};
