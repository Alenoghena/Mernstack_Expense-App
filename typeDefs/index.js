import transactionTypeDef from "./transaction.typeDef.js";
import userTypeDef from "./user.typeDef.js";
import { mergeTypeDefs } from "@graphql-tools/merge";

const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);

export default mergedTypeDefs;
