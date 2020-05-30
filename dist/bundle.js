"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    class Component {
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
    App.Component = Component;
})(App || (App = {}));
var App;
(function (App) {
    function autobind(_, _two, descriptor) {
        const originalMethod = descriptor.value;
        const newMethod = {
            configurable: true,
            get() {
                const boundFunction = originalMethod.bind(this);
                return boundFunction;
            },
        };
        return newMethod;
    }
    App.autobind = autobind;
})(App || (App = {}));
var App;
(function (App) {
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
    App.validation = validation;
})(App || (App = {}));
var App;
(function (App) {
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listenerFn) {
            this.listeners.push(listenerFn);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance;
        }
        addProject(title, description, numOfPeople) {
            const newProject = new App.Project(Math.random().toString(), title, description, numOfPeople, App.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        }
        moveProject(projectId, newStatus) {
            const project = this.projects.find((prj) => prj.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        }
        updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
    }
    App.ProjectState = ProjectState;
    App.projectState = ProjectState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
    class ProjectInput extends App.Component {
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
            if (!App.validation(titleValidatable) ||
                !App.validation(descriptionValidatable) ||
                !App.validation(peopleValidatable)) {
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
                App.projectState.addProject(title, description, people);
                this.clearUserInput();
            }
        }
        configure() {
            this.element.addEventListener("submit", this.submit);
        }
    }
    __decorate([
        App.autobind
    ], ProjectInput.prototype, "submit", null);
    App.ProjectInput = ProjectInput;
})(App || (App = {}));
var App;
(function (App) {
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectList extends App.Component {
        constructor(type) {
            super("project-list", "app", false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
                event.preventDefault();
                const listEl = this.element.querySelector("ul");
                listEl.classList.add("droppable");
            }
        }
        dropHandler(event) {
            const prjId = event.dataTransfer.getData("text/plain");
            App.projectState.moveProject(prjId, this.type === "active" ? App.ProjectStatus.Active : App.ProjectStatus.Finished);
        }
        dragLeaveHandler(_) {
            const listEl = this.element.querySelector("ul");
            listEl.classList.remove("droppable");
        }
        configure() {
            this.element.addEventListener("dragover", this.dragOverHandler);
            this.element.addEventListener("dragleave", this.dragLeaveHandler);
            this.element.addEventListener("drop", this.dropHandler);
            App.projectState.addListener((projects) => {
                const relevantProjects = projects.filter((project) => {
                    if (this.type === "active") {
                        return project.status === App.ProjectStatus.Active;
                    }
                    else {
                        return project.status === App.ProjectStatus.Finished;
                    }
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        }
        renderProjects() {
            const listElement = document.getElementById(`${this.type}-projects-list`);
            listElement.innerHTML = "";
            for (const projectItem of this.assignedProjects) {
                new App.ProjectItem(this.element.querySelector("ul").id, projectItem);
            }
        }
        renderContent() {
            const listId = `${this.type}-projects-list`;
            this.element.querySelector("ul").id = listId;
            this.element.querySelector("h2").textContent =
                this.type.toUpperCase() + " PROJECTS";
        }
    }
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        App.autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    App.ProjectList = ProjectList;
})(App || (App = {}));
var App;
(function (App) {
    new App.ProjectInput();
    new App.ProjectList("active");
    new App.ProjectList("finished");
})(App || (App = {}));
var App;
(function (App) {
    class ProjectItem extends App.Component {
        constructor(hostId, project) {
            super("single-project", hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        get persons() {
            if (this.project.people === 1) {
                return "1 person";
            }
            else {
                return `${this.project.people} persons`;
            }
        }
        dragStartHandler(event) {
            event.dataTransfer.setData("text/plain", this.project.id);
            event.dataTransfer.effectAllowed = "move";
        }
        dragEndHandler(_) {
            console.log("Drag end");
        }
        configure() {
            this.element.addEventListener("dragstart", this.dragStartHandler);
            this.element.addEventListener("dragend", this.dragEndHandler);
        }
        renderContent() {
            this.element.querySelector("h2").textContent = this.project.title;
            this.element.querySelector("h3").textContent = this.persons;
            this.element.querySelector("p").textContent = this.project.description;
        }
    }
    __decorate([
        App.autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map