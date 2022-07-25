const jwt = require("jsonwebtoken");
const saltedMd5 = require("salted-md5");
const randomstring = require("randomstring");

const db = require("../models");
// const env = require("../config/env");
const multer = require("multer");
const Account = db.account;
const Classification = db.classification;
const mongoose = require("mongoose");
const quotes = require("../utils/quotes.json");
const cloudinary = require("../utils/cloudinary.js");
require("dotenv").config();

const ModelFunction = require("./model.controller");
const categories = ["Food", "Travel", "Entertainment", "Grocery", "Utilities"];
const rnnFunctions = require("../tsforecasting/rnn.model");
const arimaFunctions = require("../tsforecasting/arima.model");
const helperFunctions = require("../tsforecasting/validation");

const jwtSecret = process.env.JWT_SECRET;
function createToken(id, email) {
  return jwt.sign({ id: id, email: email }, jwtSecret);
}

exports.createAccount = (req, res) => {
  const username = req.body.username;

  Account.findOne({ username: username }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (obj) {
      return res.status(500).json({
        message: "Please choose another username as it has been taken",
        data: {},
      });
    } else {
      let randomString = randomstring.generate({ length: 8 });
      let saltedHashPassword = saltedMd5(randomString, req.body.password);

      const account = new Account({
        username: req.body.username,
        email: req.body.email,
        contact: req.body.contact,
        password: saltedHashPassword,
        salt: randomString,
      });

      account
        .save(account)
        .then((accountInfo) => {
          let token = createToken(accountInfo._id, accountInfo.email);

          return res.status(200).json({
            message: "Account successfully created",
            data: { token: token, account: accountInfo },
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "Something went wrong! Error: " + err.message,
            data: {},
          });
        });
    }
  });
};

exports.updateAccount = (req, res) => {
  let uniqueID = req.body._id;

  var account = Account.findOne({ _id: uniqueID }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      return res.status(500).json({
        message: "No such account found.",
        data: {},
      });
    } else {
      obj.username = req.body.username;
      obj.email = req.body.email;
      obj.contact = req.body.contact;

      obj
        .save(obj)
        .then((accountInfo) => {
          return res.status(200).json({
            message: "Account profile successfully updated.",
            data: { account: accountInfo },
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "Something went wrong! Error: " + err.message,
            data: {},
          });
        });
    }
  });
};

exports.login = (req, res) => {
  let username = req.body.username;

  var account = Account.findOne(
    { username: username },
    function (err, accountInfo) {
      if (err) {
        return res.status(500).json({
          message: "Something went wrong! Error: " + err.message,
          data: {},
        });
      } else if (!accountInfo) {
        return res.status(500).json({
          message: "No such account found.",
          data: {},
        });
      } else {
        let saltedHashPassword = saltedMd5(accountInfo.salt, req.body.password);

        if (saltedHashPassword == accountInfo.password) {
          let token = createToken(accountInfo._id, accountInfo.email);

          return res.status(200).json({
            message: "You have successfully sign in!",
            data: { token: token, account: accountInfo },
          });
        } else {
          return res.status(400).json({
            message: "Password mismatch!",
            data: {},
          });
        }
      }
    }
  );
};

exports.fetchQuote = async (req, res) => {
  return res.status(200).json({
    message: "Quote fetched successfully",
    data: quotes,
  });
};

exports.uploadImage = async (req, res) => {
  // console.log(req);
  // console.log(req.file.filename);
  // console.log(req.body.id);
  let uniqueID = mongoose.Types.ObjectId(req.body.id);
  // const url = req.protocol + "://" + req.get("host");

  var account = Account.findOne({ _id: uniqueID }, async (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      return res.status(500).json({
        message: "No such account found.",
        data: {},
      });
    } else {
      if (
        obj.image !== null ||
        obj.image !== {} ||
        obj.image.id !== null ||
        obj.image.id.length !== 0
      ) {
        await cloudinary.uploader
          .destroy(obj.image.id)
          .catch((err) => console.log(err));
      }
      const result = await cloudinary.uploader
        .upload(req.file.path)
        .catch((err) => console.log(err));
      obj.image = {
        url: result.secure_url,
        id: result.public_id,
      };
      console.log(obj.image);
      obj
        .save(obj)
        .then((accountInfo) => {
          return res.status(200).json({
            message: "Image successfully uploaded/changed.",
            data: { account: accountInfo },
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "Something went wrong! Error: " + err.message,
            data: {},
          });
        });
    }
  });
};

