// ************* Input Validation *************
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
  private configure() {
    this.element.addEventListener("submit", this.submit);
  }
}

// ************* ProjectList Class *****************
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    // @args(templateElementId, hostElementId, insertAtBegging, newElementId)
    super("project-list", "app", false, `${type}-projects`);

    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  configure() {
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
      const listItem = document.createElement("li");
      listItem.textContent = projectItem.title;
      listElement.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
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
