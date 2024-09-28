import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  deleteMember,
  FetchMembers,
  FilterMember,
  getFeesHistory,
  getMemberById,
  joinMember,
  memberUpadte,
  updateMemberFees,
} from "./MembersApi";

const initialState = {
  members: [],
  member: {},
  allMemebers: [],
  status: "idle",
  membersPerPage: 6,
  totalMembers: "",
  selectedMember: null,
  error: [],
  feesHistory: [],
  // fees
  // strengthFees: 600,
  // cardioMaleFees: 700,
  // cardioFemaleFees: 800,
  // personalTrainingFees: 1500,
};

export const FetchAllMembersAsync = createAsyncThunk(
  "member/FetchMembers",
  async (__,{rejectWithValue}) => {
    try {
      const response = await FetchMembers();
      return response.members;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to update member fees");
    }
  }
);

// sort ,pagination,search
export const FilterMemberAsync = createAsyncThunk(
  "member/Filtermember",
  async ({ sort, pagination, search_qurey, filter }) => {
    const response = await FilterMember(sort, pagination, search_qurey, filter);

    return response;
  }
);

export const joinMemberAsync = createAsyncThunk(
  "member/joinmember",
  async (data, { rejectWithValue }) => {
    try {
      const response = await joinMember(data);
      return response;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to register member");
    }
  }
);
export const deleteMemberAsync = createAsyncThunk(
  "member/deletemember",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteMember(id);
      return response;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to delete member");
    }
  }
);

export const getMemberByIdAsync = createAsyncThunk(
  "member/getMemeberById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getMemberById(id);
      console.log(response, "editresponse");
      return response.user;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to get member");
    }
  }
);
export const memberUpadteAsync = createAsyncThunk(
  "member/memberUpadte",
  async (data, { rejectWithValue }) => {
    console.log(data, "userData");
    try {
      const response = await memberUpadte(data);
      console.log(response, "editresponse");
      return response;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to update member");
    }
  }
);
export const getFeesHistoryAsync = createAsyncThunk(
  "member/getFeesHistory",
  async (id, { rejectWithValue }) => {
    // console.log(data,"userData")
    try {
      const response = await getFeesHistory(id);
      console.log(response, "editresponse");
      return response;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to update member");
    }
  }
);

export const updateMemberFeesAsync = createAsyncThunk(
  "member/updateFees",
  async (data, { rejectWithValue }) => {
    // console.log(data,"userData")
    try {
      const response = await updateMemberFees(data);
      return response;
    } catch (error) {
      console.error(error); // Log the error for debugging
      return rejectWithValue(error.message || "Failed to update member fees");
    }
  }
);
export const membersList = createSlice({
  name: "member",
  initialState,

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchAllMembersAsync.pending, (state) => {
        state.status = "loading";
        // state.allMemebers = [];
      })
      .addCase(FetchAllMembersAsync.fulfilled, (state, action) => {
        state.allMemebers = action.payload;
        state.status = "idle";
      })
      .addCase(FetchAllMembersAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = state.payload;
      });

    builder
      .addCase(FilterMemberAsync.pending, (state) => {
        state.status = "loading";
        state.members = [];
      })
      .addCase(FilterMemberAsync.fulfilled, (state, action) => {
        state.members = action.payload.data;
        state.totalMembers = action.payload.totalMembers;
        state.status = "idle";
      })
      .addCase(FilterMemberAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = state.payload;
      });
    builder
      .addCase(joinMemberAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(joinMemberAsync.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(joinMemberAsync.rejected, (state, action) => {
        state.status = "idle";
        console.log(action, "action");
        state.error = action.payload;
      });
    builder
      .addCase(deleteMemberAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMemberAsync.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(deleteMemberAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
    builder
      .addCase(getMemberByIdAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getMemberByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.member = action.payload;
      })
      .addCase(getMemberByIdAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
    builder
      .addCase(memberUpadteAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(memberUpadteAsync.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(memberUpadteAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
    builder
      .addCase(getFeesHistoryAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getFeesHistoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.feesHistory = action.payload.fees;
      })
      .addCase(getFeesHistoryAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
    builder
      .addCase(updateMemberFeesAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(updateMemberFeesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.feesHistory = action.payload.feesHistory;
        state.member = action.payload.feesHistory;
      })
      .addCase(updateMemberFeesAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
  },
});

export const selectAllMembers = (state) => state.member.allMemebers;
export const selectMembers = (state) => state.member.members;
export const selectMember = (state) => state.member.member;
export const selectstatus = (state) => state.member.status;
export const selectError = (state) => state.member.error;
export const selectmembersPerPage = (state) => state.member.membersPerPage;
export const selecttotalMembers = (state) => state.member.totalMembers;
export const selectselectedMember = (state) => state.member.selectedMember;
// export const selectstrengthFees = (state) => state.member.strengthFees;
// export const selectcardioMaleFees = (state) => state.member.cardioMaleFees;
// export const selectcardioFemaleFees = (state) => state.member.cardioFemaleFees;
export const selectfeesHistory = (state) => state.member.feesHistory;
// export const selectpersonalTrainingFees = (state) =>
//   state.member.personalTrainingFees;

export default membersList.reducer;
