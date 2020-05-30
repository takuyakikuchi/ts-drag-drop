var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./base.js";
import { validation } from "../utilities/validation.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../states/project.js";
export class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", true, "user-input");
        this.titleInput = this.element.querySelector("#title");
        this.descriptionInput = this.element.querySelector("#description");
        this.peopleInput = this.element.querySelector("#people");
        this.configure();
    }
    renderContent() { }
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
            projectState.addProject(title, description, people);
            this.clearUserInput();
        }
    }
    configure() {
        this.element.addEventListener("submit", this.submit);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submit", null);
//# sourceMappingURL=projectInput.js.map