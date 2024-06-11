import { Request, Response } from "express";
import { db } from "../../prisma";
import { TcompanyFormData, projects } from "./company.schema";


export const deleteCompany = async (id: string) => {
  try {
    const response = await db.company.delete({
      where: {
        id,
      },
    });
    return response;
  } catch (error) {
    throw new Error("Error while deleting company");
  }
}

export const insertCompany = async (data: TcompanyFormData) => {
  try {
    const response = await db.company.create({
      data: {
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        companyId: data.companyId,
        companyProjects: {
          create: data.companyProjects.map((project) => ({
            projectName: project.projectName,
            projectAddress: project.projectAddress,
            retainer: project.retainer,
            date_expiry: project.date_expiry || null,
            contactPersons: {
              create: {
                name: project.contactPersons!.name,
                contactNumber: project.contactPersons!.contactNumber,
              },
            },
          })),
        },
        contactPersons: {
          create: {
            name: data.contactPersons!.name,
            contactNumber: data.contactPersons!.contactNumber,
          },
        },
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error)
    throw new Error("Error while inserting company");
  }
};

export const getCompanies = async () => {
  try {
    const response = await db.company.findMany({
      include:{
        companyProjects:{
          include:{
            contactPersons:true
          }
        },
        contactPersons:true
      }
    });
    return response;
  } catch (error) {
    throw new Error("Error while getting companies");
  }
};
export const getCompanyById = async (id: string) => {
  try {
    const response = await db.company.findUnique({
      where: {
        id,
      },
    });
    return response;
  } catch (error) {
    throw new Error("Error while getting company");
  }
};
export const getCompaniesRelations = async () => {
  try {
    const response = await db.company.findMany({
      select: {
        companyProjects: true,
        contactPersons: true,
      },
    });
    return response;
  } catch (error) {
    throw new Error("Error while getting company relations");
  }
};
export const getCompanyRelationsById = async (id: string) => {
  try {
    const response = await db.company.findUnique({
      where: {
        id,
      },
      select: {
        companyProjects: true,
        contactPersons: true,
      },
    });
    return response;
  } catch (error) {
    throw new Error("Error while getting company relations");
  }
};
