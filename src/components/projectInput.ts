import { Component } from "./base.js";
import { Validatable, validation } from "../utilities/validation.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../states/project.js";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
  