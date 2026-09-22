const EventEmitter = require('events');
const myEmitter = new EventEmitter();
myEmitter.on('greet', (name) => {
    console.log(`Hello, ${name}! Welcome to node.js.`);
});
myEmitter.on('exit', () => {
    console.log("application closed");
});
myEmitter.emit('greet', 'DM');
myEmitter.emit('exit');
