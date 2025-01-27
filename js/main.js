
window.onload = init
window.onresize = resize


let HEIGHT = 150;
let net = new Network(Math.round(window.innerWidth/10),
		      window.innerWidth, HEIGHT);

function init () {
    createNav();
    highlightPre();
    createArt();
}

function resize () {
    resizeArt();
    resizeNav();    
}



function resizeArt() {
    let art = document.getElementById("art");
    art.setAttribute("width", document.body.scrollWidth);
    net.width = document.body.scrollWidth;
}

function createArt() {
    // createElement does not work for svg
    const addr = "http://www.w3.org/2000/svg"
    let art = document.createElementNS(addr, "svg");
    art.setAttribute("id", "art");
    art.setAttribute("width", document.body.scrollWidth);
    art.setAttribute("height", HEIGHT);
    document.body.prepend(art);

    net.width = document.body.scrollWidth;
    net.height = HEIGHT;

    // create nodes
    net.nodes.forEach( (node) => {
	let circle = document.createElementNS(addr, "circle");
	circle.setAttribute("cx", node.x);
	circle.setAttribute("cy", node.y);
	circle.setAttribute("r",  3);
	circle.setAttribute("fill", "var(--nord4)");
	circle.setAttribute("id", node.id);
	art.append(circle);
    })

    // create links and update positions
    setInterval( () => {
	let oldLinks = new Set(net.links);
	
	net.tick(0.05);
	net.nodes.forEach( (node) => {
	    artNode = art.getElementById(node.id)
	    artNode.setAttribute("cx", node.x);
	    artNode.setAttribute("cy", node.y);
	});

	net.links.forEach( (link) => {
	    artLink = art.getElementById(link);
	    oldLinks.delete(link);
	    
	    if (!artLink) {
		artLink = document.createElementNS(addr, "line");
		artLink.setAttribute("id", link);
		artLink.setAttribute("stroke", "var(--nord4)") // flashing a bit
		art.prepend(artLink);
		artLink = art.getElementById(link);
	    } else {
		artLink.setAttribute("stroke", "var(--nord6)")
	    }
	    
	    
	    let ids = link.split(";");
	    let n1 = art.getElementById(ids[0]);
	    let n2 = art.getElementById(ids[1]);

	    artLink.setAttribute("x1", n1.getAttribute("cx"));
	    artLink.setAttribute("y1", n1.getAttribute("cy"));
	    artLink.setAttribute("x2", n2.getAttribute("cx"));
	    artLink.setAttribute("y2", n2.getAttribute("cy"));
	    artLink.setAttribute("stroke-width", 1)
	});

	oldLinks.forEach( (link) => {
	    if (!art.getElementById(link)) {
		console.log(link);
	    }
	    art.getElementById(link).remove();
	});
	
    }, 50);
}
		 



/**
 * Depending on screen, might be too light, onmouseover highlight
 * the text within.
 */
function highlightPre() {
    let pres = document.getElementsByTagName("pre");
    for (let i = 0; i < pres.length; ++i) {
	pres[i].onmouseover = () => pres[i].style.color = "var(--nord3)";	
	pres[i].onmouseout  = () => pres[i].style.color = "var(--nord4)";
    }
}



/**
 * Resize to always have all navigation links available, whatever the
 * resolution of the screen.
 */
function resizeNav() {
    let nav = document.getElementsByTagName("nav")[0];
    nav.style.width = window.innerHeight + "px";
    
    let rect = nav.getBoundingClientRect();

    document.documentElement.style.setProperty("--left-margin", rect.width + "px");
}

/**
 * Creates the navigation bar on the left of the screen that enables
 * navigation between sections.
 */
function createNav() {
    let nav = document.createElement("nav");
    document.body.prepend(nav);

    let sep = document.createElement("div");
    sep.setAttribute("id", "vertical");
    document.body.prepend(sep);
    
    let sections = document.getElementsByTagName("h2");
    for (let i = 0; i < sections.length; ++i) {
	let section = sections[i];
	let anchor = document.createElement("a");
	anchor.setAttribute("href", "#"+section.getAttribute("id"));
	anchor.text = section.textContent || section.innerText;
	nav.appendChild(anchor);
    }

    // let rect = nav.getBoundingClientRect();
    // sep.style.left = rect.width + "px";
    // nav.style.top = "-" + rect.width + "px";
    
    resizeNav()
}


// function moveNavi(element) {
//     let rect = element.getBoundingClientRect();
//     let navi = document.getElementById("navi");

//     navi.style.left = -6 + rect.x + "px";
//     navi.style.top = -34 + rect.y + "px";
// }

// let epsilon = 30;

// window.onscroll = function() {

//     let about = document.getElementById("About");
//     let publications = document.getElementById("Publications");
//     let projects = document.getElementById("Projects");
//     let contact = document.getElementById("Contact");
    
//     if (about.getBoundingClientRect().y + about.getBoundingClientRect().height >= epsilon) {
// 	moveNavi(document.getElementById("navAbout"));	
//     } else if (publications.getBoundingClientRect().y + publications.getBoundingClientRect().height >= epsilon) {
// 	moveNavi(document.getElementById("navPublications"));	
//     } else if (projects.getBoundingClientRect().y + projects.getBoundingClientRect().height >= epsilon) {
// 	moveNavi(document.getElementById("navProjects"));
//     } else {
// 	moveNavi(document.getElementById("navContact"));
//     }
    

// }
