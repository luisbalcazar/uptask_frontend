import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/services/ProjectAPI";
import { EditProjectForm } from "@/components/projects/EditProjectForm";

const EditProjectView = () => {
  const params = useParams();
  const projectId = params.projectId!;

  const { data, isError, isLoading } = useQuery({
    queryKey: ["editProject", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false, //le decimos que no siga haciendo la consulta si no la encuentra a la primera
  });

  if (isLoading) return "Cargando...";
  if (isError) return <Navigate to="/404" />;
  if (data) return <EditProjectForm data={data} projectId={projectId} />;

  return <></>;
};

export default EditProjectView;
