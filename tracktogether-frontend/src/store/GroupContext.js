import React, { useState } from "react";

const GroupContext = React.createContext({
  group: [],
  isDataFetched: false,
  //   login: () => {},
  //   datalog: () => {},
  findGroupWithID: () => {},
  findImageWithID: () => {},
  validateGroupWithID: () => {},
  logout: () => {},
});

export const GroupContextProvider = (props) => {
  // const productionMode = typeof props.data === "undefined";

  const token = localStorage.getItem("token") || props.token;
  // const [group, setGroup] = useState(productionMode ? [] : props.data.group);
  // const [dataFetched, setDataFetched] = useState(productionMode ? false : true);

  const [group, setGroup] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  console.log(group);
  if (!dataFetched && token != null) {
    const url = "http://localhost:8080/api/group/summary/";
    console.log("fetching data in group context");
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage; // = 'Authentication failed!';
            console.log(JSON.stringify(data));
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            console.log(errorMessage);

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // console.log(data.data.groups);
        setGroup(data.data.groups);
        setDataFetched(true);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  const logoutHandler = () => {
    setDataFetched(false);
    setGroup([]);
  };

  const findGroupWithID = (groupID) => {
    let baseGroup = {
      groupID: null,
      name: null,
      image: null,
      users: [],
      log: [],
    };

    group.forEach((group) => {
      if (group.groupID.toString() === groupID.toString()) {
        baseGroup = group;
      }
    });
    return baseGroup;
  };

  const findImageWithID = (groupID) => {
    const grp = group.filter((item) => item.groupID == groupID);
    console.log(grp[0].image);
    return grp[0].image;
  };

  const findUserIDWithName = (groupID, username) => {
    let userID = 0;
    group.forEach((group) => {
      if (group.groupID.toString() === groupID.toString()) {
        group.users.forEach((user) => {
          if (user.username === username) {
            userID = user.userID;
          }
        });
      }
    });
    console.log(userID);
    return userID;
  };

  const updateGroupInformation = (groupID, newGroupInformation) => {
    let newGroupArray = [...group];
    newGroupArray = newGroupArray.map((group) => {
      if (group.groupID.toString() === groupID.toString()) {
        return newGroupInformation;
      }
      return group;
    });
    setGroup(newGroupArray);
  };

  const updateGroupWithID = (groupID, groupName) => {
    let newGroupArray = [...group];
    newGroupArray = newGroupArray.map((group) => {
      if (group.groupID.toString() === groupID.toString()) {
        group.name = groupName;
      }
      return group;
    });
    setGroup(newGroupArray);
  };

  const updateGroupMemberListWithID = (groupID, username) => {
    let newGroupArray = [...group];
    newGroupArray = newGroupArray.map((group) => {
      if (group.groupID.toString() === groupID.toString()) {
        group.users = group.users.filter((user) => user.username !== username);
      }
      return group;
    });
    setGroup(newGroupArray);
  };

  const deleteGroupWithID = (groupID) => {
    let newGroupArray = [...group];
    newGroupArray = newGroupArray.filter((group) => {
      if (group.groupID.toString() === groupID.toString()) {
        return false;
      }
      return true;
    });
    setGroup(newGroupArray);
  };

  const validateGroupWithID = (groupID) => {
    let newGroupArray = [...group];
    newGroupArray = newGroupArray.map((group) => group.groupID);
    // console.log(newGroupArray.includes(groupID));
    return newGroupArray.includes(groupID);
  };

  const findNotifications = (username) => {
    const finalArray = [];
    group.forEach((entry) => {
      entry.log.forEach((log) => {
        if (log.username === username && log.status == false) {
          const json = {
            ...log,
            groupName: entry.name,
            groupID: entry.groupID,
          };
          finalArray.push(json);
        }
      });
    });
    return finalArray;
  };

  const accepNotification = (groupID, entry) => {
    // const entryDate = new Date(entry.date).getTime();
    // console.log(entryDate);
    console.log(groupID);
    let newGroupArray = [...group];
    newGroupArray = newGroupArray.map((group) => {
      if (group.groupID.toString() === groupID.toString()) {
        group.log.forEach((log) => {
          // console.log(new Date(log.date).getTime());

          if (new Date(log.date).getTime() === new Date(entry.date).getTime()) {
            log.status = true;
          }
        });
      }
      return group;
    });
    setGroup(newGroupArray);
  };

  const contextValue = {
    group: group,
    setGroup: setGroup,
    isDataFetched: dataFetched,
    setDataFetched: setDataFetched,
    logout: logoutHandler,
    findGroupWithID: findGroupWithID,
    findImageWithID: findImageWithID,
    findUserIDWithName: findUserIDWithName,
    updateGroupInformation: updateGroupInformation,
    updateGroupMemberListWithID: updateGroupMemberListWithID,
    updateGroupWithID: updateGroupWithID,
    deleteGroupWithID: deleteGroupWithID,
    validateGroupWithID: validateGroupWithID,
    findNotifications: findNotifications,
    accepNotification: accepNotification,
  };

  return (
    <GroupContext.Provider value={contextValue}>
      {props.children}
    </GroupContext.Provider>
  );
};

export default GroupContext;
