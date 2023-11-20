import "./bootstrap";
import { ReactSupervisor } from "react-supervisor";
import PageProjects from "./react/PageProjects";
import PageProject from "./react/PageProject";

ReactSupervisor.registerComponent(".react-page-projects", PageProjects);
ReactSupervisor.registerComponent(".react-page-project", PageProject);

ReactSupervisor.initialize();
