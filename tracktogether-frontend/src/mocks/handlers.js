// src/mocks/handlers.js
import { rest } from "msw";
const mockAuthToken = process.env.REACT_APP_AUTH_TOKEN;

export const handlers = [
  rest.post("http://localhost:8080/api/account/login", (req, res, ctx) => {
    localStorage.setItem("auth-token", mockAuthToken);
    return res(
      ctx.cookie("auth-token", mockAuthToken),
      ctx.json({
        data: {
          token: mockAuthToken,
          account: {
            _id: "123456789",
            username: "testuser",
            email: null,
            contact: null,
            password: "testpassword",
            image: "",
          },
        },
      })
    );
  }),

  rest.get("http://localhost:8080/api/account/quote", (req, res, ctx) => {
    const fakeQuoteData = [];
    for (let i = 0; i < 503; i++) {
      fakeQuoteData.push({
        quote: "Dummy Quote",
        author: "Dummy Author",
        tag: "money",
      });
    }

    return res(
      ctx.json({
        data: { quotes: fakeQuoteData },
      })
    );
  }),

  rest.get("http://localhost:8080/api/account/refresh", (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          account: {
            contact: 99118822,
            email: "testmode@xyz.com",
            id: "6296d34fb9f5fc8613765e15",
            image:
              "https://orbital.comp.nus.edu.sg/wp-content/uploads/sites/12/2020/04/cropped-cropped-STS-133_Discovery_Lift_Off_Launch_Pad_39A_KSC.jpg",
            username: "Chang",
          },
        },
      })
    );
  }),

  rest.get(
    "http://localhost:8080/api/account/transactions/",
    (req, res, ctx) => {
      return res(
        ctx.json({
          data: [
            {
              date: "2022-06-01",
              category: "Food",
              amount: 4.5,
              information: "Chicken Rice",
              mode: "Cash",
            },
            {
              date: "2022-05-03",
              category: "Food",
              amount: 3.3,
              information: "Earlier Dinner",
              mode: "Cash",
            },
            {
              date: "2022-06-30",
              category: "Food",
              amount: 1.2,
              information: "Later Chicken Rice",
              mode: "Cash",
            },
            {
              date: "2022-03-31",
              category: "Transport",
              amount: 40,
              information: "Top Up Card",
              mode: "Bank",
            },
            {
              date: "2021-11-02",
              category: "Transport",
              amount: 30,
              information: "Top Up Paylah",
              mode: "Bank",
            },
            {
              date: "2022-06-07",
              category: "Bills",
              amount: 5,
              information: "Weiming",
              mode: "Bank",
            },
            {
              date: "2022-07-05",
              category: "Food",
              amount: 44,
              information: "Valid",
              mode: "PayLah",
            },
          ],
        })
      );
    }
  ),
  rest.get("http://localhost:8080/api/account/alerts/", (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          pending: [
            {
              group: "27",
              user: "Test",
              contact: 999,
              amount: -16.5,
              payeeHasPaid: true,
            },
            {
              group: "27",
              user: "Test",
              contact: 999,
              amount: -27.5,
              payeeHasPaid: true,
            },
            {
              group: "27",
              user: "Test",
              contact: 999,
              amount: -38.5,
              payeeHasPaid: true,
            },
            {
              group: "26",
              user: "Test",
              contact: 999,
              amount: -26.5,
              payeeHasPaid: true,
            },
          ],
        },
      })
    );
  }),

  rest.get("http://localhost:8080/api/account/adjustment/", (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          adjustments: [
            {
              groupID: 25,
              description: "",
              category: "Food",
              amount: -26,
              date: "2022-06-14T14:41:50.493Z",
            },
            {
              groupID: 25,
              description: "",
              category: "Food",
              amount: -82,
              date: "2022-06-14T14:52:21.124Z",
            },
            {
              groupID: 25,
              description: "",
              category: "Food",
              amount: 25.43,
              date: "2022-06-14T14:52:49.091Z",
            },
            {
              groupID: 25,
              description: "",
              category: "Food",
              amount: -66.67,
              date: "2022-06-14T14:53:17.727Z",
            },
            {
              groupID: 25,
              description: "",
              category: "Food",
              amount: -20,
              date: "2022-06-15T04:30:26.712Z",
            },
            {
              groupID: 25,
              description: "",
              category: "Food",
              amount: 15,
              date: "2022-06-15T04:31:04.519Z",
            },
            {
              groupID: 25,
              description: "",
              category: "Food",
              amount: -36,
              date: "2022-06-15T13:07:40.735Z",
            },
          ],
        },
      })
    );
  }),

  rest.get("http://localhost:8080/api/group/summary/", (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          groups: [
            {
              _id: "62ab5bd083b62f1eb62cba91",
              groupID: 26,
              name: "Final Group",
              users: [
                {
                  userID: "62852d14922165f203899595",
                  username: "Test",
                  contact: 999,
                  amount: 15,
                },
                {
                  userID: "6296d34fb9f5fc8613765e15",
                  username: "Chang",
                  contact: 99118822,
                  amount: -15,
                },
              ],
              log: [
                {
                  date: "2022-06-21T07:25:20.371Z",
                  username: "Test",
                  userID: "62852d14922165f203899595",
                  targetUsername: "Chang",
                  amount: 15,
                  description: "",
                  category: "Food",
                  status: false,
                },
                {
                  date: "2022-06-21T07:25:20.371Z",
                  username: "Chang",
                  userID: "6296d34fb9f5fc8613765e15",
                  targetUsername: "Chang",
                  amount: -15,
                  description: "",
                  category: "Food",
                  status: true,
                },
              ],
            },
            {
              _id: "62ade35335550b29ec65d872",
              groupID: 27,
              name: "Malaysia",
              users: [
                {
                  userID: "6296d34fb9f5fc8613765e15",
                  username: "Chang",
                  contact: 99118822,
                  amount: -6,
                },
                {
                  userID: "62852d14922165f203899595",
                  username: "Test",
                  contact: 999,
                  amount: 6,
                },
              ],
              log: [
                {
                  date: "2022-06-20T15:11:04.322Z",
                  username: "Chang",
                  userID: "6296d34fb9f5fc8613765e15",
                  targetUsername: "Chang",
                  amount: -11.5,
                  description: "",
                  category: "Food",
                  status: true,
                },
                {
                  date: "2022-06-20T15:11:04.322Z",
                  username: "Test",
                  userID: "62852d14922165f203899595",
                  targetUsername: "Chang",
                  amount: 11.5,
                  description: "",
                  category: "Food",
                  status: true,
                },
                {
                  date: "2022-06-20T15:11:12.151Z",
                  username: "Chang",
                  userID: "6296d34fb9f5fc8613765e15",
                  targetUsername: "Chang",
                  amount: -27.5,
                  description: "",
                  category: "Food",
                  status: true,
                },
                {
                  date: "2022-06-20T15:11:12.151Z",
                  username: "Test",
                  userID: "62852d14922165f203899595",
                  targetUsername: "Chang",
                  amount: 27.5,
                  description: "",
                  category: "Food",
                  status: true,
                },
                {
                  date: "2022-06-20T15:13:44.924Z",
                  username: "Chang",
                  userID: "6296d34fb9f5fc8613765e15",
                  targetUsername: "Test",
                  amount: 33,
                  description: "",
                  category: "Food",
                  status: false,
                },
                {
                  date: "2022-06-20T15:13:44.925Z",
                  username: "Test",
                  userID: "62852d14922165f203899595",
                  targetUsername: "Test",
                  amount: -33,
                  description: "",
                  category: "Food",
                  status: true,
                },
              ],
            },
          ],
        },
      })
    );
  }),
];
