import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  addExpense,
  addTeam,
  deleteExpense,
  deleteTeam,
  EditExpense,
  FetchGym,
  getPaymentHistory,
  updateTeam,

} from "./GymApi";

const initialState = {
  status: "idle",
  error: null,
  payHistory: [],
  revenueAndProfiit: null,
  monthlyActiveMember:null
};

const fetchGymAsync = createAsyncThunk(
  "gym/fetchGym",
  async (gymId, { rejectWithValue }) => {
    try {
      const response = await FetchGym(gymId);
      console.log(response, "gymResponse");
      return response.data;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to update member");
    }
  }
);

export function calculateIncreaseDecresePercentage(prevCharge, currentCharge) {
  if (prevCharge === 0) {
    return currentCharge > 0 ? 100 : 0; // If previous charge was 0, return 100% increase
  }
  let increase;
  if (prevCharge > currentCharge) {
    increase = ((prevCharge - currentCharge) / prevCharge) * 100;
  } else {
    increase = ((currentCharge - prevCharge) / prevCharge) * 100;
  }

  return increase.toFixed(); // Return percentage increase with two decimal points
}

export const addTeamAsync = createAsyncThunk(
  "gym/add-team",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data, "teamsdata");
      const response = await addTeam(data);
      console.log(response, "gymResponse");
      return response.data;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to add team");
    }
  }
);
export const deleteTeamAsync = createAsyncThunk(
  "gym/delete-team",
  async (id, { rejectWithValue }) => {
    try {
      // console.log(data,"teamsdata")
      const response = await deleteTeam(id);
      console.log(response, "gymResponse");
      return response.data;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to add team");
    }
  }
);
export const updateTeamAsync = createAsyncThunk(
  "gym/update-team",
  async (body, { rejectWithValue }) => {
    try {
      // console.log(data,"teamsdata")
      const response = await updateTeam(body);
      console.log(response, "gymResponse");
      return response.data;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to add team");
    }
  }
);
export const addExpenseAsync = createAsyncThunk(
  "gym/add-expense",
  async (body, { rejectWithValue }) => {
    try {
      // console.log(data,"teamsdata")
      const response = await addExpense(body);
      console.log(response, "gymResponse");
      return response.data;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to add team");
    }
  }
);
export const deleteExpenseAsync = createAsyncThunk(
  "gym/delete-expense",
  async (id, { rejectWithValue }) => {
    try {
      // console.log(data,"teamsdata")
      const response = await deleteExpense(id);
      console.log(response, "gymResponse");
      return response.data;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to add team");
    }
  }
);
export const EditExpenseAsync = createAsyncThunk(
  "gym/update-expense",
  async (body, { rejectWithValue }) => {
    try {
      // console.log(data,"teamsdata")
      const response = await EditExpense(body);
      console.log(response, "gymResponse");
      return response.data;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to add team");
    }
  }
);

export const getPaymentHistoryAsync = createAsyncThunk(
  "gym/get-payHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPaymentHistory();
      console.log(response.data, "gymResponse"); // Ensure this logs the correct data
      return response.data; // Ensure this is the correct field containing the data
    } catch (error) {
      console.error(error, "err"); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to fetch pay history");
    }
  }
);

export function calculateRevenueProfitAndGrowth(payHistory, expenses, teams) {
  console.log(payHistory,"check");
  console.log(expenses,"check1");
  console.log(teams,"check3");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Months are 0-based
  const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const previousYear = currentYear - 1;

  // Helper function to get monthly revenue
  const getMonthlyRevenue = (month, year) => {
    return payHistory
      .filter((payment) => {
        const paymentDate = new Date(payment.createdAt);
        return (
          paymentDate.getFullYear() === year &&
          paymentDate.getMonth() + 1 === month
        );
      })
      .reduce((total, payment) => total + payment.amount, 0);
  };

  // Helper function to get monthly expenses
  const getMonthlyExpenses = (month, year) => {
    console.log(month,year,'test');

    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.createdAt);
        return (
          expenseDate.getFullYear() == year &&
          expense.month == new Date(0, month-1).toLocaleString("en", { month: "long" }) // Subtract 1 from month to account for zero-based indexing
        );
      })
      .reduce((total, expense) => total + expense.totalAmount, 0);
  };


  // Revenue and expenses for current month and previous month
  const currentMonthRevenue = getMonthlyRevenue(currentMonth, currentYear);
  console.log(currentMonthRevenue,"currentMonthRevenue")
  const previousMonthRevenue = getMonthlyRevenue(
    previousMonth,
    currentMonth === 1 ? previousYear : currentYear
  );

  // Revenue for the current year and previous year
  const currentYearRevenue = payHistory
    .filter(
      (payment) => new Date(payment.createdAt).getFullYear() === currentYear
    )
    .reduce((total, payment) => total + payment.amount, 0);

  const previousYearRevenue = payHistory
    .filter(
      (payment) => new Date(payment.createdAt).getFullYear() === previousYear
    )
    .reduce((total, payment) => total + payment.amount, 0);

  // Expenses for current month and previous month
  const currentMonthExpenses = getMonthlyExpenses(currentMonth, currentYear);
  console.log(currentMonthExpenses,"currentMonthExpenses")
  const previousMonthExpenses = getMonthlyExpenses(
    previousMonth,
    currentMonth === 1 ? previousYear : currentYear
  );

  // Expenses for the current year and previous year
  const currentYearExpenses = expenses
    .filter(
      (expense) => new Date(expense.createdAt).getFullYear() === currentYear
    )
    .reduce((total, expense) => total + expense.totalAmount, 0);

  const previousYearExpenses = expenses
    .filter(
      (expense) => new Date(expense.createdAt).getFullYear() === previousYear
    )
    .reduce((total, expense) => total + expense.totalAmount, 0);

  // Total team salary (monthly, assuming all active)
  const teamSalaryTotal = teams.reduce(
    (total, team) => total + team.teamSalary,
    0
  );

  // Profit calculations
  const currentMonthProfit =
    currentMonthRevenue - currentMonthExpenses - teamSalaryTotal;
    console.log(currentMonthProfit,"currentMonthProfit")
  const previousMonthProfit =
    previousMonthRevenue - previousMonthExpenses - teamSalaryTotal;



  const currentYearProfit =
    currentYearRevenue - currentYearExpenses - teamSalaryTotal * 12; // Annual salary

  const previousYearProfit =
    previousYearRevenue - previousYearExpenses - teamSalaryTotal * 12;

  // Updated Growth Calculation (handle negative growth)
  const calculateGrowth = (current, previous) => {
    // Handle case where both current and previous values are negative
    if (previous === 0) return current > 0 ? 100 : -100; // Return -100% if previous is 0 and current is negative

    const growth = ((current - previous) / Math.abs(previous)) * 100;

    // If the current value is negative, return negative growth
    if (current < 0) {
      return growth < 0 ? growth : -Math.abs(growth);
    }

    return growth;
  };

  const currentMonthRevenueGrowth = calculateGrowth(
    currentMonthRevenue,
    previousMonthRevenue
  );
  const currentYearRevenueGrowth = calculateGrowth(
    currentYearRevenue,
    previousYearRevenue
  );

  const currentMonthProfitGrowth = calculateGrowth(
    currentMonthProfit,
    previousMonthProfit
  );
  const currentYearProfitGrowth = calculateGrowth(
    currentYearProfit,
    previousYearProfit
  );

  return {
    currentMonthRevenue,
    currentYearRevenue,
    currentMonthProfit: parseFloat(currentMonthProfit.toFixed(2)),
    currentYearProfit: parseFloat(currentYearProfit.toFixed(2)),
    currentMonthRevenueGrowth: parseFloat(currentMonthRevenueGrowth.toFixed(2)),
    currentYearRevenueGrowth: parseFloat(currentYearRevenueGrowth.toFixed(2)),
    currentMonthProfitGrowth: parseFloat(currentMonthProfitGrowth.toFixed(2)),
    currentYearProfitGrowth: parseFloat(currentYearProfitGrowth.toFixed(2)),
  };
}

