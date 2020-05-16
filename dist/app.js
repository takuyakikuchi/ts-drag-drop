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
function validation(input) {
    let isValid = true;
    if (input.required) {
        isValid = isValid && input.value.toString().trim().length !== 0;
    }
    if (input.minLength !== null && typeof input.minLength === "string") {
        isValid =
            isValid && input.value.toString().trim().length >= input.minLength;
    }
    if (input.maxLength !== null && typeof input.maxLength === "string") {
        isValid =
            isValid && input.value.toString().trim().length <= input.maxLength;
    }
    if (input.min !== null && typeof input.min === "number") {
        isValid = isValid && input.value >= input.min;
    }
    if (input.min !== null && typeof input.max === "number") {
        isValid = isValid && input.value <= input.max;
    }
    return isValid;
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
    renderElement() {
        this.hostDivElement.insertAdjacentElement("afterbegin", this.formElement);
    }
    gatherUserInput() {
        const title = this.titleInput.value;
        const description = this.descriptionInput.value;
        const people = this.peopleInput.value;
        const titleValidatable = {
            value: title,
            required: true,
            minLength: 1,
        };
        const descriptionValidatable = {
            value: description,
            required: true,
            minLength: 1,
        };
        const peopleValidatable = {
            value: people,
            required: true,
            min: 1,
            max: 10,
        };
        if (!validation(titleValidatable) ||
            !validation(descriptionValidatable) ||
            !validation(peopleValidatable)) {
            alert("Invalid input! Please fill the inputs");
            return;
        }
        else {
            return [title, description, +people];
        }
    }
    clearUserInput() {
        this.titleInput.value = "";
        this.descriptionInput.value = "";
        this.peopleInput.value = "";
    }
    submit(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
            this.clearUserInput();
        }
    }
    configure() {
        this.formElement.addEventListener("submit", this.submit);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submit", null);
const projectInput = new ProjectInput();
//# sourceMappingURL=app.js.map