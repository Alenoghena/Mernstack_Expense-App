import profilePixTypeDef from "./profilePix.typeDef.js";
import transactionTypeDef from "./transaction.typeDef.js";
import userTypeDef from "./user.typeDef.js";

import { mergeTypeDefs } from "@graphql-tools/merge";

const mergedTypeDefs = mergeTypeDefs([
  userTypeDef,
  transactionTypeDef,
  profilePixTypeDef,
]);

export default mergedTypeDefs;