export function calculateAverageMembers(payHistory, gymCreationDate) {
  const totalPayments = payHistory.length; // Number of payments represents number of members

  // Calculate the number of months since the gym was created
  const gymCreation = new Date(gymCreationDate);
  const currentDate = new Date();
  const totalMonths =
    (currentDate.getFullYear() - gymCreation.getFullYear()) * 12 +
    currentDate.getMonth() - gymCreation.getMonth() +
    1; // Including the current month

  // Calculate the average number of members per month
  const averageMembersPerMonth = totalPayments / totalMonths;

  return averageMembersPerMonth.toFixed(2);
}




// console.log("Average Members Per Month:", averageMembers);



export function formatCurrency(amount) {
  const absAmount = Math.abs(amount); // Get absolute value for formatting
  let formattedAmount = "";

  if (absAmount >= 10000000) {
    // 1 crore or more
    formattedAmount = (absAmount / 10000000).toFixed(2) + " cr";
  } else if (absAmount >= 100000) {
    // 1 lakh or more
    formattedAmount = (absAmount / 100000).toFixed(2) + " lac";
  } else if (absAmount >= 1000) {
    // 1 thousand or more
    formattedAmount = (absAmount / 1000).toFixed(2) + " k";
  } else {
    // less than 1 thousand
    formattedAmount = absAmount.toFixed(2);
  }

  // If the original amount was negative, add a negative sign back
  return amount < 0 ? `-${formattedAmount}` : formattedAmount;
}


export const GymSlice = createSlice({
  name: "gym",
  initialState,
  reducers: {
    RevenueAndProfit: (state) => {
      const gym = JSON.parse(localStorage.getItem("user"));
      const revenue = calculateRevenueProfitAndGrowth(
        state.payHistory,
        gym.expenses,
        gym.teams
      );
      state.revenueAndProfiit = revenue;
    },
    AverageMonthlyActiveMember: (state) => {
      const gym = JSON.parse(localStorage.getItem("user"));
      const averageMembers = calculateAverageMembers(state.payHistory, gym.createdAt);
      state.monthlyActiveMember = averageMembers;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGymAsync.pending, (action, state) => {
        state.status = "loading";
      })
      .addCase(fetchGymAsync.fulfilled, (action, state) => {
        state.status = "idle";
        state.loggedGym = action.payload;
      })
      .addCase(fetchGymAsync.rejected, (action, state) => {
        state.status = "idle";
        state.error = action.payload;
      });
    builder
      .addCase(getPaymentHistoryAsync.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(getPaymentHistoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        console.log(state, "state");
        state.payHistory = action.payload;
      })
      .addCase(getPaymentHistoryAsync.rejected, (state, action) => {
        state.status = "idle";

        state.error = action.payload;
      });
  },
});

// export const SelectGymId = (state) => state.gym.gymId;
// export const SelectGym = (state) => state.gym.loggedGym;
export const selectGymstatus = (state) => state.gym?.status;
export const selectGymError = (state) => state.gym?.error;
export const selectAllPaymentHistory = (state) => state.gym?.payHistory;
export const selectRevenueProfit = (state) => state.gym?.revenueAndProfiit;
export const monthlyActiveMember = (state) => state.gym?.monthlyActiveMember;
export const { RevenueAndProfit } = GymSlice.actions;
export const { AverageMonthlyActiveMember } = GymSlice.actions;
export default GymSlice.reducer;
