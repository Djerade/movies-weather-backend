import { createSchema } from "graphql-yoga";
import { mutations } from "./mutations";
import { queries } from "./queries";
import resolvers from "../resolvers";
import { types } from "./types";

export const schema = createSchema({
    typeDefs: [...types, ...mutations, ...queries],
    resolvers: resolvers,
});
