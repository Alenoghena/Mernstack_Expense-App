// import imageResolver from "./image.resolver.js";
import profilePixResolver from "./profilePix.resolver.js";
import transactionResolver from "./transaction.resolver.js";
import userResolver from "./user.resolver.js";
import { mergeResolvers } from "@graphql-tools/merge";

const mergedResolvers = mergeResolvers([
  userResolver,
  transactionResolver,
  profilePixResolver,

  // imageResolver,
]);

export default mergedResolvers;
