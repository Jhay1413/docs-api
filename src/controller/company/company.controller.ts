import { Request, Response } from "express";
import {
  deleteCompany,
  fetchProjectsForTicketingForm,
  getCompanies,
  getCompanyById,
  getCompanyRelationsById,
  insertCompany,
  updateCompany,
} from "./company.service";
import z from "zod";
import { companyFormData } from "./company.schema";
export const deleteCompanyHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await deleteCompany(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const createCompanyHandler = async ({
  body,
}: {
  body: z.infer<typeof companyFormData>;
}) => {
  const data = body;
  try {
    const result = await insertCompany(data);
    return {
      status: 201,
      body: result,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500, // Use 500 for server error
      body: {
        error: "Failed to create company",
      },
    };
  }
};
export const getCompaniesHandler = async (req: Request, res: Response) => {
  try {
    const result = await getCompanies();
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const getCompanyHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await getCompanyById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateCompanyDetailsHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const result = await updateCompany(id, data);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getCompanyDetailsHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await getCompanyRelationsById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const fetchProjectsForTicketForm = async (query: string) => {
  try {
    const projects = await fetchProjectsForTicketingForm(query);
    return projects;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};