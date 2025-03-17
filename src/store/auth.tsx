import axios, { AxiosError } from 'axios';
import jsCookie from 'js-cookie';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LoginCredentials } from '../models/datamodels';

const initialState = {
  userId: undefined,
  hospitalId: undefined,
  userType: {
    userTypeId: undefined,
    userTypeName: undefined,
  },
};

// export const loginUser = createAsyncThunk(
//   'loginUser',
//   async (payload: LoginCredentials) => {
//     const headers = {
//       'x-api-key': 'FA2F7453CF6E4CD6B255B755F6AE0FCF',
//       email: payload.email,
//       password: payload.password,
//       'Content-Type': 'application/json'
//     };
//     try {
//       const { data } = await axios.post(
//         'https://localhost:7023/api/login',
//         {},
//         { headers }
//       );
//       jsCookie.set('name', JSON.stringify(data));
//       return {
//         success: true,
//         message: 'Successfully Logged In',
//         data,
//       };
//     } catch (error) {
//       const errorMessage =
//         error instanceof AxiosError ? error.response?.data : 'Unable to login';
//       return {
//         success: false,
//         message: errorMessage,
//       };
//     }
//   }
// );


export const loginUser = createAsyncThunk(
  'loginUser',
  async (payload: LoginCredentials) => {
    const headers = {
      'x-api-key': 'FA2F7453CF6E4CD6B255B755F6AE0FCF',
      'Content-Type': 'application/json'
    };

    try {
      const { data } = await axios.post(
        'https://localhost:7023/api/login',
        {
          email: payload.email,
          password: payload.password
        },
        { headers }
      );

      data.userType.userTypeName = splitPascalCase(data.userType.userTypeName);

      jsCookie.set('name', JSON.stringify(data));
      return {
        success: true,
        message: 'Successfully Logged In',
        data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError ? error.response?.data : 'Unable to login';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
);


export const reset = createAsyncThunk(
  'reset',
  async (payload: LoginCredentials) => {
    const headers = {
      'x-api-key': 'FA2F7453CF6E4CD6B255B755F6AE0FCF',
      email: payload.email,
    };
    try {
      const { data } = await axios.post(
        'https://localhost:7023/api/reset',
        null,
        { headers }
      );

      jsCookie.set('name', JSON.stringify(data));
      return {
        success: true,
        message: 'Successfully Email Verified',
        data,
      };
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError ? error.response?.data : 'Could not verify';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
);

export const logoutUser = createAsyncThunk('logoutUser', async () => {
  jsCookie.remove('name');

  //
  return {
    success: true,
    message: 'Successfully logged out!',
  };
});

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const payloadAttributes = action.payload.data;
      state.userId = payloadAttributes?.userId;
      state.hospitalId = payloadAttributes?.hospitalId;
      state.userType.userTypeId = payloadAttributes?.userType.userTypeId;
      state.userType.userTypeName = payloadAttributes?.userType.userTypeName;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.userId = undefined;
      state.userType.userTypeId = undefined;
      state.userType.userTypeName = undefined;
      state.hospitalId = undefined;
    });
  },
});

function splitPascalCase(pascalString: string) {
  const spacedString = pascalString.replace(/([a-z])([A-Z])/g, '$1 $2');
  console.log(spacedString);
  return spacedString;
}

export default AuthSlice.reducer;
