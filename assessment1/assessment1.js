const EventEmitter = require("events");

class SessionManager extends EventEmitter {
    trigger(command, ...args) {
        if (command === "greet" || command === "exit") {
            this.emit(command, ...args);
        } else {
            console.log(`Unknown event: ${command}`);
        }
    }
}

const session = new SessionManager();

// Regular greet listener
session.on("greet", (username) => {
    console.log(`Hello, ${username}! Welcome.`);
});

// Once listener for first greet
session.once("greet", () => {
    console.log("First login of the day!");
});

// Exit listener
session.on("exit", (code) => {
    console.log(`Session closed with code ${code}. Goodbye!`);
});

// Error listener
session.on("error", (err) => {
    console.log(`Error: ${err.message}`);
});

// Emit greet three times
session.trigger("greet", "Dm");
session.trigger("greet", "Gkv");
session.trigger("greet", "Ag");

// Current listener count for greet
console.log(
    "Current greet listener count:",
    session.listenerCount("greet")
);

// Emit exit
session.trigger("exit", 0);

// Unknown event case
session.trigger("login");

// Emit error event
session.emit("error", new Error("Custom session error"));
