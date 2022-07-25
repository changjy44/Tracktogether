function validateData(data) {
  return data.length >= 24;
}

function transformInputData(data) {
  data = data.sort(
    (a, b) =>
      new Date(`${a._id.year}-${a._id.month}`) -
      new Date(`${b._id.year}-${b._id.month}`)
  );
  const firstMonth = data[0]._id.month;
  const firstYear = data[0]._id.year;
  let transformedData = [];
  for (
    var d = new Date(firstYear, firstMonth);
    d <= new Date();
    d.setMonth(d.getMonth() + 1)
  ) {
    transformedData.push({ month: d.getMonth(), year: d.getFullYear() });
  }
  transformedData = transformedData.map((date) => {
    const filteredObj = data.filter(
      (item) => item._id.month === date.month && item._id.year === date.year
    );
    if (filteredObj.length > 0) {
      return filteredObj[0];
    } else {
      const obj = {
        _id: {
          month: date.month,
          year: date.year,
        },
        amount: 0,
      };
      return obj;
    }
  });
  return transformedData.map((item) => item.amount);
}

// function transformInputData(data) {
//   data = data.sort(
//     (a, b) =>
//       new Date(`${a._id.year}-${a._id.month}`) -
//       new Date(`${b._id.year}-${b._id.month}`)
//   );
//   let transformedData = [data[0]];
//   let currMonth = data[0]._id.month;
//   let currYear = data[0]._id.year;
//   for (let item of data.slice(1)) {
//     const nextMonth = (currMonth + 1) % 12;
//     const nextYear = currMonth + 1 === 12 ? currYear + 1 : currYear;
//     if (item._id.month === nextMonth && item._id.year === nextYear) {
//       transformData.push(item);
//       currMonth = nextMonth;
//       currYear = nextYear;
//     } else {
//       while (item._id.month != nextMonth || item._id.year != nextYear) {
//         let zeroAmtItem = {
//           _id: {
//             month: nextMonth,
//             year: nextYear,
//           },
//           amount: 0,
//         };
//         transformedData.push(zeroAmtItem);
//         currMonth = nextMonth;
//         currYear = nextYear;
//       }
//     }
//   }
//   return transformedData;
// }

function transformOutputData(data) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let currMonth = new Date().getMonth() + 1;
  let transformedData = [];
  for (let i = 0; i < 12; i++) {
    currMonth = currMonth === 12 ? 0 : currMonth;
    let obj = {
      month: months[currMonth],
      amount: Math.round(data[i] * 100) / 100,
    };
    transformedData.push(obj);
    currMonth++;
  }
  return transformedData;
}

exports.validateData = validateData;
exports.transformInputData = transformInputData;
exports.transformOutputData = transformOutputData;
