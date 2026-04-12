import z from "zod";

/* GENERIC DTO */
export type ResponseDTO = {
  msg: string;
  code: number;
};

/* AUTH & USER */
export const authSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  password_confirmation: z.string(),
  token: z.string(),
});

type Auth = z.infer<typeof authSchema>;
export type UserLoginForm = Pick<Auth, "email" | "password">;
export type UserRegistrationForm = Pick<
  Auth,
  "name" | "email" | "password" | "password_confirmation"
>;
export type ConfirmToken = Pick<Auth, "token">;
export type RequestConfirmationCodeForm = Pick<Auth, "email">;
export type ForgotPasswordForm = Pick<Auth, "email">;
export type NewPasswordForm = Pick<Auth, "password" | "password_confirmation">;

/* TASKS */
export const taskStatusSchema = z.enum([
  "pending",
  "onHold",
  "inProgress",
  "underReview",
  "completed",
]);

export const taskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  project: z.union([z.string(), z.object()]),
  status: taskStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const dashboardTaskSchema = z.array(
  taskSchema.pick({
    _id: true,
    name: true,
    project: true,
    description: true,
    status: true,
  }),
);

export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskFormData = Pick<Task, "name" | "description">;

/* PROJECTS */
export const projectSchema = z.object({
  _id: z.string(),
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  tasks: z.union([z.array(z.string()), dashboardTaskSchema]),
});

export const dashboardProjectSchema = z.array(
  projectSchema.pick({
    _id: true,
    projectName: true,
    clientName: true,
    description: true,
    tasks: true,
  }),
);

export type Project = z.infer<typeof projectSchema>;
export type ProjectFormData = Omit<Project, "_id" | "tasks">;
