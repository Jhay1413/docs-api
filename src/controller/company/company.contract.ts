import { initContract } from "@ts-rest/core";
import { companyFormData } from "./company.schema";
import { z } from "zod";
const companiesContract = initContract();

export const companyContract = companiesContract.router({
  insertCompany: {
    method: "POST",
    path: "/companies",

    responses: {
      201: companyFormData,
      500: z.object({
        error: z.string(),
      }),
    },
    body: companyFormData,
  },
  fetchCompanies: {
    method: "GET",
    path: "/companies",
    responses: {
      200: z.array(companyFormData).nullable(),
      500: z.object({
        error: z.string(),
      }),
    },
  },
  fetchCompany: {
    method: "GET",
    path: "/company/:id",
    pathParams: z.object({
      id: z.string(),
    }),
    responses: {
      200: companyFormData.nullable(),
      500: z.object({
        error: z.string(),
      }),
    },
  },
  deleteCompanyById: {
    method: "DELETE",
    path: "/company/",
    body:z.object({
        id:z.string()
    }),
    responses: {
      200: z.object({
        id:z.string(),
      }),
      500: z.object({
        error: z.string(),
      }),
    },
  },
   editCompanyById:{
       method:"PUT",
       path:"/company/:id",
       pathParams:z.object({
        id:z.string()
       }),
       body:companyFormData,
       responses:{
           201:companyFormData,
           500: z.object({
            error: z.string(),
          }),
       }
   }
});
