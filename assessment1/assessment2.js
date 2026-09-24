
const EventEmitter = require("events");

class Element extends EventEmitter {
    constructor(name, parent = null) {
        super();
        this.name = name;
        this.parent = parent;
    }

    addEventListener(type, handler) {
        this.on(type, handler);
    }

    removeEventListener(type, handler) {
        this.off(type, handler);
    }

    dispatchEvent(type, data) {
        const event = {
            type,
            target: this,
            currentTarget: this,
            data,
            propagationStopped: false,

            stopPropagation() {
                this.propagationStopped = true;
            }
        };

        let current = this;

        while (current) {
            event.currentTarget = current;
            current.emit(type, event);

            if (event.propagationStopped) {
                break;
            }

            current = current.parent;
        }
    }
}

// Hierarchy: document -> form -> button
const documentEl = new Element("document");
const formEl = new Element("form", documentEl);
const buttonEl = new Element("button", formEl);
// Click Handlers
const buttonClickHandler = (event) => {
    console.log(
        `[Button] target=${event.target.name}, currentTarget=${event.currentTarget.name}`
    );
};

const formClickHandler = (event) => {
    console.log(
        `[Form] target=${event.target.name}, currentTarget=${event.currentTarget.name}`
    );
};

const documentClickHandler = (event) => {
    console.log(
        `[Document] target=${event.target.name}, currentTarget=${event.currentTarget.name}`
    );
};

buttonEl.addEventListener("click", buttonClickHandler);
formEl.addEventListener("click", formClickHandler);
documentEl.addEventListener("click", documentClickHandler);
// Scenario A
// Event bubbles to document
console.log("\n=== Scenario A ===");
buttonEl.dispatchEvent("click", { message: "Button clicked" });
// Scenario B
// stopPropagation in form
console.log("\n=== Scenario B ===");

// Remove old form handler
formEl.removeEventListener("click", formClickHandler);

// New form handler with stopPropagation
const stopFormHandler = (event) => {
    console.log(
        `[Form] target=${event.target.name}, currentTarget=${event.currentTarget.name}`
    );
    console.log("Form stops propagation.");
    event.stopPropagation();
};

formEl.addEventListener("click", stopFormHandler);

buttonEl.dispatchEvent("click", { message: "Button clicked again" });


// Scenario C
// Remove button listener

console.log("\n=== Scenario C ===");

buttonEl.removeEventListener("click", buttonClickHandler);

buttonEl.dispatchEvent("click", {
    message: "Button listener removed"
});


// Additional Event Type: keypress

console.log("\n=== Keypress Event ===");

formEl.addEventListener("keypress", (event) => {
    console.log(
        `Keypress on ${event.currentTarget.name}: ${event.data.key}`
    );
});

formEl.dispatchEvent("keypress", { key: "Enter" });