import { getTaskById } from "@/services/TaskAPI";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation, useParams } from "react-router-dom";
import EditTaskModal from "./EditTaskModal";

export default function EditTaskData() {
  const location = useLocation();
  const querySearch = new URLSearchParams(location.search);
  const taskId = querySearch.get("taskId")!;

  const params = useParams();
  const projectId = params.projectId!;

  const { data, isError, isLoading } = useQuery({
    queryKey: ["editTask", taskId],
    queryFn: () => getTaskById({ projectId, taskId: taskId }),
    retry: false,
    enabled: !!taskId,
  });

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <Navigate to="/404" />;
  if (data) return <EditTaskModal task={data} />;

  return <></>;
}
