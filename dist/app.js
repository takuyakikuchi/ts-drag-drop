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
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    addProject(title, description, numOfPeople) {
        const newProject = new Project(Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
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
            projectState.addProject(title, description, people);
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
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById("project-list");
        this.hostDivElement = document.getElementById("app");
        const newSectionElement = document.importNode(this.templateElement.content, true);
        this.sectionElement = newSectionElement.firstElementChild;
        this.sectionElement.id = `${this.type}-projects`;
        this.assignedProjects = [];
        projectState.addListener((projects) => {
            const relevantProjects = projects.filter((project) => {
                if (this.type === "active") {
                    return project.status === ProjectStatus.Active;
                }
                else {
                    return project.status === ProjectStatus.Finished;
                }
            });
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
        this.renderElement();
        this.renderContent();
    }
    renderProjects() {
        const listElement = document.getElementById(`${this.type}-projects-list`);
        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = projectItem.title;
            listElement.appendChild(listItem);
        }
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.sectionElement.querySelector("ul").id = listId;
        this.sectionElement.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
    }
    renderElement() {
        this.hostDivElement.insertAdjacentElement("beforeend", this.sectionElement);
    }
}
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
//# sourceMappingURL=app.js.map