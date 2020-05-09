class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  constructor() {
    // Copied Template element
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;

    // Div element where rendering will be done
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    // Copying element
    const newElement = document.importNode(this.templateElement.content, true);

    // Element to be rendered
    this.element = newElement.firstElementChild as HTMLFormElement;
    this.renderElement();
  }

  renderElement() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projectInput = new ProjectInput();
