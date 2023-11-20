import { useState } from "react";
import HttpClient from "../helpers/HttpClient";

export const useProjects = () => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [projectsTotal, setProjectsTotal] = useState<number>(0);
    const [projectsLoading, setProjectsLoading] = useState<boolean>(false);

    const fetchProjects = (page?: number, selectedStatuses?: number[]) => {
        setProjectsLoading(true);
        HttpClient({
            url: "/api/projects",
            method: "get",
            params: {
                page,
                statuses: selectedStatuses,
            },
        })
            .then((res) => {
                setProjects(res.data.data);
                setProjectsTotal(res.data.total);
            })
            .finally(() => {
                setProjectsLoading(false);
            });
    };

    return {
        projects,
        projectsTotal,
        projectsLoading,
        fetchProjects,
    };
};
