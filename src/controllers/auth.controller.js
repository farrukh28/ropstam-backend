import { AppError } from "../utils/error-handler.js";
import bcrypt from "bcrypt";
import { UsersModel } from "../models/index.model.js";
import { getJwtToken } from "../utils/jwt.js";
import { generate as generatePassword } from "generate-password";
import { sendWelcomeEmail } from "../utils/nodemailer.js";

/**
 * @description user signup
 */
export const userSignup = async (args) => {
  const { email, firstName, lastName } = args;

  if (!email) throw AppError(400, "Email required");

  // check if user exists
  const userExists = await UsersModel.findOne({ email });
  if (userExists) throw AppError(400, "User with this email already exists");

  // generate random password
  const password = generatePassword({
    length: 10,
    lowercase: true,
    uppercase: true,
    symbols: false,
    numbers: false,
  });

  const hash = bcrypt.hashSync(password, 10);

  // prepare data to create user
  const doc = { email, password: hash, firstName, lastName };

  await UsersModel.create(doc);

  //  send welcome email with password
  await sendWelcomeEmail(email, password);

  return { message: "User created", success: true };
};

/**
 * @description user login
 * @param {string} email user email
 * @param {string} password user password
 */
export const userLogin = async (args) => {
  const { email, password } = args;

  if (!email) throw AppError(400, "Email required");
  if (!password) throw AppError(400, "Password required");

  // check email
  const userExists = await UsersModel.findOne({ email }).select({
    email: 1,
    password: 1,
    type: 1,
    createdAt: 1,
    firstName: 1,
    lastName: 1,
  });
  if (!userExists) throw AppError(400, "User not registered");

  // check password
  const checkPassword = bcrypt.compareSync(password, userExists.password);
  if (!checkPassword) throw AppError(400, "Password is incorrect");

  const data = { ...userExists._doc };

  // delete password
  delete data.password;

  // generate jwt token
  const token = getJwtToken({ _id: data._id, email });

  return { success: true, data, token };
};
