var util = require('./util.js'),
    newPlan = require('./plan.js').newPlan,
    nodeIDSequence = 0;

function Graph() {
    var G = this;

    G.nodes = {};
    G.parents = {};
    G.children = {};
    G.plans = {};
}

exports.newGraph = function() {
    return new Graph();
};

Graph.prototype.setNode = function(node, id, parents, children) {
    var G = this;

    if (node) {
        if (!id) id = nodeIDSequence++;

        G.nodes[id] = node;
        G.parents[id] = [];
        G.children[id] = [];

        if (parents) G.link([id], parents);
        if (children) G.link(children, [id]);

        return id;
    }
};

Graph.prototype.getNode = function(id) {
    var G = this;

    return G.nodes[id] ? { id: id, node: G.nodes[id] } : null;
};

Graph.prototype.copyLinkedNode = function(id) {
    var G = this,
        result = G.getNode(id);
    
    result.parents = [].concat(G.parents[id]);
    result.children = [].concat(G.children[id]);

    return result;
};

Graph.prototype.getLinkedNode = function(id) {
    var G = this,
        result = G.getNode(id);
    
    result.parents = G.parents[id];
    result.children = G.children[id];

    return result;
};

Graph.prototype.link = function(children, parents) {
    var G = this;

    if (!Array.isArray(children)) children = [children];
    if (!Array.isArray(parents)) parents = [parents];

    for (var i = 0; i < children.length; i++) {
        G._link(children[i], parents);
    }
};

Graph.prototype._link = function(child, parents) {
    var G = this,
        _parents = G.parents[child],
        parent,
        children;

    for (var i = 0; i < parents.length; i++) {
        parent = parents[i];
        children = G.children[parent];
        if (_parents.indexOf(parent) === -1) _parents.push(parent);
        if (children.indexOf(child) === -1) children.push(child);
    }
};

Graph.prototype.createPlan = function(/* ids */) {
    var G = this,
        ids = G._getIDs(arguments),
        plan = newPlan(G, '__plan_root__');

    G.plans[plan.id] = plan;

    for (var id in ids) {
        plan.link(id);
        G.gatherIDs(id, plan);
    }

    return plan;
};

Graph.prototype.gatherIDs = function(id, plan) {
    var G = this,
        children = G.children[id];

    for (var i = 0; i < children.length; i++) {
        plan.link(children[i], id);
        G.gatherIDs(children[i], plan);
    }
};

Graph.prototype._getIDs = function(args) {
    if (args.length) {
        if (Array.isArray(args[0])) {
            return util.arrayToObject(args[0]);
        } else {
            var ids = {};
            for (var i in args) ids[args[i]] = 1;
            return ids;
        }
    }

    return {};
};

Graph.prototype.toString = function() {
    var G = this,
        s = 'Graph:\n',
        roots = G.findRoots();

    for (var j = 0; j < roots.length; j++) {
        s += '== root\n' + G.node2string(roots[j], ' ');
    }

    return s;
};

Graph.prototype.node2string = function(id, spaces) {
    var G = this,
        children = G.children[id],
        s = spaces + id + '\n';

    for (var i = 0; i < children.length; i++) {
        s += spaces + G.node2string(children[i], spaces + ' ');
    }

    return s;
};

Graph.prototype.findRoots = function() {
    var G = this,
        roots = [];

    for (var id in G.parents) {
        if (!G.parents[id].length) {
            roots.push(id);
        }
    }

    return roots;
};
