import { Request, Response } from "express";
import { db } from "../../prisma";
import { TcompanyFormData, projects } from "./company.schema";

export const updateCompany = async (id: string, data: TcompanyFormData) => {
  try {
    const response = await db.company.update({
      where: {
        id: id,
      },
      data: {
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        companyId: data.companyId,
        companyProjects: {
          deleteMany: {},
          create: data.companyProjects.map((project) => ({
            projectId: project.projectId,
            projectName: project.projectName,
            projectAddress: project.projectAddress,
            retainer: project.retainer,
            date_expiry: project.date_expiry || null,
            contactPersons: {
              delete: {
                where: {
                  id: project.contactPersons.id,
                },
              },
              create: {
                name: project.contactPersons!.name,
                contactNumber: project.contactPersons!.contactNumber,
              },
            },
          })),
        },
        contactPersons: {
          update: {
            where: {
              id: data.contactPersons.id,
            },
            data: {
              name: data.contactPersons!.name,
              contactNumber: data.contactPersons!.contactNumber,
            },
          },
        },
      },
    });
    return response;
  } catch (error) {
    throw new Error("Something went wrong while updating company");
  }
};

export const deleteCompany = async (id: string) => {
  try {
    const response = await db.company.delete({
      where: {
        id,
      },
    });
    return response.id;
  } catch (error) {
    throw new Error("Error while deleting company");
  }
};

export const insertCompany = async (data: TcompanyFormData) => {
  try {
    const response = await db.company.create({
      data: {
        companyName: data.companyName,
        companyAddress: data.companyAddress,
        companyId: data.companyId,
        email : data.email,
        companyProjects: {
          create: data.companyProjects.map((project) => ({
            projectId: project.projectId,
            projectName: project.projectName,
            projectAddress: project.projectAddress,
            retainer: project.retainer,
            email : project.email,
            date_expiry: project.date_expiry || null,
            contactPersons: {
              create: {
                name: project.contactPersons.name,
                contactNumber: project.contactPersons.contactNumber,
                email: project.contactPersons.email,
              },
            },
          })),
        },
        contactPersons: {
          create: {
            name: data.contactPersons.name,
            contactNumber: data.contactPersons.contactNumber,
            email: data.contactPersons.email,
          },
        },
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error while inserting company");
  }
};

export const getCompanies = async () => {
  try {
    const response = await db.company.findMany({
      include: {
        companyProjects: {
          include: {
            contactPersons: true,
          },
        },
        contactPersons: true,
      },
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
