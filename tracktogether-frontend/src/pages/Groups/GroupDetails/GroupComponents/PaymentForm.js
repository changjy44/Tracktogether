import React, { useState, useContext, useEffect } from "react";
import styles from "./GroupComponent.module.css";
import AuthContext from "../../../../store/AuthContext";
import GroupContext from "../../../../store/GroupContext";
import { useParams } from "react-router-dom";
import {
  Button,
  Form,
  Row,
  Col,
  ListGroup,
  CloseButton,
} from "react-bootstrap";

function PaymentForm() {
  const initialToken = localStorage.getItem("token");
  const authCtx = useContext(AuthContext);
  console.log(authCtx);
  const grpCtx = useContext(GroupContext);

  const groupID = useParams().groupID;

  const [groupInformation, setGroupInformation] = useState(
    grpCtx.findGroupWithID(groupID).users.map((entry) => {
      // entry.amount = 0;
      return entry;
    })
  );

  useEffect(() => {
    const newGroupInformation = grpCtx
      .findGroupWithID(groupID)
      .users.map((entry) => {
        // entry.amount = 0;
        return entry;
      });
    setGroupInformation(newGroupInformation);
  }, [grpCtx]);

  useEffect(() => {
    setInitiatingMember(authCtx.username);
  }, [authCtx]);

  const [localData, setLocalData] = useState([]);
  const [currDescription, setCurrDescription] = useState("");
  const [splitEvenly, setSplitEvenly] = useState(true);
  const [currAmount, setCurrAmount] = useState(0);
  const [currCategory, setCurrCategory] = useState("Food");
  const [initiatingMember, setInitiatingMember] = useState(authCtx.username);
  const [currMember, setCurrMember] = useState("All");

  function refresh() {
    setLocalData([]);
    setCurrDescription("");
    setCurrAmount(0);
    setCurrCategory("Food");
    setInitiatingMember(authCtx.username);
    setCurrMember("All");
  }

  function handleSubmitInitiatePayment() {
    let validForm = true;

    if (splitEvenly) {
      if (currAmount === 0) {
        setShowAmountWarning(true);
        validForm = false;
      } else {
        setShowAmountWarning(false);
      }
    } else {
      if (localData.filter((entry) => entry.amount === 0).length > 0) {
        setShowAmountWarning(true);
        validForm = false;
      } else {
        setShowAmountWarning(false);
      }
    }

    if (localData.length === 0) {
      setShowMemberWarning(true);
      validForm = false;
    } else {
      setShowMemberWarning(false);
    }

    if (localData.length === 1 && localData[0].username === initiatingMember) {
      setShowSelfPaymentWarning(true);
      validForm = false;
    } else {
      setShowSelfPaymentWarning(false);
    }

    if (!validForm) {
      return;
    }

    let hasInitiatingMember = false;

    const totalAmount = localData.reduce(
      (curr, next) => curr + Number(next.amount),
      0
    );

    const processedInformation = localData.map((entry) => {
      const json = {
        date: new Date(),
        username: entry.username,
        userID: grpCtx.findUserIDWithName(groupID, entry.username),
        targetUsername: initiatingMember,
        amount: Number(entry.amount),
        description: currDescription,
        category: currCategory,
        status: false,
      };
      if (entry.username === initiatingMember) {
        hasInitiatingMember = true;
        json.status = true;
        json.amount = Number(json.amount) - Number(totalAmount);
      }
      console.log(totalAmount);
      console.log(json.amount);
      return json;
    });

    if (!hasInitiatingMember) {
      processedInformation.push({
        date: new Date(),
        username: initiatingMember,
        userID: grpCtx.findUserIDWithName(groupID, initiatingMember),
        targetUsername: initiatingMember,
        amount: -1 * Number(totalAmount),
        description: currDescription,
        category: currCategory,
        status: true,
      });
    }

    const url = "http://localhost:8080/api/group/initiate-payment";
    fetch(url, {
      method: "POST",
      // body: JSON.stringify(base),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + initialToken,
      },
      body: JSON.stringify({
        groupID: groupID,
        userAmounts: processedInformation,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(res.json().data.message);
        }
      })
      .then((data) => {
        const newGroupData = data.data.group;
        grpCtx.updateGroupInformation(groupID, newGroupData);
        console.log("Successfully initiated payment");
        setShowSuccessText(true);
        refresh();
      });
  }

  function handleCurrAmount(e) {
    setCurrAmount(e.target.value);
    const updatedLocalAmounts = resetIndivAmount(splitEvenly)(
      localData,
      e.target.value
    );
    setLocalData(updatedLocalAmounts);
  }

  function resetIndivAmount(splitEvenlyState) {
    return (newLocalData, newCurrAmount) => {
      if (splitEvenlyState) {
        const updatedLocalAmounts = newLocalData.map((user) => {
          const toReturn = {
            ...user,
          };
          toReturn.amount = Number(newCurrAmount / newLocalData.length).toFixed(
            2
          );
          return toReturn;
        });
        return updatedLocalAmounts;
      } else {
        return newLocalData;
      }
    };
  }

  function handleAddMembers() {
    if (currMember === "All") {
      const newLocalData = [...groupInformation].map((entry) => {
        entry.amount = 0;
        return entry;
      });
      const updatedLocalAmounts = resetIndivAmount(splitEvenly)(
        newLocalData,
        currAmount
      );
      setLocalData(updatedLocalAmounts);
    } else {
      const newLocalData = [...localData];
      const entry = groupInformation.filter(
        (member) => member.username === currMember
      )[0];
      if (
        !localData.map((member) => member.username).includes(entry.username)
      ) {
        entry.amount = 0;
        newLocalData.push(entry);
        const updatedLocalAmounts = resetIndivAmount(splitEvenly)(
          newLocalData,
          currAmount
        );
        setLocalData(updatedLocalAmounts);
      }
    }
  }

  function handleCustomAmount(index) {
    return (e) => {
      const newLocalData = [...localData];
      newLocalData[index].amount = e.target.value;
      setLocalData(newLocalData);
    };
  }

  function handleDelete(index) {
    return () => {
      const newLocalData = [...localData];
      newLocalData.splice(index, 1);
      const updatedLocalAmounts = resetIndivAmount(splitEvenly)(
        newLocalData,
        currAmount
      );
      setLocalData(updatedLocalAmounts);
    };
  }

  const [showSuccessText, setShowSuccessText] = useState(false);
  const [showAmountWarning, setShowAmountWarning] = useState(false);
  const [showMemberWarning, setShowMemberWarning] = useState(false);
  const [showSelfPaymentWarning, setShowSelfPaymentWarning] = useState(false);

  return (
    <>
      {/* <h2 className={styles.header}> This Group </h2> */}
      <Row xs={1} xl={2}>
        <Col>
          <Form>
            <Form.Group className="mb-3" controlId="paymentFormDescription">
              <Form.Label>Description </Form.Label>
              <Form.Control
                value={currDescription}
                onChange={(e) => setCurrDescription(e.target.value)}
                placeholder="Enter Description"
              />
            </Form.Group>
            <Form.Group className="my-4" controlId="paymentFormSplit">
              <Form.Check
                type="switch"
                id="custom-switch"
                defaultChecked={!splitEvenly}
                onClick={() => {
                  setSplitEvenly(!splitEvenly);
                  const updatedLocalAmounts = resetIndivAmount(!splitEvenly)(
                    localData,
                    currAmount
                  );
                  setLocalData(updatedLocalAmounts);
                }}
                label="Split Differently?"
              />
            </Form.Group>
            {splitEvenly && (
              <Form.Group className="mb-3" controlId="paymentFormAmount">
                <Form.Label>Amount </Form.Label>
                <Form.Control
                  value={currAmount}
                  onChange={handleCurrAmount}
                  type="Number"
                  placeholder="Enter Amount"
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3" controlId="paymentFormCategory">
              <Form.Label>Category </Form.Label>
              <Form.Select
                value={currCategory}
                onChange={(e) => setCurrCategory(e.target.value)}
              >
                <option> Food </option>
                <option> Transport </option>
                <option> Bills </option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="initiatingMember">
              <Form.Label> Payment to </Form.Label>
              <Row className="align-items-right">
                <Col xs="auto">
                  <Form.Select
                    value={initiatingMember}
                    onChange={(e) => {
                      setInitiatingMember(e.target.value);
                    }}
                  >
                    {groupInformation.map((member) => {
                      return <option> {member.username} </option>;
                    })}
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3" controlId="paymentFormMembers">
              <Form.Label>Members </Form.Label>
              <Row className="align-items-right">
                <Col xs="auto">
                  <Form.Select
                    value={currMember}
                    onChange={(e) => {
                      setCurrMember(e.target.value);
                    }}
                  >
                    <option> All </option>
                    {groupInformation.map((member) => {
                      return <option> {member.username} </option>;
                    })}
                  </Form.Select>
                </Col>
                <Col xs="auto">
                  <Button onClick={handleAddMembers}> Add Members </Button>{" "}
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Col>
        <Col>
          <ListGroup>
            <ListGroup.Item className={styles.memberListTitle}>
              <Row>
                <Col xs={9} xl={7} xxl={9} className={styles.memberList}>
                  <p className="my-2"> Name</p>
                </Col>
                <Col xs={2} xl={3} xxl={2}>
                  <p className="my-2 ms-auto"> Amount </p>
                </Col>
                <Col xs={1} xl={2} xxl={1}>
                  <p className="my-2"> Action </p>
                </Col>
              </Row>
            </ListGroup.Item>
            {localData.map((entry, index) => {
              return (
                <ListGroup.Item>
                  <Row>
                    <Col xs={9} xl={7} xxl={9} className={styles.memberList}>
                      <p className={styles.tableLeftEntry}> {entry.username}</p>
                    </Col>
                    <Col xs={2} xl={3} xxl={2} className={styles.memberList}>
                      {splitEvenly && (
                        <p className={styles.tableCenterEntry + " ms-auto"}>
                          {entry.amount}
                        </p>
                      )}
                      {!splitEvenly && (
                        <Form.Control
                          type="number"
                          value={entry.amount}
                          onChange={handleCustomAmount(index)}
                        />
                      )}
                    </Col>
                    <Col xs={1} xl={2} xxl={1} className={styles.memberList}>
                      <CloseButton
                        className={styles.tableCenterEntry}
                        onClick={handleDelete(index)}
                      />
                    </Col>
                  </Row>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          <Button
            onClick={handleSubmitInitiatePayment}
            style={{ display: "flex" }}
            className="my-3"
          >
            {" "}
            Send Transaction Request{" "}
          </Button>{" "}
          {showSuccessText && (
            <p className={styles.success}> Payment successfully initiated!</p>
          )}
          {showAmountWarning && (
            <p className={styles.warning}> Amount cannot be 0!</p>
          )}
          {showMemberWarning && (
            <p className={styles.warning}> Memberlist cannot be empty!</p>
          )}
          {showSelfPaymentWarning && (
            <p className={styles.warning}> Cannot pay yourself!</p>
          )}
        </Col>
      </Row>
    </>
  );
}

export default PaymentForm;