exports.removeImage = async (req, res) => {
  const uniqueID = req.body._id;
  var account = Account.findOne({ _id: uniqueID }, async (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      return res.status(500).json({
        message: "No such account found.",
        data: {},
      });
    } else {
      if (
        obj.image !== null ||
        obj.image !== {} ||
        obj.image.id !== null ||
        obj.image.id.length !== 0
      ) {
        await cloudinary.uploader
          .destroy(obj.image.id)
          .catch((err) => console.log(err));
      }
      obj.image = {
        url: "",
        id: "",
      };
      obj
        .save(obj)
        .then((accountInfo) => {
          return res.status(200).json({
            message: "Image successfully removed.",
            data: { account: accountInfo },
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "Something went wrong! Error: " + err.message,
            data: {},
          });
        });
    }
  });
};

exports.refresh = (req, res) => {
  let _id = req.body._id;
  var account = Account.findOne({ _id: _id }, function (err, accountInfo) {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else {
      return res.status(200).json({
        message: "Refreshed login status",
        data: { account: accountInfo },
      });
    }
  });
};

exports.retrieveTransactions = (req, res) => {
  // console.log("getting transactions" + new Date());
  const id = req.body._id;
  Account.findOne({ _id: id })
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "No user found with id " + id });
      else
        res.status(200).json({
          message: "Retrieved Transactons",
          data: data.transactions,
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving transactions with id=" + id });
    });
};

exports.addTransactions = (req, res) => {
  const id = req.body._id;
  const newData = req.body.data;
  var account = Account.findOne({ _id: id }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      return res.status(500).json({
        message: "No such user found.",
        data: {},
      });
    } else {
      obj.transactions.push(newData);
      obj
        .save(obj)
        .then((accountInfo) => {
          return res.status(200).json({
            message: "Transactions added successfully",
            data: { account: accountInfo },
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "Something went wrong! Error: " + err.message,
            data: {},
          });
        });
    }
  });
};

exports.getAlerts = (req, res) => {
  const id = req.body._id;
  Account.findOne({ _id: id }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      return res.status(500).json({
        message: "No such user found.",
        data: {},
      });
    } else {
      // console.log(obj);
      return res.status(200).json({
        message: "Successfully retrieved user's pending payments.",
        data: { pending: obj.pending },
      });
    }
  });
};

// This might be problematic if there are duplicate alerts in the pending array of user
// might consider adding a date field in the alert but this needs to be cascaded down
// from the resetPayment function
exports.clearAlerts = (req, res) => {
  const id = req.body._id;
  const alert = req.body.alert;
  const payerUsername = req.body.username;

  const payeeUsername = alert.user;
  const groupID = alert.group;
  const mirroredAmount = alert.amount * -1;

  Account.findOne({ _id: id }, (err, firstObj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!firstObj) {
      return res.status(500).json({
        message: "No such user found.",
        data: {},
      });
    } else {
      let tempArray = [].concat(firstObj.pending);
      let matchingIndex = null;
      tempArray.forEach((entry, index) => {
        if (
          entry.group.toString() === groupID.toString() &&
          entry.amount === alert.amount &&
          entry.user === payeeUsername
        ) {
          matchingIndex = index;
        }
      });

      tempArray = tempArray.filter((entry, index) => {
        return entry != null && index !== matchingIndex;
      });

      firstObj.pending = [];
      firstObj.pending = tempArray;

      firstObj
        .save(firstObj)
        .then(() => {
          // truthy = false;
          // console.log("iam here");
          if (alert.amount > 0) {
            // console.log("iam but deeper");
            Account.findOne({ username: payeeUsername }, (err, obj) => {
              if (err) {
                return res.status(500).json({
                  message: "Something went wrong! Error: " + err.message,
                  data: {},
                });
              } else if (!obj) {
                return res.status(500).json({
                  message: "Payee username not found.",
                  data: {},
                });
              } else {
                let tempArray = [].concat(obj.pending);
                let matchingIndex = null;
                tempArray.forEach((entry, index) => {
                  if (
                    entry.group.toString() === groupID.toString() &&
                    entry.amount === mirroredAmount &&
                    entry.user === payerUsername
                  ) {
                    matchingIndex = index;
                  }
                });

                tempArray[matchingIndex].payeeHasPaid = true;

                obj.pending = [];
                obj.pending = tempArray;

                obj
                  .save(obj)
                  .then(() => {
                    return res.status(200).json({
                      message: "Successfully cleared user's pending payments.",
                      data: { obj },
                    });
                  })
                  .catch((err) => {
                    return res.status(500).json({
                      message: "Something went wrong! Error: " + err.message,
                      data: {},
                    });
                  });
              }
            });
          } else {
            return res.status(200).json({
              message: "Successfully cleared user's pending payments.",
              data: { firstObj },
            });
          }
        })

        .catch((err) => {
          return res.status(500).json({
            message: "Something went wrong! Error: " + err.message,
            data: {},
          });
        });
    }
  });
};

