"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function autobind(_, _two, descriptor) {
    const originalMethod = descriptor.value;
    const newMethod = {
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        },
    };
    return newMethod;
}
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostDivElement = document.getElementById("app");
        const newFormElement = document.importNode(this.templateElement.content, true);
        this.formElement = newFormElement.firstElementChild;
        this.titleInput = this.formElement.querySelector("#title");
        this.descriptionInput = this.formElement.querySelector("#description");
        this.peopleInput = this.formElement.querySelector("#people");
        this.formElement.id = "user-input";
        this.renderElement();
        this.configure();
    }
    configure() {
        this.formElement.addEventListener("submit", this.submit);
    }
    gatherUserInput() {
        const title = this.titleInput.value;
        const description = this.descriptionInput.value;
        const people = this.peopleInput.value;
        if (title.trim().length === 0 ||
            description.trim().length === 0 ||
            people.trim().length === 0) {
            alert("Invalid input! Please fill the inputs");
            return;
        }
        else {
            return [title, description, +people];
        }
    }
    renderElement() {
        this.hostDivElement.insertAdjacentElement("afterbegin", this.formElement);
    }
    submit(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
        }
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submit", null);
const projectInput = new ProjectInput();
//# sourceMappingURL=app.js.map