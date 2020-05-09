"use strict";
class ProjectInput {
    constructor() {
        this.templateElement =
            document.getElementById("project-input");
        this.hostDivElement =
            document.getElementById("app");
        const newFormElement = document.importNode(this.templateElement.content, true);
        this.formElement =
            newFormElement.firstElementChild;
        this.titleInput =
            this.formElement.querySelector("#title");
        this.descriptionInput =
            this.formElement.querySelector("#description");
        this.peopleInput =
            this.formElement.querySelector("#people");
        this.formElement.id = "user-input";
        this.renderElement();
        this.configure();
    }
    renderElement() {
        this.hostDivElement.insertAdjacentElement("afterbegin", this.formElement);
    }
    submit(event) {
        event.preventDefault();
        console.log(this.titleInput.value);
    }
    configure() {
        this.formElement.addEventListener("submit", this.submit.bind(this));
    }
}
const projectInput = new ProjectInput();
//# sourceMappingURL=app.js.map