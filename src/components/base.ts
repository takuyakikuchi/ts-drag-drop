export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
