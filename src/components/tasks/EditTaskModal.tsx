import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import { type Task, type TaskFormData } from "../../types/index";
import { useForm } from "react-hook-form";
import TaskForm from "./TaskForm";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/services/TaskAPI";

type EditTaskModalProps = {
  task: Task;
};

export default function EditTaskModal({ task }: EditTaskModalProps) {
  const navigate = useNavigate();
  const params = useParams();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("taskId");
  const show = taskId ? true : false;

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<TaskFormData>({
    defaultValues: {
      name: task.name,
      description: task.description,
    },
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateTask,
    onError: (error) => {
      console.log(error);
      toast.error("Ha ocurrido un error al actualizar la tarea");
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["project", params.projectId!],
      });

      if (response) {
        toast.success(response.msg);
        reset();
      }
      navigate(location.pathname, { replace: true });
    },
  });

  const handleUpdateTask = (formData: TaskFormData) => {
    const data = {
      formData,
      projectId: params.projectId!,
      taskId: task._id,
    };
    mutate(data);
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => navigate(location.pathname, { replace: true })}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                <DialogTitle as="h3" className="font-black text-4xl  my-5">
                  Editar Tarea
                </DialogTitle>

                <p className="text-xl font-bold">
                  Realiza cambios a una tarea en {""}
                  <span className="text-fuchsia-600">este formulario</span>
                </p>

                <form
                  className="mt-10 space-y-3"
                  onSubmit={handleSubmit(handleUpdateTask)}
                  noValidate
                >
                  <TaskForm errors={errors} register={register} />

                  <input
                    type="submit"
                    className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                    value="Guardar Tarea"
                  />
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
