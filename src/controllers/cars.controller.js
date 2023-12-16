import { CarsModel } from "../models/index.model.js";
import { AppError } from "../utils/error-handler.js";
import { transformSortByString } from "../utils/helper-functions.js";

export const getCars = async (args) => {
  let { page, limit, userID, sort } = args;

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

  const data = await CarsModel.find(query)
    .sort(sortQuery)
    .populate([
      {
        path: "category",
        select: {
          title: 1,
        },
      },
    ])
    .select({
      updatedAt: 0,
      __v: 0,
    })
    .skip(limit * page)
    .limit(limit);

  const totalCount = await CarsModel.find(query).countDocuments();
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    totalPages,
    totalCount,
  };
};

export const createCar = async (args) => {
  const { userID, color, make, model, registrationNumber, category } = args;

  // prepare doc
  const doc = {
    user: userID,
    color,
    make,
    model,
    registrationNumber,
    category,
  };

  const data = await CarsModel.create(doc);

  return { data };
};

export const getCarByID = async (args) => {
  const { ID } = args;

  if (!ID) throw AppError(400, "ID is required");

  const data = await CarsModel.findById(ID).populate([
    {
      path: "user",
      select: {
        email: 1,
        firstName: 1,
        lastName: 1,
      },
    },
    {
      path: "category",
      select: {
        title: 1,
      },
    },
  ]);
  if (!data) throw AppError(404, "Car not found");

  return { data };
};

export const updateCarByID = async (args) => {
  const { ID, color, make, model, registrationNumber, category } = args;

  if (!ID) throw AppError(400, "ID is required");

  // prepare doc
  const doc = {};
  if (color) doc.color = color;
  if (make) doc.make = make;
  if (model) doc.model = model;
  if (category) doc.category = category;
  if (registrationNumber) doc.registrationNumber = registrationNumber;

  const data = await CarsModel.findByIdAndUpdate(
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

export const deleteCarByID = async (args) => {
  const { ID, userID } = args;

  if (!ID) throw AppError(400, "ID is required");
  if (!userID) throw AppError(400, "User ID is required");

  const data = await CarsModel.deleteOne({ _id: ID, user: userID });

  return { data };
};
