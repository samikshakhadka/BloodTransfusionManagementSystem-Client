import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  EditInventoryData,
  InventoryData,
  AdminData,
  PatientData,
  EditPatientwaitlist,
  DonorData,
  EditDonors,
  Hospital,
  EditAdminDataModel,
  ResetPasswordData,
  UserProfileEdit,
} from "../models/datamodels";
import jsCookie from "js-cookie";
import { RepresentativeData } from "../components/Forms/Addrepresentative";

export const AxiosClient = createApi({
  reducerPath: "axiosClient",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7023/api/",
    prepareHeaders: (headers) => {
      const userCredentials = jsCookie.get("name");
      const userObject = userCredentials && JSON.parse(userCredentials);
      const apiKey = "FA2F7453CF6E4CD6B255B755F6AE0FCF";
      headers.set("X-Api-Key", `${apiKey}`);
      headers.set("userTypeId", `${userObject.userType.userTypeId}`);
      return headers;
    },
  }),
  tagTypes: ["Inventorys", "Donors", "Hospitals", "PatientWaitlists", "Users"],
  endpoints: (builder) => ({
    readRequest: builder.query({
      query: (slug) => {
        return slug;
      },
      providesTags: ["Donors"],
    }),
    deleteRequest: builder.mutation<{ success: boolean; id: string }, string>({
      query(slug: string) {
        return {
          url: `${slug}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Donors"],
    }),

    deleteAdmin: builder.mutation<{ success: boolean; id: string }, string>({
      query(slug: string) {
        return {
          url: `${slug}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Donors"],
    }),

    deleteHospital: builder.mutation<{ success: boolean; id: string }, string>({
      query(slug: string) {
        return {
          url: `${slug}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Donors"],
    }),

    addInventory: builder.mutation<void, InventoryData>({
      query: (inventory) => ({
        url: "inventorys",
        method: "POST",
        body: inventory,
      }),
      invalidatesTags: ["Donors"],
    }),

    addHospital: builder.mutation<void, Hospital>({
      query: (hospital) => ({
        url: "hospitals",
        method: "POST",
        body: hospital,
      }),
      invalidatesTags: ["Donors"],
    }),

    addRepresentative: builder.mutation<void, RepresentativeData>({
      query: (rep) => ({
        url: "wardrepresentatives",
        method: "POST",
        body: rep,
      }),
      invalidatesTags: ["Donors"],
    }),

    editHospital: builder.mutation<void, Hospital>({
      query: (hospital) => ({
        url: `hospitals/${hospital.hospitalId}`,
        method: "PUT",
        body: hospital,
      }),
      invalidatesTags: ["Donors"],
    }),

    editInventory: builder.mutation<void, EditInventoryData>({
      query: (inventory) => ({
        url: `inventorys/${inventory.inventoryId}`,
        method: "PUT",
        body: inventory,
      }),
      invalidatesTags: ["Donors"],
    }),

    editAdmin: builder.mutation<void, EditAdminDataModel>({
      query: (user) => ({
        url: `users/${user.userId}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Donors"],
    }),

    editAdminFull: builder.mutation<void, AdminData>({
      query: (user) => ({
        url: `userdonor/${user.donorId}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Donors"],
    }),

    editRepresenattive: builder.mutation<void, RepresentativeData>({
      query: (rep) => ({
        url: `wardrepresentatives/${rep.wardRepId}`,
        method: "PUT",
        body: rep,
      }),
      invalidatesTags: ["Donors"],
    }),

    addPatient: builder.mutation<void, PatientData>({
      query: (patientwaitlists) => ({
        url: "patientwaitlists",
        method: "POST",
        body: patientwaitlists,
      }),
      invalidatesTags: ["Donors"],
    }),
    editPatient: builder.mutation<void, EditPatientwaitlist>({
      query: (patientwaitlists) => ({
        url: `patientwaitlists/${patientwaitlists.patientId}`,
        method: "PUT",
        body: patientwaitlists,
      }),
      invalidatesTags: ["Donors"],
    }),
    deletePWaitlist: builder.mutation<{ success: boolean; id: string }, string>(
      {
        query(slug: string) {
          return {
            url: `${slug}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["Donors"],
      }
    ),

    addAdmin: builder.mutation<void, AdminData>({
      query: (user) => ({
        url: "userdonor",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Donors"],
    }),
    editUser: builder.mutation<void, UserProfileEdit>({
      query: (userDonor) => ({
        url: `userdonor/${userDonor.donorId}`,
        method: "PUT",
        body: userDonor,
      }),
      invalidatesTags: ["Donors"],
    }),

    addDonor: builder.mutation<void, DonorData>({
      query: (donor) => ({
        url: "donors",
        method: "POST",
        body: donor,
      }),
      invalidatesTags: ["Donors"],
    }),
    editDonor: builder.mutation<void, EditDonors>({
      query: (donor) => ({
        url: `donors/${donor.donorId}`,
        method: "PUT",
        body: donor,
      }),
      invalidatesTags: ["Donors"],
    }),

    resetPassword: builder.mutation<void, ResetPasswordData>({
      query: (user) => ({
        url: `resetpassword/${user.userId}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["Donors"],
    }),
  }),
});

export const {
  useReadRequestQuery,
  useDeleteRequestMutation,
  useAddInventoryMutation,
  useEditInventoryMutation,
  useAddAdminMutation,
  useAddDonorMutation,
  useEditDonorMutation,
  useAddPatientMutation,
  useEditPatientMutation,
  useAddHospitalMutation,
  useEditHospitalMutation,
  useDeleteAdminMutation,
  useDeletePWaitlistMutation,
  useDeleteHospitalMutation,
  useEditAdminMutation,
  useResetPasswordMutation,
  useEditUserMutation,
  useAddRepresentativeMutation,
  useEditRepresenattiveMutation,
  useEditAdminFullMutation,
} = AxiosClient;
