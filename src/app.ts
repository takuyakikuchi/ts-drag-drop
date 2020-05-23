// ************* Drag/Drop *************

// duck type: shaping functions
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// ************* Input Validation *************

// duck type: shaping values
interface Validatable {
  // Interface is for syntactical contract
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validation(input: Validatable) {
  let isValid = true;
  if (input.required) {
    // Check if input is not empty
    isValid = isValid && input.value.toString().trim().length !== 0;
  }
  if (input.minLength !== null && typeof input.minLength === "string") {
    // Check if input has greater length than minLength
    isValid =
      isValid && input.value.toString().trim().length >= input.minLength;
  }
  if (input.maxLength !== null && typeof input.maxLength === "string") {
    // Check if input has greater length than maxLength
    isValid =
      isValid && input.value.toString().trim().length <= input.maxLength;
  }
  if (input.min !== null && typeof input.min === "number") {
    // Check if input has greater than min
    isValid = isValid && input.value >= input.min;
  }
  if (input.min !== null && typeof input.max === "number") {
    // Check if input has less than max
    isValid = isValid && input.value <= input.max;
  }
  return isValid;
}

// ************* Project Class **************

// Named constants
enum ProjectStatus {
  Active,
  Finished,
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// ************* Project state management *****************

// T: Project
type Listener<T> = (items: T[]) => void;

// T: Project
class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState; // To make it accessible as class property

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice()); // Copy of array
    }
  }
}

const projectState = ProjectState.getInstance();

// ************* Base Component Class *****************

// <abstract>Cannot initiate class Component directly
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtBeginning: boolean,
    newElementId?: string
  ) {
    // Template element to be copied
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;

    // Parent element where new element is rendered
    this.hostElement = document.getElementById(hostElementId)! as T;

    // Element to be rendered
    const newElement = document.importNode(this.templateElement.content, true);
    this.element = newElement.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.renderElement(insertAtBeginning);
  }

  // --------------- Class methods ---------------

  private renderElement(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

// ************* ProjectInput Class *****************
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInput: HTMLFormElement;
  descriptionInput: HTMLFormElement;
  peopleInput: HTMLFormElement;

  constructor() {
    // @args(templateElementId, hostElementId, insertAtBegging, newElementId)
    super("project-input", "app", true, "user-input");

    this.titleInput = this.element.querySelector("#title")! as HTMLFormElement;

    this.descriptionInput = this.element.querySelector(
      "#description"
    )! as HTMLFormElement;

    this.peopleInput = this.element.querySelector(
      "#people"
    )! as HTMLFormElement;

    this.configure(); // On submit event
  }

  // --------------- ProjectInput class methods ---------------

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInput.value;
    const description = this.descriptionInput.value;
    const people = this.peopleInput.value;

    // Validation
    const titleValidatable: Validatable = {
      value: title,
      required: true,
      minLength: 1,
    };

    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 1,
    };

    const peopleValidatable: Validatable = {
      value: people,
      required: true,
      min: 1,
      max: 10,
    };

    if (
      !validation(titleValidatable) ||
      !validation(descriptionValidatable) ||
      !validation(peopleValidatable)
    ) {
      // Validation handling
      alert("Invalid input! Please fill the inputs");
      return;
    } else {
      return [title, description, +people];
    }
  }

  private clearUserInput(): void {
    this.titleInput.value = "";
    this.descriptionInput.value = "";
    this.peopleInput.value = "";
  }

  @autobind // Binding "this"
  private submit(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearUserInput();
    }
  }

  // Event listener
  configure() {
    this.element.addEventListener("submit", this.submit);
  }
}

// ************* ProjectList Class *****************
class ProjectList extends Component<HTMLDivElement, HTMLElement>
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

// ************* ProjectItem Class *****************
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    // @args(templateElementId, hostElementId, insertAtBegging, newElementId)
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent) {
    console.log("Drag end");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

// ************ Decorators *************

// Binding "this" keyword to method
function autobind(_: any, _two: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const newMethod: PropertyDescriptor = {
    get() {
      const boundFunction = originalMethod.bind(this);
      return boundFunction;
    },
  };
  return newMethod;
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
