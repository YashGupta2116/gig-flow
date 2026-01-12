import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000/api/gigs";

axios.defaults.withCredentials = true;

export const fetchGigs = createAsyncThunk(
  "gigs/fetchAll",
  async (search = "") => {
    const { data } = await axios.get(
      `${API_URL}${search ? `?search=${encodeURIComponent(search)}` : ""}`
    );
    return data;
  }
);

export const fetchMyGigs = createAsyncThunk("gigs/fetchMy", async () => {
  const { data } = await axios.get(`${API_URL}/my/posted`);
  return data;
});

export const createGig = createAsyncThunk(
  "gigs/create",
  async (gigData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API_URL, gigData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const gigSlice = createSlice({
  name: "gigs",
  initialState: {
    gigs: [],
    myGigs: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGigs.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs = action.payload;
      })
      .addCase(fetchGigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMyGigs.fulfilled, (state, action) => {
        state.myGigs = action.payload;
      })
      .addCase(createGig.fulfilled, (state, action) => {
        state.gigs.unshift(action.payload);
        state.myGigs.unshift(action.payload);
      });
  },
});

export default gigSlice.reducer;
