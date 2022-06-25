const jwt = require("jsonwebtoken");
const db = require("../models");
// const env = require("../config/env");
const HelperFunction = require("./helper.controller");
const Group = db.group;
const Archive = db.archive;
const Account = db.account;
const mongoose = require("mongoose");

// const jwtSecret = env.jwtSecret;
// function createToken(id, email) {
//   return jwt.sign({ id: id, email: email }, jwtSecret);
// }

exports.createGroup = (req, res) => {
  const groupname = req.body.name;
  const userID = mongoose.Types.ObjectId(req.body._id);
  const username = req.body.username;
  const contact = req.body.contact;
  Group.find()
    .sort({ groupID: -1 })
    .limit(1)
    .then(function (result) {
      // console.log(result);
      let newID = result.length != 0 ? result[0].groupID + 1 : 1;
      // console.log(newID);
      const group = new Group({
        groupID: newID,
        name: groupname,
        users: {
          userID: userID,
          username: username,
          contact: contact,
          amount: 0,
        },
      });
      group
        .save(group)
        .then((groupInfo) => {
          //   let token = createToken(group.id, group.username);

          return res.status(200).json({
            message: "Group successfully created",
            // data: { token: token, group: groupInfo },
            data: { group: groupInfo },
          });
        })
        .catch((err) => {
          return res.status(500).json({
            message: "Something went wrong! Error: " + err.message,
            data: {},
          });
        });
    });
};

