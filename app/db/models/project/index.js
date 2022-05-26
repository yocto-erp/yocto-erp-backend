import ProjectTask from "./project-task";
import Project from "./project";

export const initProjectModel = sequelize => ({
  Project: Project.init(sequelize),
  ProjectTask: ProjectTask.init(sequelize),
});
