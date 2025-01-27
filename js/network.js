"use strict";

class Node {

    static NID = 0;
    
    constructor(x, y, vx, vy) {
	Node.NID = Node.NID + 1;
	this.id = Node.NID
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
    }
    
}



class Network {

    static V = 0.002; // velocity factor
    static R = 60; // distance to link
    static C = 0.005; // change direction
    
    constructor(number, width, height) {
	this.nodes = [];
	this.links = new Set();
	
	this.width = width;
	this.height = height;
	
	for (let i = 0; i < number; ++i) {
	    let leftOrRight = Math.random() < 0.5 ? -1 : 1;
	    let topOrBot =  Math.random() < 0.5 ? -1 : 1;
	    this.nodes.push(new Node(Math.random()*width,
				     Math.random()*height,
				     leftOrRight*Math.random()*width*Network.V,
				     topOrBot*Math.random()*height*Network.V));
	};
    }

    tick(dt) {
	for (let i=0; i < this.nodes.length; ++i) {
	    let node = this.nodes[i];

	    // can change direction
	    if (Math.random() < Network.C) {
		let leftOrRight = Math.random() < 0.5 ? -1 : 1;
		let topOrBot =  Math.random() < 0.5 ? -1 : 1;
		node.vx = leftOrRight*Math.random()*this.width*Network.V,
		node.vy = topOrBot*Math.random()*this.height*Network.V;
	    }
	    
	    node.x = (node.x + node.vx * dt) % (this.width + 10);
	    node.y = (node.y + node.vy * dt) % (this.height + 10);
	    node.x = node.x < -10 ? this.width + 10 : node.x;
	    node.y = node.y < -10 ? this.height + 10 : node.y;
	}

	this.links = new Set();
	for (let i=0; i < this.nodes.length; ++i) {
	    for (let j=i; j < this.nodes.length; ++j) {
		if (i != j) {
		    let x = this.nodes[i].x - this.nodes[j].x;
		    let y = this.nodes[i].y - this.nodes[j].y;
		    if (Math.sqrt(x*x + y*y) < Network.R) {
			this.links.add(this.nodes[i].id + ";" + this.nodes[j].id);
		    }
		}
	    }
	}
    }
    
}