exports.updateGroup = (req, res) => {
  const groupID = req.body.groupID;

  var account = Group.findOne({ groupID: groupID }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      return res.status(500).json({
        message: "No such group found.",
        data: {},
      });
    } else {
      obj.name = req.body.name;

      obj
        .save(obj)
        .then((groupInfo) => {
          return res.status(200).json({
            message: "Group profile successfully updated.",
            data: { group: groupInfo },
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

exports.uploadImage = (req, res) => {
  // console.log(req);
  console.log(req.file.filename);
  console.log(req.body.groupID);
  let groupID = parseInt(req.body.groupID);
  const url = req.protocol + "://" + req.get("host");

  var account = Group.findOne({ groupID: groupID }, (err, obj) => {
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
      obj.image = url + "/public/" + req.file.filename;
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

exports.removeImage = (req, res) => {
  const groupID = req.body.groupID;
  var account = Group.findOne({ groupID: groupID }, (err, obj) => {
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
      obj.image = "";
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

exports.displayGroups = (req, res) => {
  const userID = mongoose.Types.ObjectId(req.body._id);
  Group.find({ users: { $elemMatch: { userID: userID } } })
    .then((data) => {
      //   console.log(data);
      res.status(200).json({
        message: "Successfully retrieved group information",
        data: { groups: data },
      });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving transactions with id=" + id });
    });
};

exports.joinGroup = (req, res) => {
  const groupID = req.body.groupID;
  const userID = mongoose.Types.ObjectId(req.body._id);
  const username = req.body.username;
  const contact = req.body.contact;
  Group.findOne({ groupID: groupID }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      return res.status(500).json({
        message: "No such group found.",
        data: {},
      });
    } else {
      let newUser = {
        userID: userID,
        username: username,
        contact: contact,
        amount: 0,
      };
      obj.users.push(newUser);
      obj
        .save(obj)
        .then((groupInfo) => {
          return res.status(200).json({
            message: "Group joined successfully",
            data: { group: groupInfo },
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

exports.deleteMember = (req, res) => {
  const groupID = req.body.groupID;
  const username = req.body.username;
  Group.updateOne(
    { groupID: groupID },
    { $pull: { users: { username: username } } }
  )
    .then((data) => {
      //   console.log(data);
      res.status(200).json({
        message: "Successfully deleted member named " + username,
        data: data,
      });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error deleting member named" + username });
    });
};

exports.deleteGroup = (req, res) => {
  const groupID = req.body.groupID;
  Group.findOneAndDelete({ groupID: groupID }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      return res.status(500).json({
        message: "No such group found.",
        data: {},
      });
    } else {
      //   return res.status(200).json({
      //     message: "You have successfully deleted!",
      //     data: { deleted: obj },
      //   });
      Archive.create({
        groupID: obj.groupID,
        name: obj.name,
        image: obj.image,
        users: obj.users,
        log: obj.log,
      })
        .then((data) => {
          return res.status(200).json({
            message: "Successfully archived group with id = " + groupID,
            data: { archive: data },
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

//insert the json objects of transaction logs into the "log" array
//aggregate the amount of each user in the "users" array at the same time
exports.initiatePayment = (req, res) => {
  // an array of transaction logs initiated
  const groupID = req.body.groupID;
  const userAmounts = req.body.userAmounts;

  userAmounts.forEach((user) => {
    user.userID = mongoose.Types.ObjectId(user.userID);
  });

  Group.findOne({ groupID: groupID }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      return res.status(500).json({
        message: "No such group found.",
        data: {},
      });
    } else {
      /*looping through each user and finding the respective user document in users
      collection to push the corresponding group transaction log into groupLog*/
      userAmounts.forEach((user) => {
        Account.findOne({ username: user.username }, (err, obj) => {
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
            obj.groupLog.push({
              groupID: parseInt(groupID),
              description: user.description,
              category: user.category,
              amount: user.amount,
              date: user.date,
            });
            obj
              .save(obj)
              .then((userInfo) => {
                // console.log(userInfo);
              })
              .catch((err) => {
                return res.status(500).json({
                  message: "Something went wrong! Error: " + err.message,
                  data: {},
                });
              });
          }
        });
      });
      //saving the array of transaction logs into the log array of group
      obj.log = obj.log.concat(userAmounts);
      //aggregate the overall balance of each user in users array of group
      const temp = obj.users.concat(userAmounts);
      const updatedUsers = temp.reduce((users, current) => {
        if (users[current.username]) {
          users[current.username].amount += current.amount;
        } else {
          users[current.username] = current;
        }
        return users;
      }, {});
      obj.users = [];
      obj.users = obj.users.concat(Object.values(updatedUsers));
      obj
        .save(obj)
        .then((groupInfo) => {
          return res.status(200).json({
            message: "Successfully initiated payment",
            data: { group: groupInfo },
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

/* 
- I'm using username as a filter for now, if you want to use userID instead, 
can just change accordingly (got two parts to change)
- try on Insomnia first to see the intended output
- the output log contains amount, category, date which are the only fields 
I find relevant for our adjustment log. If you need more data just include 
more fields within the "in" clause of the "$map" clause

exports.getAdjustments = (req, res) => {
  //   const userID = mongoose.Types.ObjectId(req.body._id);
  const username = req.body.username;
  Group.aggregate(
    [
      { $match: { log: { $elemMatch: { username: username } } } },
      {
        $project: {
          groupID: 1,
          name: 1,
          log: {
            $map: {
              input: {
                $filter: {
                  input: "$log",
                  as: "logFl",
                  cond: { $eq: ["$$logFl.username", username] },
                },
              },
              as: "logMap",
              in: {
                amount: "$$logMap.amount",
                category: "$$logMap.category",
                date: "$$logMap.date",
              },
            },
          },
        },
      },
    ],
    (err, obj) => {
      if (err) {
        return res.status(500).json({
          message: "Something went wrong! Error: " + err.message,
          data: {},
        });
      } else if (!obj) {
        return res.status(500).json({
          message: "No group transaction log for user with id = " + userID,
          data: {},
        });
      } else {
        return res.status(200).json({
          message: "Successfully retrieved adjustments",
          data: { adjustments: obj },
        });
      }
    }
  );
};
*/

/* 
This API changes the acknowledgement status of the transaction log from false to true
*/
/* 
Here, I am using the entire json object of user log plus groupID as filters to update the 
status (you might need to populate the missing fields in the outstanding group page) 
As for displaying the group logs in outstanding, I think we can leverage the
frontend groupCtx instead of creating a new api
*/
exports.acknowledgePayment = (req, res) => {
  const groupID = req.body.groupID;
  const userLog = req.body.userLog; //the group transaction log specific to the user
  const json = {
    ...userLog,
  };
  json.userID = mongoose.Types.ObjectId(json.userID);
  Group.findOne({ groupID: groupID, log: json }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      return res.status(200).json({
        message: "No such transaction log found",
        data: {},
      });
    } else {
      Group.updateOne(
        { groupID: groupID },
        { $set: { "log.$[elem].status": true } },
        { arrayFilters: [{ elem: json }] },
        (err, obj) => {
          if (err) {
            return res.status(500).json({
              message: "Something went wrong! Error: " + err.message,
              data: {},
            });
          } else {
            return res.status(200).json({
              message: "Successfully updated status of user log",
              data: { log: obj },
            });
          }
        }
      );
    }
  });
};

exports.resetPayments = (req, res) => {
  const groupID = req.body.groupID;
  Group.findOne({ groupID: groupID }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Something went wrong! Error: " + err.message,
        data: {},
      });
    } else if (!obj) {
      return res.status(500).json({
        message: "No such group found.",
        data: {},
      });
    } else {
      //   console.log(obj);
      let temp = [].concat(obj.users);
      temp = temp.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
      //   console.log(temp);
      const amounts = temp.map((item) => item.amount);
      const users = temp.map((item) => [item.username, item.contact]);
      const output = HelperFunction.getMinimumTransactions(amounts).map(
        (item) => {
          const obj = {};
          obj["payer"] = users[item[0]][0];
          obj["payer_contact"] = users[item[0]][1];
          obj["payee"] = users[item[1]][0];
          obj["payee_contact"] = users[item[1]][1];
          obj["amount"] = item[2];
          return obj;
        }
      );
      output.forEach((item) => {
        Account.updateOne(
          { username: item.payer },
          {
            $push: {
              pending: {
                group: groupID,
                user: item.payee,
                contact: item.payee_contact,
                amount: item.amount,
                payeeHasPaid: true,
              },
            },
          },
          (err) => {
            if (err) {
              return res.status(500).json({
                message:
                  "Something went wrong when updating user's pending payment! Error: " +
                  err.message,
                data: {},
              });
            }
          }
        );
        Account.updateOne(
          { username: item.payee },
          {
            $push: {
              pending: {
                group: groupID,
                user: item.payer,
                contact: item.payer_contact,
                amount: item.amount * -1,
                payeeHasPaid: false,
              },
            },
          },
          (err) => {
            if (err) {
              return res.status(500).json({
                message:
                  "Something went wrong when updating user's pending payment! Error: " +
                  err.message,
                data: {},
              });
            }
          }
        );
      });

      obj.log = [];
      obj.users = obj.users.map((user) => {
        const json = {
          ...user,
        };
        json.amount = 0;
        return json;
      });
      obj
        .save(obj)
        .then((groupInfo) => {
          return res.status(200).json({
            message: "Successfully resetted payment",
            data: { group: groupInfo },
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
