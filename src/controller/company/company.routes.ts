import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { companyContract, contracts } from "shared-contract";
import { deleteCompany, getCompanies, getCompanyById, insertCompany, updateCompany } from "./company.service";
import { s } from "../..";




const companyRouters = s.router(contracts.company, {
    insertCompany: async ({ body }) => {
      try {
        const result = await insertCompany(body);
        return {
          status: 201,
          body: result,
        };
      } catch (error) {
        return {
          status: 500,
          body: {
            error: "something went wrong ",
          },
        };
      }
    },
  
    fetchCompanies: async () => {
      try {
        const result = await getCompanies();
        return {
          status: 200,
          body: result,
        };
      } catch (error) {
        return {
          status: 500,
          body: {
            error: "something went wrwong",
          },
        };
      }
    },
    fetchCompany : async ({params:{id}}) =>{
      try {
        const result = await getCompanyById(id);
        return {
          status: 200,
          body: result ,
        };
      } catch (error) {
        return {
          status: 500,
          body: {
            error: "something went wrwong",
          },
        };
      }
    },
    deleteCompanyById: async ({body}) => {
      try {
        const result = await deleteCompany(body.id);
        return {
          status: 200,
          body: {
            id:result
          } ,
        };
      } catch (error) {
        return {
          status: 500,
          body: {
            error: "something went wrwong",
          },
        };
      }
    },
    editCompanyById:async ({body,params:{id}})=>{
      try {
        const result = await updateCompany(id,body);
        return {
          status: 200,
          body: {
            id:result
          } ,
        };
      } catch (error) {
        return {
          status: 500,
          body: {
            error: "something went wrwong",
          },
        };
      }
    }
      
    
  });
  
  export const registerCompanyRoutes = (app: any) => {
    createExpressEndpoints(companyContract, companyRouters, app);
  };