import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {

  GymSignIn,
  GymSignOut,
  updateServicesFees,
} from "./AuthApi";
import {
  addExpenseAsync,
  addTeamAsync,
  deleteExpenseAsync,
  deleteTeamAsync,
  EditExpenseAsync,
  updateTeamAsync,
} from "../gym/GymSlice";

const initialState = {
  loggedGym: null,
  status: "idle",
  error: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

};

export const SignInAsync = createAsyncThunk(
  "auth/signin",
  async (body, { rejectWithValue }) => {
    try {
      const response = await GymSignIn(body);
      console.log(response, "gymResponse");
      return response;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message.msg || "Failed to login");
    }
  }
);

export const logOutAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GymSignOut();
      console.log(response, "gymResponse");
      return response;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error?.message || "Failed to logout");
    }
  }
);

export const updateServicesFeesAsync = createAsyncThunk(
  "gym/updateServicesFees",
  async ({ services, serviceChange }, { rejectWithValue }) => {
    try {
      const response = await updateServicesFees({ services, serviceChange });
      console.log(response, "gymResponse");
      return response.gym;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to update member");
    }
  }
);


// restore Gym data on refersh

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreGymOnRefresh: (state) => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const gym = JSON.parse(localStorage.getItem("user"));
      // console.log(accessToken, refreshToken, gym, "localstorage");
      state.loggedGym = gym;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(SignInAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(SignInAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.loggedGym = action.payload.gym;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(SignInAsync.rejected, (state, action) => {
        state.status = "idle";
        console.log(action.payload, "action.payload");
        state.error = action.payload;
      });
    builder
      .addCase(logOutAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(logOutAsync.fulfilled, (state, action) => {
        state.isAuthenticated = false;
        state.gym = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.status = "idle";
      })
      .addCase(logOutAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      });
    builder
      .addCase(updateServicesFeesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateServicesFeesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        console.log(action.payload, "action payload");

        // Update the state with the gym object
        state.loggedGym = action.payload; // This is now the gym object from the response
      })
      .addCase(updateServicesFeesAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
    builder
      .addCase(addTeamAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTeamAsync.fulfilled, (state, action) => {
        state.status = "idle";
        console.log(action.payload, "action payload");

        // Update the state with the gym object
        state.loggedGym = action.payload; // This is now the gym object from the response
      })
      .addCase(addTeamAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
    builder
      .addCase(deleteTeamAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTeamAsync.fulfilled, (state, action) => {
        state.status = "idle";
        console.log(action.payload, "action payload");

        // Update the state with the gym object
        state.loggedGym = action.payload; // This is now the gym object from the response
      })
      .addCase(deleteTeamAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
    builder
      .addCase(updateTeamAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTeamAsync.fulfilled, (state, action) => {
        state.status = "idle";
        console.log(action.payload, "action payload");

        // Update the state with the gym object
        state.loggedGym = action.payload; // This is now the gym object from the response
      })
      .addCase(updateTeamAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
    builder
      .addCase(addExpenseAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addExpenseAsync.fulfilled, (state, action) => {
        state.status = "idle";
        console.log(action.payload, "action payload");

        // Update the state with the gym object
        state.loggedGym = action.payload; // This is now the gym object from the response
      })
      .addCase(addExpenseAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
    builder
      .addCase(deleteExpenseAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteExpenseAsync.fulfilled, (state, action) => {
        state.status = "idle";
        console.log(action.payload, "action payload");

        // Update the state with the gym object
        state.loggedGym = action.payload; // This is now the gym object from the response
      })
      .addCase(deleteExpenseAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
    builder
      .addCase(EditExpenseAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(EditExpenseAsync.fulfilled, (state, action) => {
        state.status = "idle";
        console.log(action.payload, "action payload");

        // Update the state with the gym object
        state.loggedGym = action.payload; // This is now the gym object from the response
      })
      .addCase(EditExpenseAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });

  },
});

export const selectLoggedGym = (state) => state.auth.loggedGym;
export const authError = (state) => state.auth?.error;
export const selectAuthstatus = (state) => state.auth?.status;
export const { restoreGymOnRefresh } = AuthSlice.actions;

export default AuthSlice.reducer;
