export class Component {
    constructor(templateId, hostElementId, insertAtBeginning, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        const newElement = document.importNode(this.templateElement.content, true);
        this.element = newElement.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.renderElement(insertAtBeginning);
    }
    renderElement(insertAtBeginning) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? "afterbegin" : "beforeend", this.element);
    }
}
//# sourceMappingURL=base.js.map