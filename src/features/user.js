import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    name: "",
    email: "",
  },
  reducers: {
    login: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(checkLocalUser.fulfilled, (state, action) => {
    //   if (action.payload !== null) {
    //     state.data.find((item) => item.id == 6).name = "Account";
    //     state.data.find((item) => item.id == 6).link = "/account";
    //     state.data.find((item) => item.id == 7).name = "Logout";
    //     state.data.find((item) => item.id == 7).link = "/logout";
    //   }
    // });
  },
});
// export const getProducts = createAsyncThunk("product/get", async () => {
//   let data = await fetch("https://fakestoreapi.com/products");
//   let result = await data.json();
//   return result;
// });
export const { login } = userSlice.actions;
export default userSlice.reducer;
