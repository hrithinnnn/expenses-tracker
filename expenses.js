// Initialize the arrays to store the transactions
let incomeList = [];
let expenseList = [];
let incomeIndex = 0;
let expenseIndex = 0;

// Check if local storage has any saved transactions and retrieve them
if (localStorage.getItem("incomeList")) {
  incomeList = JSON.parse(localStorage.getItem("incomeList"));
}
if (localStorage.getItem("expenseList")) {
  expenseList = JSON.parse(localStorage.getItem("expenseList"));
}

// Function to add a transaction to the income or expense list
function addTransaction() {
  let res = validateInput();
  if (res) {
    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value;
    const amount = document.getElementById("amount").value;

    if (description && amount) {
      if (type === "income") {
        const date = new Date()
        let incomeDay = date.getDate()
        let incomeMonth = date.getMonth() + 1
        let incomeYear = date.getFullYear()
        const incomeTime = date.getTime();
        incomeIndex = generateRandomIncomeId();
        // var index = expenseList.findIndex(obj => obj.expenseIndex==id);
        incomeList.push({ incomeTime, incomeDay, incomeMonth, incomeYear, incomeIndex, description, amount });
        localStorage.setItem("incomeList", JSON.stringify(incomeList));
      } else if (type === "expense") {
        const date = new Date()
        let expenseDay = date.getDate()
        let expenseMonth = date.getMonth() + 1
        let expenseYear = date.getFullYear()
        const expenseTime = date.getTime();
        expenseIndex = generateRandomExpenseId();
        //let expenseDate = `${month}-${day}-${year}`
        // console.log(fullDate)
        expenseList.push({ expenseTime, expenseDay, expenseMonth, expenseYear, expenseIndex, description, amount });
        expenseIndex++;
        localStorage.setItem("expenseList", JSON.stringify(expenseList));
      }

      document.getElementById("description").value = "";
      document.getElementById("amount").value = "";

      updateValues();
    }
  }
}

// Function to display the income and expense transactions and the net expenses
function showTransactions() {
  let incomeHTML = "";
  let expenseHTML = "";
  // let incomeIndex=0;
  let totalIncome = 0;
  incomeList.forEach((income) => {
    incomeHTML += `<li> ${income.description}: ${income.amount}<button style="background:transparent; float:right; font-size:15px" class="delete-btn" onclick="deleteIncome(${income.incomeIndex})">❌</button><button style="float:right;" class="delete-btn" onclick="editIncome(${income.incomeIndex})">edit</button></li>`;
    totalIncome += parseInt(income.amount);
  });
  document.getElementById("income-list").innerHTML = incomeHTML;

  let totalExpense = 0;
  expenseList.forEach((expense) => {
    expenseHTML += `<li> ${expense.description}: ${expense.amount}<button style="background:transparent; float:right; font-size:15px" class="delete-btn" onclick="deleteExpense(${expense.expenseIndex})">❌</button><button style="float:right;"onclick="editExpense(${expense.expenseIndex})">edit</button></li>`;
    totalExpense += parseInt(expense.amount);
  });
  document.getElementById("expense-list").innerHTML = expenseHTML;

  let netExpenses = totalIncome - totalExpense;
  document.getElementById("net-expenses").innerHTML = netExpenses;
}

// Function to show the daily expenses
function showDailyExpense() {
  let dailyExpense = 0;
  const date = new Date()
  let today = date.getDate()
  // const today = new Date().toISOString().slice(0, 10);
  console.log(today)
  expenseList.forEach((expense) => {
    if (expense.expenseDay === today) {
      dailyExpense -= parseInt(expense.amount);
    }
  });
  incomeList.forEach((income) => {
    if (income.incomeDay === today) {
      dailyExpense += parseInt(income.amount);
    }
  });
  let d = document.getElementById('daily-expense');
  d.innerHTML = `${dailyExpense}`;
}

// Function to show the weekly expenses
function showWeeklyExpense() {
  let weeklyExpense = 0;
  const today = new Date().getTime();
  const oneWeekAgo = today - 7 * 24 * 60 * 60 * 1000;
  expenseList.forEach((expense) => {
    //const expenseDate = new Date(expense.date).getTime();
    if (expense.expenseTime >= oneWeekAgo && expense.expenseTime <= today) {
      weeklyExpense -= parseInt(expense.amount);
    }
  });
  incomeList.forEach((income) => {
    //const incomeDate = new Date(income.date).getTime();
    if (income.incomeTime >= oneWeekAgo && income.incomeTime <= today) {
      weeklyExpense += parseInt(income.amount);
    }
  });
  let d = document.getElementById('weekly-expense');
  d.innerHTML = `${weeklyExpense}`;
}

