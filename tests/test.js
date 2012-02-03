var chunks = require('../lib/parts/chunks.js').newChunks(),
    newNode = require('../lib/parts/node.js').newNode;

var a1 = newNode('A1 (root node)', function(cb) { console.log('run(A1)'); cb(10) }),
    a2 = a1.addChild(newNode('A2', function(cb) { console.log('run(A2)'); cb(20) })),
    b1 = a2.addChild(newNode('B1', function(cb) { console.log('run(B1)'); cb(30) })),
    b2 = b1.addChild(newNode('B2', function(cb) { console.log('run(B2)'); cb(40) })),
    c1 = a2.addChild(newNode('C1', function(cb) { console.log('run(C1)'); cb(50) })),
    c2 = c1.addChild(newNode('C2', function(cb) { console.log('run(C2)'); cb(60) })),
    d = newNode('D', function(cb) { console.log('run(D)'); cb(70) }),
    e1 = d.addChild(newNode('E1', function(cb) { console.log('run(E1)'); cb(80) })),
    e2 = e1.addChild(newNode('E2', function(cb) { console.log('run(E2)'); cb(90) })),
    f1 = d.addChild(newNode('F1', function(cb) { console.log('run(F1)'); cb(100) })),
    f2 = f1.addChild(newNode('F2', function(cb) { console.log('run(F2)'); cb(110) }));

d.addParent(b2);
d.addParent(c2);

chunks.fillChunks(a1);
console.log('=========\nINITIAL CHUNKS\n---------');
console.log(chunks.toString());
console.log('=========\nRUN JOBS\n---------');
chunks.run();