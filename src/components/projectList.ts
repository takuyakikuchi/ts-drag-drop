/// <reference path="base.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../states/project.ts" />
/// <reference path="../models/project.ts" />
/// <reference path="../models/dragDrop.ts" />

namespace App {
  export class ProjectList extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
      // @args(templateElementId, hostElementId, insertAtBegging, newElementId)
      super("project-list", "app", false, `${type}-projects`);

      this.assignedProjects = [];

      this.configure();
      this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.add("droppable");
      }
    }

    @autobind
    dropHandler(event: DragEvent) {
      const prjId = event.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        prjId,
        this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }

    @autobind
    dragLeaveHandler(_: DragEvent) {
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.remove("droppable");
    }

    configure() {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);

      projectState.addListener((projects: Project[]) => {
        const relevantProjects = projects.filter((project) => {
          // "this" is ProjectList
          if (this.type === "active") {
            return project.status === ProjectStatus.Active;
          } else {
            return project.status === ProjectStatus.Finished;
          }
        });
        // Overwriting projects
        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }

    // ----------- ProjectList methods ------------

    private renderProjects() {
      const listElement = document.getElementById(
        `${this.type}-projects-list`
      )! as HTMLUListElement;

      listElement.innerHTML = ""; // To avoid duplication

      for (const projectItem of this.assignedProjects) {
        new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
      }
    }

    renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " PROJECTS";
    }
  }
}