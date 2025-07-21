import { createApi } from "@reduxjs/toolkit/query";
import { axiosBaseQuery } from "./http-client";

export const httpService = createApi({
  reducerPath: "api/v1",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
});
