import "./bootstrap";
import { ReactSupervisor } from "react-supervisor";
import PageProjects from "./react/PageProjects";
import PageProjectEdit from "./react/PageProjectEdit";
import PageProjectNew from "./react/PageProjectNew";

ReactSupervisor.registerComponent(".react-page-projects", PageProjects);
ReactSupervisor.registerComponent(".react-page-project-edit", PageProjectEdit);
ReactSupervisor.registerComponent(".react-page-project-new", PageProjectNew);

ReactSupervisor.initialize();
