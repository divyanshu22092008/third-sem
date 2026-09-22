//Visualize the event loop using setTimeout, setImmediate, and process.nextTick
console.log('Start');

setTimeout(() => {
    console.log('setTimeout');
}, 0);

setImmediate(() => {
    console.log('setImmediate');
});

process.nextTick(() => {
    console.log('process.nextTick');
});

console.log('End');
