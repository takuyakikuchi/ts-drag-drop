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

// ************* ProjectState Class *****************

type Listener = (items: Project[]) => void;
class ProjectState {
  private listeners: Listener[] = []; // Subscription
  private projects: Project[] = [];
  private static instance: ProjectState; // To make it accessible as class property

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
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

// ************* ProjectInput Class *****************
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostDivElement: HTMLDivElement;
  formElement: HTMLFormElement;
  titleInput: HTMLFormElement;
  descriptionInput: HTMLFormElement;
  peopleInput: HTMLFormElement;

  constructor() {
    // ----------- Variables -----------

    // Template element to be copied
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;

    // Div element where rendering to be done
    this.hostDivElement = document.getElementById("app")! as HTMLDivElement;

    // Form element to be rendered
    const newFormElement = document.importNode(
      this.templateElement.content,
      true
    );
    this.formElement = newFormElement.firstElementChild as HTMLFormElement;

    this.titleInput = this.formElement.querySelector(
      "#title"
    )! as HTMLFormElement;

    this.descriptionInput = this.formElement.querySelector(
      "#description"
    )! as HTMLFormElement;

    this.peopleInput = this.formElement.querySelector(
      "#people"
    )! as HTMLFormElement;

    // ----------- Style -------------
    this.formElement.id = "user-input"; // Form style

    // ----------- Function call -------------
    this.renderElement();
    this.configure(); // On submit event
  } // Constructor ends

  // --------------- ProjectInput class methods ---------------

  private renderElement() {
    this.hostDivElement.insertAdjacentElement("afterbegin", this.formElement);
  }

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
    this.formElement.addEventListener("submit", this.submit);
  }
}

// ************* ProjectList Class *****************
class ProjectList {
  templateElement: HTMLTemplateElement;
  hostDivElement: HTMLDivElement;
  sectionElement: HTMLElement;
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    // ----------- Variables -----------

    // Template element to be copied
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;

    // Div element where rendering to be done
    this.hostDivElement = document.getElementById("app")! as HTMLDivElement;

    // Section element to be rendered
    const newSectionElement = document.importNode(
      this.templateElement.content,
      true
    );
    this.sectionElement = newSectionElement.firstElementChild as HTMLElement;
    this.sectionElement.id = `${this.type}-projects`;

    this.assignedProjects = [];
    projectState.addListener((projects: Project[]) => {
      // Overwriting projects
      this.assignedProjects = projects;
      this.renderProjects();
    });

    // ------------- Function call --------------
    this.renderElement();
    this.renderContent();
  }

  // ----------- ProjectList methods ------------

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;

    for (const projectItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = projectItem.title;
      listElement.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.sectionElement.querySelector("ul")!.id = listId;
    this.sectionElement.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private renderElement() {
    this.hostDivElement.insertAdjacentElement("beforeend", this.sectionElement);
  }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
