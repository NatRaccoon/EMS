import { ErrorResponse } from "@/types/error.type";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      body?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    ErrorResponse
  > =>
  async ({ url, method, body, params }) => {
    try {
      const result = await httpClient({
        url,
        method,
        data: body,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<ErrorResponse>;
      return {
        error: {
          message: err.response?.data?.message || err.message,
          errors: err.response?.data?.errors,
        },
      };
    }
  };
