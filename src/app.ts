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
    this.templateElement = 
      document.getElementById("project-input")! as HTMLTemplateElement;

    // Div element where rendering to be done
    this.hostDivElement = 
      document.getElementById("app")! as HTMLDivElement;

    // Form element to be rendered
    const newFormElement = document.importNode(
      this.templateElement.content,
      true
    );
    this.formElement = 
      newFormElement.firstElementChild as HTMLFormElement;

    this.titleInput = 
      this.formElement.querySelector("#title")! as HTMLFormElement;

    this.descriptionInput = 
      this.formElement.querySelector("#description")! as HTMLFormElement;

    this.peopleInput = 
      this.formElement.querySelector("#people")! as HTMLFormElement;

    // ----------- Style -------------
    this.formElement.id = "user-input"; // Form style

    // ----------- Function call -------------
    this.renderElement();
    this.configure(); // On submit event
  }

  private renderElement() {
    this.hostDivElement.insertAdjacentElement("afterbegin", this.formElement);
  }

  private submit(event: Event) {
    event.preventDefault();
    console.log(this.titleInput.value);
  }

  private configure() {
    this.formElement.addEventListener("submit", this.submit.bind(this));
  }
}

const projectInput = new ProjectInput();
