import User from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js";
import bcrypt from "bcryptjs";
import { ProfilePix } from "../models/profilePix.model.js";

const userResolver = {
  Mutation: {
    signUp: async (_, { input }, context) => {
      try {
        const { username, name, password, gender } = input;
        if (!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }
        const existingUser = User.findOne({ username });
        if (existingUser?.username === username) {
          throw new Error("User already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //https://avatar.placeholder.iran.liara.run

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
        });
        // const token = jwt.sign({ user: newUser }, process.env.SESSION_SECRET);
        await newUser.save();
        await context.login(newUser);
        // const user = {
        //   ...newUser,
        //   token,
        // };
        return newUser;
      } catch (err) {
        throw new Error(err.message || "Internal server error");
      }
    },

    login: async (_, { input }, context) => {
      try {
        const { username, password } = input;

        if (!username || !password) {
          throw new Error("All fields are required");
        }

        const { user, info } = await context.authenticate("graphql-local", {
          username,
          password,
        });

        if (user.username === username) {
          // const token = jwt.sign({ user }, process.env.SESSION_SECRET);

          // context.res.cookie("jwt", token, {
          //   httpOnly: true,
          //   sameSite: "None",
          //   secure: true,
          //   maxAge: 24 * 60 * 60 * 1000,
          // });
          await context.login(user);

          // console.log("user with token", user);
          return user;
        }
      } catch (err) {
        console.error("error in login:", err);
        throw new Error(err.message || "Internal server error");
      }
    },

    logout: async (_, __, context) => {
      try {
        await context.logout(); //could have used context.logout

        await context.req.session.destroy((err) => {
          if (err) throw err;
        });
        await context.res.clearCookie("connect.sid");

        return { message: "logged out successfully" };
      } catch (err) {
        console.error("error in logout:", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },
  Query: {
    authUser: async (_, __, context) => {
      try {
        console.log("authUser context", context);
        const user = await context.getUser();
        console.log("authUser after login", user);
        return user;
      } catch (err) {
        console.error("error in authUser:", err);
        throw new Error(err.message || "Error in getting user");
      }
    },

    user: async (_, { userId }) => {
      try {
        return User.findById(userId);
      } catch (err) {
        console.error("error in user query:", err);
        throw new Error(err.message || "Internal server error");
      }
    },
  },

  // TODO=>ADD USER/TRANSACTION RELATION
  User: {
    async transactions(parent) {
      try {
        //Here, user is the parent
        console.log("transactions===", parent._id);
        return await Transaction.find({ userId: parent._id });
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
  User: {
    async photo(parent) {
      try {
        //Here, user is the parent

        const userId = parent._id;
        const pix = await ProfilePix.findOne({ userId });

        return pix;
      } catch (err) {
        throw new Error(err.message);
      }
    },
  },
};

export default userResolver;