// Function to show the monthly expenses
function showMonthlyExpense() {
  let monthlyExpense = 0;
  const date = new Date();
  let thisMonth = date.getMonth() + 1;
  expenseList.forEach((expense) => {
    if (expense.expenseMonth === thisMonth) {
      monthlyExpense -= parseInt(expense.amount);
    }
  });
  incomeList.forEach((income) => {
    if (income.incomeMonth === thisMonth) {
      monthlyExpense += parseInt(income.amount);
    }
  });
  let d = document.getElementById('monthly-expense');
  d.innerHTML = `${monthlyExpense}`;
}
function showYearlyExpense() {
  let yearlyExpense = 0;
  const date = new Date();
  let thisYear = date.getFullYear()
  expenseList.forEach((expense) => {
    if (expense.expenseYear === thisYear) {
      yearlyExpense -= parseInt(expense.amount);
    }
  });
  incomeList.forEach((income) => {
    if (income.incomeYear === thisYear) {
      yearlyExpense += parseInt(income.amount);
    }
  });
  let d = document.getElementById('yearly-expense');
  d.innerHTML = `${yearlyExpense}`;
}

// Call
function validateInput() {
  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;

  if (!description || !amount) {
    alert("Please enter a description and amount");
    return false;
  }

  if (isNaN(amount) || parseInt(amount) <= 0) {
    alert("Please enter a valid amount");
    return false;
  }

  return true;
}

// Function to edit an expense
function editExpense(id) {
  const expenseToEdit = expenseList.filter(item => item.expenseIndex == id)
  // const expenseToEdit = expenseList[index];
  var index = expenseList.findIndex(obj => obj.expenseIndex == id);
  const idx = expenseList[index].expenseIndex;
  const time = expenseList[index].expenseTime;
  const day = expenseList[index].expenseDay;
  const month = expenseList[index].expenseMonth;
  const year = expenseList[index].expenseYear;
  console.log(expenseList[index], index);
  const newDescription = prompt("Enter new description", expenseToEdit.description);
  const newAmount = prompt("Enter new amount", expenseToEdit.amount);

  if (newDescription && newAmount) {
    expenseList[index] = { expenseTime: time, expenseDay: day, expenseMonth: month, expenseYear: year, expenseIndex: idx, description: newDescription, amount: newAmount };
    localStorage.setItem("expenseList", JSON.stringify(expenseList));
    updateValues();
  }
}
function editIncome(id) {
  const incomeToEdit = incomeList.filter(item => item.incomeIndex == id)
  // const incomeToEdit = incomeList[index];
  var index = incomeList.findIndex(obj => obj.incomeIndex == id);
  const idx = incomeList[index].incomeIndex;
  const time = incomeList[index].incomeTime;
  const day = incomeList[index].incomeDay;
  const month = incomeList[index].incomeMonth;
  const year = incomeList[index].incomeYear;
  console.log(incomeList[index], index);
  const newDescription = prompt("Enter new description", incomeToEdit.description);
  const newAmount = prompt("Enter new amount", incomeToEdit.amount);

  if (newDescription && newAmount) {
    incomeList[index] = { incomeTime: time, incomeDay: day, incomeMonth: month, incomeYear: year, incomeIndex: idx, description: newDescription, amount: newAmount };
    localStorage.setItem("incomeList", JSON.stringify(incomeList));
    updateValues();
  }
}

// Function to delete an income
// Function to delete an expense

function deleteExpense(index) {
  // expenseList.splice(index, 1);
  expenseList = expenseList.filter(item => item.expenseIndex !== index);
  localStorage.setItem("expenseList", JSON.stringify(expenseList));
  updateValues();


}

function findExpenseId(id) {
  const expense = expenseList.find(expense => expense.expenseIndex === id);
  if (expense) {
    deleteExpense(expense.id);
  }
  return null;
}

function deleteIncome(index) {
  // incomeList.splice(index, 1);
  incomeList = incomeList.filter(item => item.incomeIndex !== index);
  localStorage.setItem("incomeList", JSON.stringify(incomeList));
  updateValues();
}
onload = updateValues();


//income and expense delete and edit
//add recurring expenses also
// make it a mobile app??

function generateRandomExpenseId() {
  do {
    rand = Math.random();
    var index = expenseList.findIndex(obj => obj.expenseIndex == rand);
  } while (index != -1);
  return rand;
}

function generateRandomIncomeId() {
  do {
    rand = Math.random();
    var index = incomeList.findIndex(obj => obj.incomeIndex == rand);
  } while (index != -1);
  return rand;
}

function updateValues() {
  showTransactions();
  showDailyExpense();
  showMonthlyExpense();
  showWeeklyExpense();
  showYearlyExpense();
  updateNumberColor();  
}

function updateNumberColor() {
  // n=document.getElementsByClassName('number');
  let n = document.getElementsByClassName("numbers");
  for (let i = 0; i < n.length; i++) {
    if (parseInt(n[i].innerHTML) < 0) {
      //n[i].innerHTML = Math.abs(parseInt(n[i].innerHTML));
      n[i].style.color = "red";
    }
    else {
      n[i].style.color = "green";
    }
  }
}