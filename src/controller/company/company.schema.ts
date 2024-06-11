import { z } from "zod";
export const contacts = z.object({
  name: z.string(),
  contactNumber: z.string(),
});

export const projects = z.object({

  projectName: z.string(),
  projectAddress: z.string(),
  retainer:z.boolean(),
  date_expiry : z.nullable(z.date()),
  contactPersons: contacts,
});
export const companyFormData = z.object({
  companyId: z.string(),
  companyName: z.string(),
  companyAddress: z.string(),
  companyProjects: z.array(projects),
  contactPersons: contacts,
});
export type TProject = z.infer<typeof projects>
export type TcompanyFormData = z.infer<typeof companyFormData>;
