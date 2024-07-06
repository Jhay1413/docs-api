import { object, string, TypeOf,optional,nullable } from "zod";
import z from "zod";

export const userInfoSchema = {
  body: object({
    email: string({
      required_error: "email is required",
    }),
    employeeId : string({
      required_error : ("userId is required")
    }),
    firstName: string({
      required_error: "firstName is required",
    }).min(2, "firstName must be at least 6 characters"),
    lastName: string({
      required_error: "lastName is required",
    }).min(2, "lastName must be at least 6 characters"),
    assignedDivision: string({
      required_error: "assignedDivision is required",
    }),
    assignedPosition: string({
      required_error: "assignedPosition is required",
    }),
    assignedSection: nullable(string({
      required_error: "assignedSection is required",
    })),
    dateStarted: string({
      required_error: "date is required",
    }),
    jobStatus: string({
      required_error: "jobStatus is required",
    }),
    contactNumber: string({
      required_error: "contactNumber is required",
    }),
    birthDate: string({
      required_error: "birthDate is required",
    }),
    middleName: nullable(z.string({
      required_error: "middleName is required",
    }))
  }),
};
export const accountSchema = {
  body: object({
    accountType: string({
      required_error: "accountType is required",
    }),
    password: string({
      required_error: "password is required",
    }),
  }),
};
export const userRegisterSchema = userInfoSchema.body.extend({
  password: string({
    required_error: "password is required",
  }),
  accountRole: string({
    required_error: "accountType is required",
  }),
});
export const userLoginSchema = {
  body: object({
    email: string({
      required_error: "email is required",
    }),
    password: string({
      required_error: "password is required",
    }),
  }),
};

export const userWithIdSchema = userInfoSchema.body.extend({
  id: z.string({
    message:"id is required"
  })
})
export const userInfoWithProfile = userRegisterSchema.extend({
  imageUrl: z.nullable(z.string()),
});

export const userInfoWithSignedUrl = userRegisterSchema
  .extend({
    imageUrl: z.nullable(z.string({
      message: "imageUrl is required",
    })),
    dateStarted: z.date(),
  })
  .omit({
    dateStarted: true,
    password: true,
    accountRole: true,
  });

  export const AccountSchema = z.object({
    id: z.string(),
    email: z.string(),
    accountRole: z.string(),
    password: z.string(),
  })
export type TUserWithId = z.infer<typeof userWithIdSchema>;
export type TUserInfoWithProfile = z.infer<typeof userInfoWithProfile>;
export type TUserInfoWithSignedUrl = z.infer<typeof userInfoWithSignedUrl>;
export type RegisterBody = TypeOf<typeof userRegisterSchema>;
export type TLoginBody = TypeOf<typeof userLoginSchema.body>;
export type TUserInfo = TypeOf<typeof userInfoSchema.body>;
