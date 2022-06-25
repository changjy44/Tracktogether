function getMinimumTransactions(debt) {
  //Returns [arrayOfTransactions];
  let newDebt = [...debt];

  newDebt = newDebt.map((number) => {
    // We are multplying the number by 100 so that it can be round to 2 decimal places.
    return Math.round(100 * number);
  });

  let total = 0;

  for (let i = 0; i < newDebt.length; i++) {
    if (i === newDebt.length - 1) {
      newDebt[i] = -total;
    } else {
      total += newDebt[i];
    }
  }

  // Function only works with debts of integers.
  function helper(curr, debt, transactions) {
    while (curr < debt.length && debt[curr] === 0) {
      curr++;
    }

    if (curr === debt.length) {
      return transactions;
    }

    let minTransactions = null;

    for (let i = curr + 1; i < debt.length; i++) {
      if (debt[i] * debt[curr] < 0) {
        debt[i] += debt[curr];
        if (minTransactions === null) {
          minTransactions = helper(curr + 1, debt, [
            ...transactions,
            [curr, i, debt[curr]],
          ]);
        } else {
          if (
            helper(curr + 1, debt, [...transactions, [curr, i, debt[curr]]])
              .length < minTransactions.length
          ) {
            minTransactions = helper(curr + 1, debt, [
              ...transactions,
              [curr, i, debt[curr]],
            ]);
          }
        }
        debt[i] -= debt[curr];
        //let recursiveCase = helper(curId + 1, debt, [...transactions, [currId, i, debt[currId]]]);
        //if (helper(curId + 1, debt, transactions) + 1 < )
      }
    }

    return minTransactions;
  }

  let result = helper(0, newDebt, []);

  // We are dividing the amount here by 100, as 100 was multiplied to the amount initially.
  result = result.map((entry) => {
    if (entry[2] < 0) {
      return [entry[1], entry[0], -entry[2] / 100];
    } else {
      return [entry[0], entry[1], entry[2] / 100];
    }
  });

  return result;
}

exports.getMinimumTransactions = getMinimumTransactions;
