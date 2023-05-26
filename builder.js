class DOMElement {
  constructor(name, ...children) {
    this.name = name;
    this.setChildren(children);
  }

  setChildren(children) {
    this.node = document.createElement(this.name);
    for (let child of children) {
      if (child instanceof Element) {
        this.node.appendChild(child);
      } else if (
        child instanceof Object &&
        child.constructor == new Object().constructor
      ) {
        for (let attr in child) {
          let val = child[attr];
          if (typeof val == "function") {
            this.node[attr] = val.bind(this.node);
          } else {
            this.node.setAttribute(attr, val);
          }
        }
      } else if (child instanceof DOMElement) {
        this.node.appendChild(child.node);
      } else {
        this.node.appendChild(document.createTextNode(String(child)));
      }
    }
    this.children = this.node.childNodes;
  }

  toString() {
    return this.node.outerHTML;
  }
}

class HTML {
  constructor() {
    let target = (() => {});
    target.elem = new DOMElement("html");
    target.toString = target.elem.toString;

    return new Proxy(target, {
      get(object, name, target) {
        return (...children) => new DOMElement(name, ...children);
      },
      apply(object, thisArgs, args) {
        object.elem.setChildren(args);
        return object.elem;
      },
    });
  }
}

let html = new HTML();
