import AddTaskModal from "@/components/tasks/AddTaskModal";
import { TaskList } from "@/components/tasks/TaskList";
import { getProjectById } from "@/services/ProjectAPI";
import type { Task } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export const ProjectDetailsView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = params.projectId!;

  const { data, isError, isLoading } = useQuery({
    queryKey: ["editProject", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false, //le decimos que no siga haciendo la consulta si no la encuentra a la primera
  });

  if (isLoading) return "Cargando...";
  if (isError) return <Navigate to="/404" />;
  if (data)
    return (
      <>
        <h1 className="text-5xl font-black">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          {data.projectName}
        </p>

        <nav className="my-5 flex gap-3">
          <button
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            onClick={() => navigate(location.pathname + "?newTask=true")}
          >
            Agregar Tareas
          </button>
        </nav>

        <TaskList tasks={data.tasks as Task[]} />
        <AddTaskModal />
      </>
    );

  return;
};
