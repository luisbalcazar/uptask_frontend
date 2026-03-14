import z from "zod";

export type ResponseDTO = {
  msg: string;
  code: number;
};

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
  project: z.string(),
  status: taskStatusSchema,
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
export type TaskStatus = Pick<Task, "status">;
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
