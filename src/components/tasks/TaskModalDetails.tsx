import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTaskById, updateTaskStatus } from "@/services/TaskAPI";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/index";
import { statusTranslations } from "@/locales/es";
import type { TaskStatus } from "@/types/index";

export default function TaskModalDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;
  const show = taskId ? true : false;

  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateTaskStatus,
    onError: (error) => {
      console.log(error);
      toast.error("Ha ocurrido un error al actualizar el estado de la tarea");
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });

      if (response) {
        toast.success(response.msg);
        //reset();
      }
      navigate(location.pathname, { replace: true });
    },
  });

  const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TaskStatus;
    const data = {
      status,
      projectId,
      taskId,
    };
    mutate(data);
  };

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    retry: false,
    enabled: !!taskId,
  });

  if (isLoading) return <p>Cargando...</p>;
  if (isError) {
    toast.error(error.message, { toastId: "errorTaskDetails" });
    return <Navigate to={`/projects/${projectId}`} />;
  }

  if (data)
    return (
      <>
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
                    <p className="text-sm text-slate-400">
                      Agregada el: {formatDate(data.createdAt)}
                    </p>
                    <p className="text-sm text-slate-400">
                      Última actualización: {formatDate(data.updatedAt)}
                    </p>
                    <DialogTitle
                      as="h3"
                      className="font-black text-4xl text-slate-600 my-5"
                    >
                      {data.name}
                    </DialogTitle>
                    <p className="text-lg text-slate-500 mb-2">
                      Descripción: {data.description}
                    </p>
                    <div className="my-5 space-y-3">
                      <label className="font-bold">
                        Estado Actual:
                        <select
                          className="w-full p-3 bg-white border border-gray-300"
                          name="status"
                          id="status"
                          defaultValue={data.status}
                          onChange={handleChangeStatus}
                        >
                          {Object.entries(statusTranslations).map(
                            ([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            ),
                          )}
                        </select>
                      </label>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
