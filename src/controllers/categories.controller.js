import { CategoriesModel } from "../models/index.model.js";
import { AppError } from "../utils/error-handler.js";
import { transformSortByString } from "../utils/helper-functions.js";

export const getCategories = async (args) => {
  let { page, limit, userID, sort, q } = args;

  if (page) page--;
  if (!page) page = 0;
  if (!limit) limit = 10;

  const query = {
    user: userID,
  };

  // generate sort query object
  let sortQuery = {};
  if (sort) {
    sortQuery = transformSortByString(sort);
  }

  // search query
  if (q) {
    query.$or = [
      {
        title: {
          $regex: q,
          $options: "i",
        },
      },
    ];
  }

  const data = await CategoriesModel.find(query)
    .sort(sortQuery)
    .select({
      name: 0,
      updatedAt: 0,
      user: 0,
      __v: 0,
    })
    .skip(limit * page)
    .limit(limit);

  const totalCount = await CategoriesModel.find(query).countDocuments();
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    totalPages,
    totalCount,
  };
};

export const createCategory = async (args) => {
  const { userID, title } = args;

  if (!title) throw AppError(400, "Title is required");

  // check for duplicate name by this user
  const _name = title.toLowerCase();
  const nameExists = await CategoriesModel.findOne({
    user: userID,
    name: _name,
  });

  if (nameExists) {
    throw AppError(400, "Category with this title already exists");
  }

  // prepare doc
  const doc = { title, name: title, user: userID };

  const data = await CategoriesModel.create(doc);

  return { data };
};

export const getCategoryByID = async (args) => {
  const { ID } = args;

  if (!ID) throw AppError(400, "ID is required");

  const data = await CategoriesModel.findById(ID).populate([
    {
      path: "user",
      select: {
        email: 1,
        firstName: 1,
        lastName: 1,
      },
    },
  ]);
  if (!data) throw AppError(404, "Category not found");

  return { data };
};

export const updateCategoryByID = async (args) => {
  const { ID, title, userID } = args;

  if (!ID) throw AppError(400, "ID is required");
  if (!title) throw AppError(400, "Title is required");

  // check for duplicate name by this user
  const _name = title.toLowerCase();
  const nameExists = await CategoriesModel.findOne({
    _id: {
      $ne: ID,
    },
    user: userID,
    name: _name,
  });

  if (nameExists) {
    throw AppError(400, "Category with this title already exists");
  }

  // prepare doc
  const doc = {};
  if (title) doc.title = title;
  if (title) doc.name = title;

  const data = await CategoriesModel.findByIdAndUpdate(
    ID,
    {
      $set: doc,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!data) throw AppError(404, "Category not found");

  return { data };
};

export const deleteCategoryByID = async (args) => {
  const { ID, userID } = args;

  if (!ID) throw AppError(400, "ID is required");
  if (!userID) throw AppError(400, "User ID is required");

  const data = await CategoriesModel.deleteOne({ _id: ID, user: userID });

  return { data };
};
