import { UsersModel } from "../models/index.model.js";
import { AppError } from "../utils/error-handler.js";

export const getUserByID = async (args) => {
  const { ID } = args;

  if (!ID) throw AppError(400, "Invalid user ID");

  const data = await UsersModel.findById(ID);

  if (!data) throw AppError(404, "User not found");

  return { success: true, data, fromCache: false };
};