exports.getAdjustments = (req, res) => {
  const id = req.body._id;
  Account.findOne({ _id: id }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      return res.status(500).json({
        message: "No such user found.",
        data: {},
      });
    } else {
      // console.log(obj);
      return res.status(200).json({
        message: "Successfully retrieved user's pending payments.",
        data: { adjustments: obj.groupLog },
      });
    }
  });
};

exports.classificationValidator = (req, res, next) => {
  const newData = req.body.data;
  const description = newData.information;

  Classification.findOne({ description: description }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      next();
    } else {
      const category = retrieveEncoding(newData.category);
      function retrieveEncoding(category) {
        return categories.findIndex((element) => element === category);
      }

      if (obj.classification === category) {
        return res.status(200).json({
          message: "Entry already exists in database with the same category",
          data: { data: obj },
        });
      } else {
        obj.classification = category;
        obj
          .save(obj)
          .then((objInfo) => {
            return res.status(200).json({
              message: "Entry successfully updated",
              data: { data: objInfo },
            });
          })
          .catch((err) => {
            return res.status(500).json({
              message: "Something went wrong! Error: " + err.message,
              data: {},
            });
          });
      }
      // console.log(obj);
    }
  });
};

exports.trainClassificationModel = (req, res) => {
  // const id = req.body._id;
  const newData = req.body.data;
  const description = newData.information;
  const category = retrieveEncoding(newData.category);

  function retrieveEncoding(category) {
    return categories.findIndex((element) => element === category);
  }

  const classification = new Classification({
    description: description,
    classification: category,
  });

  classification
    .save(classification)
    .then((classification) => {
      return res.status(200).json({
        message: "Classification successfully added",
        data: { classification: classification },
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    });
};

exports.predictClassification = async (req, res) => {
  const description = req.body.information;

  //retrieve all
  const dataset = await Classification.find()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });

  const descriptionArray = dataset.map((item) => item.description);
  const labelArray = dataset.map((item) => item.classification);
  //call the function
  ModelFunction.getClassification(descriptionArray, labelArray, [
    description,
  ]).then((prediction) => {
    return res.status(200).json({
      message: "Successfully predicted!",
      data: { data: categories[prediction] },
    });
  });
  exports.getPrediction = (req, res) => {
    let id = mongoose.Types.ObjectId(req.body._id);

    Account.aggregate(
      [
        { $unwind: "$transactions" },
        { $match: { _id: id } },
        {
          $group: {
            _id: {
              month: { $month: { $toDate: "$transactions.date" } },
              year: { $year: { $toDate: "$transactions.date" } },
            },
            amount: { $sum: "$transactions.amount" },
          },
        },
      ],
      async function (err, results) {
        if (err) {
          return res.status(500).json({
            message: "Something went wrong! Error: " + err.message,
            data: {},
          });
        } else if (!results) {
          return res.status(404).json({
            message: "No such account found.",
            data: {},
          });
        } else if (!helperFunctions.validateData(results)) {
          return res.status(500).json({
            message:
              "Insufficient data! Please have at least 24 non-zero spending months.",
            data: { rnn_data: [], sarima_data: [] },
          });
        } else {
          // let data = results.map((item) => item.amount);
          let data = helperFunctions.transformInputData(results);

          const rnnPrediction = helperFunctions.transformOutputData(
            await rnnFunctions.runModel(data)
          );
          const sarimaPrediction = helperFunctions.transformOutputData(
            await arimaFunctions.runModel(data)
          );

          return res.status(200).json({
            message:
              "Predicted spending for next 12 months using RNN and SARIMA",
            data: { rnn_data: rnnPrediction, sarima_data: sarimaPrediction },
          });
        }
      }
    );
  };
};
