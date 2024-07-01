import { z } from "zod";
export const contacts = z.object({
  id:z.optional(z.string()),
  name: z.string(),
  contactNumber: z.string(),
  email : z.nullable(z.string())
  
});

export const projects = z.object({
  id:z.optional(z.string()),
  projectId : z.string(),
  projectName: z.string(),
  projectAddress: z.string(),
  retainer:z.boolean(),
  date_expiry : z.nullable(z.date()),
  contactPersons: contacts.optional(),
  email : z.nullable(z.string())
});
export const companyFormData = z.object({
  id:z.optional(z.string()),
  companyId: z.string(),
  companyName: z.string(),
  companyAddress: z.string(),
  email : z.nullable(z.string()),
  companyProjects: z.array(projects).optional(),
  contactPersons: contacts.optional(),

});
export type TProject = z.infer<typeof projects>
export type TcompanyFormData = z.infer<typeof companyFormData>;
