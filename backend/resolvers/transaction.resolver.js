import { Transaction } from "../models/transaction.model.js";
import User from "../models/user.model.js";
const formatDate = (date, options) =>
  new Intl.DateTimeFormat("en-us", options).format(date);

const transactionResolver = {
  Query: {
    // All transactions
    transactions: async (_, __, context) => {
      try {
        const options = {
          day: "numeric",
          month: "long",
          year: "numeric",
        };
        if (!context.getUser()) throw new Error("Unathorized");
        const { _id } = await context.getUser();

        const transactions = await Transaction.find({ userId: _id });
        console.log(transactions);
        //format date here
        const newTransacts = transactions.map((transaction) => {
          return {
            ...transaction._doc,
            date: formatDate(transaction._doc.date, options),
          };
        });

        return newTransacts;
      } catch (err) {
        throw new Error("error getting transactions:");
      }
    },

    // single transaction
    transaction: async (_, { transactionId }) => {
      try {
        return await Transaction.findById({ _id: transactionId }); //args.transactionId
      } catch (err) {
        throw new Error("error getting transaction", err.message);
      }
    },

    //TODO => ADD categoryStatistics query
    categoryStatistics: async (_, __, context) => {
      if (!context.getUser()) throw new Error("Unauthorized");
      const categoryMap = {};
      const userId = await context.getUser()._id;

      const transactions = await Transaction.find({ userId });
      transactions.forEach(function (transaction) {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += transaction.amount;
      });
      console.log(categoryMap);
      return Object.entries(categoryMap).map(([category, amount]) => ({
        category,
        totalAmount: amount,
      }));
    },
  },

  Mutation: {
    createTransaction: async (_, { input }, context) => {
      try {
        const { _id } = await context.getUser();
        const newTransaction = new Transaction({
          ...input,
          userId: _id,
        });
        await newTransaction.save();

        return newTransaction;
      } catch (err) {
        throw new Error("error creating transaction", err.message);
      }
    },
    updateTransaction: async (_, { input }) => {
      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          input,
          { new: true }
        );

        return updatedTransaction;
      } catch (err) {
        throw new Error("error updating transaction");
      }
    },
    deleteTransaction: async (_, { transactionId }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete({
          _id: transactionId,
        });

        return deletedTransaction;
      } catch (err) {
        throw new Error("error deleting transaction");
      }
    },
  },
  //TODO=> Add transaction/user relationship
  Transaction: {
    user: async (parent) => {
      try {
        //Here, "Transaction" is the parent
        const { userId } = parent;

        const user = await User.findById(userId);
        return user;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

export default transactionResolver;
