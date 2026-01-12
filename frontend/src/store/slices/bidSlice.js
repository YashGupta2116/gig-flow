import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/bids";

axios.defaults.withCredentials = true;

export const createBid = createAsyncThunk(
  "bids/create",
  async (bidData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API_URL, bidData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const fetchBidsForGig = createAsyncThunk(
  "bids/fetchForGig",
  async (gigId) => {
    const { data } = await axios.get(`${API_URL}/${gigId}`);
    return data;
  }
);

export const fetchMyBids = createAsyncThunk("bids/fetchMy", async () => {
  const { data } = await axios.get(`${API_URL}/my/bids`);
  return data;
});

export const hireBid = createAsyncThunk(
  "bids/hire",
  async (bidId, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`${API_URL}/${bidId}/hire`);
      return data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to hire freelancer";
      return rejectWithValue(errorMessage);
    }
  }
);

const bidSlice = createSlice({
  name: "bids",
  initialState: {
    bids: [],
    myBids: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBidsForGig.fulfilled, (state, action) => {
        state.bids = action.payload;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.myBids = action.payload;
      })
      .addCase(createBid.fulfilled, (state, action) => {
        state.myBids.unshift(action.payload);
      })
      .addCase(hireBid.fulfilled, (state, action) => {
        const updatedBid = action.payload.bid;
        const gigId = updatedBid.gigId?._id || updatedBid.gigId;

        state.bids = state.bids.map((bid) => {
          const bidGigId = bid.gigId?._id || bid.gigId;
          if (bid._id === updatedBid._id) {
            return updatedBid;
          }
          if (String(bidGigId) === String(gigId) && bid.status === "PENDING") {
            return { ...bid, status: "REJECTED" };
          }
          return bid;
        });

        state.myBids = state.myBids.map((bid) => {
          const bidGigId = bid.gigId?._id || bid.gigId;
          if (bid._id === updatedBid._id) {
            return updatedBid;
          }
          if (String(bidGigId) === String(gigId) && bid.status === "PENDING") {
            return { ...bid, status: "REJECTED" };
          }
          return bid;
        });
      });
  },
});

export default bidSlice.reducer;
