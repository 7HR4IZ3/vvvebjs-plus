/*
Copyright 2017 Ziadin Givan

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

https://github.com/givanz/VvvebJs
*/

// Simple JavaScript Templating
// John Resig - https://johnresig.com/ - MIT Licensed
(function () {
  var cache = {};
  var startTag = "{%";
  var endTag = "%}";
  var re1 = new RegExp(`((^|${endTag})[^\t]*)'`, "g");
  var re2 = new RegExp(`\t=(.*?)${endTag}`, "g");

  this.tmpl = function tmpl(str, data) {
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = /^[-a-zA-Z0-9]+$/.test(str)
      ? (cache[str] =
          cache[str] ||
          tmpl(document.getElementById(str)?.innerHTML || TEMPLATES[str])) // Generate a reusable function that will serve as a template
      : // generator (and which will be cached).
        new Function(
          "obj",
          `var p=[],print=function(){p.push.apply(p,arguments);};
         
        // Introduce the data as local variables using with(){}
        // Convert the template into pure JavaScript
        with(obj){p.push('${str
          .replace(/[\r\t\n]/g, " ")
          .split(startTag)
          .join("\t")
          .replace(re1, "$1\r")
          .replace(re2, "',$1,'")
          .split("\t")
          .join("');")
          .split(endTag)
          .join("p.push('")
          .split("\r")
          .join("\\'")}');}return p.join('');
	`
        );
    // Provide some basic currying to the user
    return data ? fn(data) : fn;
  };
})();

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
    let target = () => {};
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

let dom = new HTML();

var SCREEN_SIZES = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

var delay = (function () {
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

function isElement(obj) {
  return (
    typeof obj === "object" &&
    obj.nodeType === 1 &&
    typeof obj.style === "object" &&
    typeof obj.ownerDocument === "object" /* && obj.tagName != "BODY"*/
  );
}

function displayToast(bg, message) {
  $("#top-toast .toast-body").html(message);
  $("#top-toast .toast-header")
    .removeClass(["bg-danger", "bg-success"])
    .addClass(bg);
  $("#top-toast .toast").addClass("show");
  delay(() => $("#top-toast .toast").removeClass("show"), 5000);
}

function randomId(length) {
  let ret = [];
  for (let i = 0; i < length; i++) {
    ret.push(Math.floor(Math.random() * 10));
  }
  return ret.join("");
}

function changeNodeName(node, newNodeName) {
  let newNode = document.createElement(newNodeName);
  let attributes = node.get(0).attributes;

  for (let attr of attributes) {
    newNode.setAttribute(attr.nodeName, attr.nodeValue);
  }

  $(newNode).append(...node.children);
  $(node).replaceWith(newNode);

  return newNode;
}

var selected = null;
var dragover = null;

let fontList = [
  {
    value: "",
    text: "Default",
  },
  {
    value: "Arial, Helvetica, sans-serif",
    text: "Arial",
  },
  {
    value: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif",
    text: "Lucida Grande",
  },
  {
    value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
    text: "Palatino Linotype",
  },
  {
    value: "'Times New Roman', Times, serif",
    text: "Times New Roman",
  },
  {
    value: "Georgia, serif",
    text: "Georgia, serif",
  },
  {
    value: "Tahoma, Geneva, sans-serif",
    text: "Tahoma",
  },
  {
    value: "'Comic Sans MS', cursive, sans-serif",
    text: "Comic Sans",
  },
  {
    value: "Verdana, Geneva, sans-serif",
    text: "Verdana",
  },
  {
    value: "Impact, Charcoal, sans-serif",
    text: "Impact",
  },
  {
    value: "'Arial Black', Gadget, sans-serif",
    text: "Arial Black",
  },
  {
    value: "'Trebuchet MS', Helvetica, sans-serif",
    text: "Trebuchet",
  },
  {
    value: "'Courier New', Courier, monospace",
    text: "Courier New",
  },
  {
    value: "'Brush Script MT', sans-serif",
    text: "Brush Script",
  },
];

const eventsKey = Symbol("events");
class EventEmitter {
  constructor() {
    this[eventsKey] = {};
  }
  on(events, listener) {
    if (typeof listener === "function") {
      for (let event of events.split(",")) {
        event = event.trim();
        if (this[eventsKey][event] === undefined) {
          this[eventsKey][event] = [];
        }
        this[eventsKey][event].push(listener);
      }
    } else {
      throw new Error(
        " The listener argument must be of type Function. Received type undefined"
      );
    }
    return this;
  }
  // Adds a one time listener to the event. This listener is invoked only the next time the event is fired, after which it is removed.
  once(events, listener) {
    this.on(events, (...args) => {
      listener(...args);
      this.off(events);
    });
    // Returns emitter, so calls can be chained.
    return this;
  }
  // Execute each of the listeners in order with the supplied arguments. Returns true if the event had listeners, false otherwise.
  // emit
  emit(event, ...args) {
    return new Promise((resolve, reject) => {
      let events = [];
      for (let item in this[eventsKey]) {
        if (item.indexOf("*") !== -1) {
          if (new RegExp(item.replace("*", "(.*)")).test(event)) {
            events.push(...this[eventsKey][item]);
          }
        } else {
          if (item === event) {
            events.push(...this[eventsKey][item]);
          }
        }
      }
      let ev = {
        type: "VvebEvent",
        name: event,
        args: args
      };
      for (let item of events) {
        if (typeof item === "function") {
          item(ev, ...args);
        } else if (item && item.listener) {
          item.listener(ev, ...args);
        }
      }
      if (this[eventsKey][event]?.length) {
        resolve(true);
      }
      resolve(false);
    });
  }
  //Removes a listener from the listener array for the specified
  off(event, listener) {
    let eventArray = new Array(...(this[eventsKey][event] || []));
    this[eventsKey][event] = [];
    eventArray.forEach((item, i) => {
      if (item !== listener) {
        this[eventsKey][event].push(item);
      }
    });
    return this;
  }
}

class Plugin {
  init(builder) {
    this.builder = builder;
    this.initialize && this.initialize();
  }
}

class ComponentGroup extends Plugin {
  prefix = "_base";
  name = "base";

  initialize() {
    let keys = Reflect.ownKeys(this).filter(
      (i) => this[i] instanceof Component
    );
    let Vvveb = this.builder;

    Vvveb.ComponentsGroup[this.name] = keys.map((i) => `${this.prefix}/${i}`);
    for (let key of keys) {
      let component = this[key];
      component.type = `${this.prefix}/${key}`;
      component.init(Vvveb);
      component.name = component.name || key;
    }
  }
}

class Section {
  initialize() {
    return $("<></>");
  }
}

class TabSection extends Section {}

class SectionManager {
  constructor(target) {
    this.node = $(target);
  }

  addSection(section) {
    this.node.append(section.initialize());
  }
}

class ConfigurationSection extends TabSection {
  name = "Configuration";

  get content() {
    let node = $("<p>Hello World</p>");
    return node;
  }
}

// builder.Gui.leftPanel.addSection()

class SectionGroup extends Plugin {}

class BlocksGroup extends Plugin {}

let CONFIGURATION_PANEL = "#configuration .component-properties";
let PROPERTIES_PANEL = "#left-panel .component-properties";

class Components {
  constructor(instance) {
    this.builder = instance;
    this._components = {};
    this._nodesLookup = {};
    this._functionLookups = [];
    this._attributesLookup = {};
    this._classesLookup = {};
    this._classesRegexLookup = {};
    this.componentPropertiesElement = PROPERTIES_PANEL;
    this.componentPropertiesDefaultSection = "content";
  }

  get(type) {
    return this._components[type];
  }

  updateProperty(type, key, value) {
    let properties = this._components[type]["properties"];
    for (property in properties) {
      if (key == properties[property]["key"]) {
        return (this._components[type]["properties"][property] = Object.assign(
          properties[property],
          value
        ));
      }
    }
  }

  getProperty(type, key) {
    let properties = this._components[type]
      ? this._components[type]["properties"]
      : [];
    for (property in properties) {
      if (key == properties[property]["key"]) {
        return properties[property];
      }
    }
  }

  add(type, data) {
    data.type = type;

    this._components[type] = data;

    if (data.nodes) {
      for (var i of data.nodes) {
        if (typeof i === "function") {
          this._functionLookups.push([i, data]);
        } else {
          this._nodesLookup[i] = data;
        }
      }
    }

    if (data.attributes) {
      if (data.attributes instanceof Array) {
        for (var i of data.attributes) {
          this._attributesLookup[i] = data;
        }
      } else {
        for (var i in data.attributes) {
          if (typeof this._attributesLookup[i] === "undefined") {
            this._attributesLookup[i] = {};
          }

          if (
            typeof this._attributesLookup[i][data.attributes[i]] === "undefined"
          ) {
            this._attributesLookup[i][data.attributes[i]] = {};
          }

          this._attributesLookup[i][data.attributes[i]] = data;
        }
      }
    }

    if (data.classes) {
      for (var i of data.classes) {
        this._classesLookup[i] = data;
      }
    }

    if (data.classesRegex) {
      for (var i of data.classesRegex) {
        this._classesRegexLookup[i] = data;
      }
    }
  }

  extend(inheritType, type, data) {
    var newData = data;
    let inheritData;

    if ((inheritData = this._components[inheritType])) {
      newData = $.extend(true, {}, inheritData, data);
      newData.properties = $.merge(
        $.merge([], inheritData.properties ? inheritData.properties : []),
        data.properties ? data.properties : []
      );
    }

    //sort by order
    newData.properties.sort(function (a, b) {
      if (typeof a.sort === "undefined") a.sort = 0;
      if (typeof b.sort === "undefined") b.sort = 0;

      if (a.sort < b.sort) return -1;
      if (a.sort > b.sort) return 1;
      return 0;
    });
    this.add(type, newData);
  }

  matchNode(node) {
    var component = {};

    if (!node || !node.tagName) return false;

    if (node.attributes && node.attributes.length) {
      //search for attributes
      for (var i in node.attributes) {
        if (node.attributes[i]) {
          let attr = node.attributes[i].name;
          let value = node.attributes[i].value;

          if (attr in this._attributesLookup) {
            let component = this._attributesLookup[attr];

            //currently we check that is not a component by looking at name attribute
            //if we have a collection of objects it means that attribute value must be checked
            if (typeof component["name"] === "undefined") {
              if (value in component) {
                return component[value];
              }
            } else return component;
          }
          if (attr == "class") {
            let classes = value.split(" ");

            for (let j in classes) {
              if (classes[j] in this._classesLookup)
                return this._classesLookup[classes[j]];
            }

            for (let regex in this._classesRegexLookup) {
              let regexObj = new RegExp(regex);
              if (regexObj.exec(value)) {
                return this._classesRegexLookup[regex];
              }
            }
          }
        }
      }
    }

    let tagName = node.tagName.toLowerCase();
    for (let item of this._functionLookups) {
      let test = item[0](node);
      if (test) {
        return item[1];
      }
    }

    for (let i in this._nodesLookup) {
      if (i === tagName) {
        return this._nodesLookup[i];
      }
    }
    return false;
  }

  render(type, panel = false) {
    return new Promise((resolve, reject) => {
      let self = this;
      let FrameDocument = this.builder.Builder.iframe.contentWindow.document;

      var componentsPanel;
      var component = this._components[type];
      if (!component) return;

      if (panel) {
        componentsPanel = panel;
      } else {
        panel = component.panel || this.componentPropertiesElement;
      }

      componentsPanel = $(panel);
      var defaultSection = this.componentPropertiesDefaultSection;
      var componentsPanelSections = {};

      $(panel + " .tab-pane").each(function () {
        var sectionName = this.dataset.section;
        componentsPanelSections[sectionName] = $(this);
        $('.section[data-section!="default"]', this).remove();
        $('label[for!="header_default"]', this).remove();
        $('input[id!="header_default"]', this).remove();
      });

      var section = componentsPanelSections[defaultSection].find(
        '.section[data-section="default"]'
      );

      if (!(self.builder.preservePropertySections && section.length)) {
        let s = componentsPanelSections[defaultSection];
        s.html("");
        component.name &&
          s.append(
            tmpl("vvveb-input-sectioninput", {
              key: "default",
              header: component.name,
            })
          );
        section = componentsPanelSections[defaultSection].find(".section");
      }

      componentsPanelSections[defaultSection]
        .find('[data-header="default"] span')
        .html(component.name);
      section.html("");

      if (component.beforeInit)
        component.beforeInit(self.builder.Builder.selectedEl.get(0));

      var fn = function (component, property) {
        return property.input_node.on(
          "propertyChange",
          function (event, value, input, ...args) {
            let selectedElement;
            let FrameDocument = this.builder.Builder.iframe.contentWindow.document;
            var element = (selectedElement = self.builder.Builder.selectedEl);

            if (property.config.child)
              element = element.find(property.config.child);
            if (property.config.parent)
              element = element.parent(property.config.parent);

            if (property.config.onChange) {
              let ret = property.config.onChange.bind(property)(
                element,
                value,
                input,
                component,
                ...args
              );
              //if on change returns an object then is returning the dom node otherwise is returning the new value
              if (typeof ret == "object") {
                element = ret;
              } else {
                value = ret;
              }
            } /* else */
            if (property.input.data.htmlAttr) {
              let oldStyle;
              let htmlattr;
              if (typeof property.input.data.htmlAttr === "function") {
                htmlattr = property.input.data.htmlAttr(property);
              } else {
                htmlattr = property.input.data.htmlAttr;
              }
              let oldValue = element.attr(htmlattr);

              if (htmlattr == "class" && property.input.data.validValues) {
                element.removeClass(property.input.data.validValues.join(" "));
                element = element.addClass(value);
              } else if (htmlattr == "style") {
                //keep old style for undo
                oldStyle = $("#vvvebjs-styles", FrameDocument).html();
                element = self.builder.StyleManager.setStyle(
                  element,
                  property.input.data.key,
                  value
                );
              } else if (htmlattr == "innerHTML") {
                element = self.builder.ContentManager.setHtml(element, value);
              } else if (htmlattr == "innerText") {
                element = self.builder.ContentManager.setText(element, value);
                // } else if (htmlattr === "value") {
                //   element.val(value);
              } else {
                //if value is empty then remove attribute useful for attributes without values like disabled
                if (value) {
                  element.attr(htmlattr, value);
                } else {
                  element = element.removeAttr(htmlattr);
                }
              }

              if (htmlattr == "style") {
                let mutation = {
                  type: "style",
                  target: element.get(0),
                  attributeName: htmlattr,
                  oldValue: oldStyle,
                  newValue: $("#vvvebjs-styles", FrameDocument).html(),
                };

                self.builder.Undo.addMutation(mutation);
              } else {
                self.builder.Undo.addMutation({
                  type: "attributes",
                  target: element.get(0),
                  attributeName: htmlattr,
                  oldValue: oldValue,
                  newValue: element.attr(htmlattr),
                });
              }
            }

            if (component.onChange) {
              element = component.onChange(element, property, value, input);
            }

            if (property.config.child || property.config.parent) {
              self.builder.Builder.selectNode(selectedElement);
            } else {
              self.builder.Builder.selectNode(element);
            }

            return element;
          }
        );
      };

      let nodeElement = self.builder.Builder.selectedEl;
      let properties = component.properties;

      function getNode(item) {
        if (item instanceof DOMElement) {
          return $(item.node);
        }
        return $(item);
      }

      function handle_property(property) {
        let element = nodeElement;

        if (property.config.beforeInit) {
          if (
            property.config.beforeInit.bind(property)(element.get(0)) === false
          ) {
            return;
          }
        }

        if (property.config.child)
          element = element.find(property.config.child);
        if (property.config.parent)
          element = element.parent(property.config.parent);

        property.key = property.key || property.input?.key || "";

        // if (property.data) {
        //   property.data["key"] = property.key;
        // } else {
        //   property.data = { key: property.key };
        // }

        if (typeof property.group === "undefined") property.group = null;

        let property_input = property.input;
        property.input_node = $(
          property.input.html.node || property.input.html
        );

        // if (property instanceof PropertyGroup) {
        //   property.input_node = $(property.input.html);
        // } else {
        // }

        let value = "";
        if (property.config.init) {
          property_input.setValue(
            property.config.init.bind(property)(element.get(0))
          );
        } else if (property.input.data.htmlAttr) {
          let htmlAttr;
          if (typeof property.input.data.htmlAttr === "function") {
            htmlAttr = property.input.data.htmlAttr(property);
          } else {
            htmlAttr = property.input.data.htmlAttr;
          }
          if (htmlAttr == "style") {
            //value = element.css(property.key);//jquery css returns computed style
            value = self.builder.StyleManager.getStyle(
              element,
              property.input.data.key
            ); //getStyle returns declared style
          } else if (htmlAttr == "innerHTML") {
            value = self.builder.ContentManager.getHtml(element);
          } else if (htmlAttr == "innerText") {
            value = self.builder.ContentManager.getText(element);
          } else {
            try {
              value = element.attr(htmlAttr);
            } catch (err) {}
          }

          //if attribute is class check if one of valid values is included as class to set the select
          if (value && htmlAttr == "class" && property.input.data.validValues) {
            let valid = value.split(" ").filter(function (el) {
              return property.input.data.validValues.indexOf(el) != -1;
            });
            if (valid && valid.length) {
              value = valid[0];
            }
          }

          if (!value && property.input.data.defaultValue) {
            value = property.input.data.defaultValue;
          }

          property_input.setValue(value);
        } else {
          if (!value && property.input.data.defaultValue) {
            value = property.input.data.defaultValue;
          }

          property_input.setValue(value);
        }

        fn(component, property);

        let propertySection = defaultSection;
        if (property.config.section) {
          propertySection = property.config.section;
        }

        if (property instanceof PropertyGroup) {
          section = componentsPanelSections[propertySection].find(
            '.section[data-section="' + property.key + '"]'
          );

          if (self.builder.preservePropertySections && section.length) {
            section.html("");
          } else {
            let target = componentsPanelSections[propertySection];
            if (property.section) {
              property.section.append(property.input_node);
            } else {
              target.append(property.input_node);
            }
            section = target.find(
              '.section[data-section="' + property.key + '"]'
            );
          }

          for (let i of property.properties) {
            if (i instanceof PropertyGroup) {
              i.section = section;
            }
            if (i.config && !i.config.section) {
              i.config.section = property.config.section;
            }
            handle_property(i);
          }
          if (property.section) {
            section = property.section;
          }
        } else {
          let row = getNode(property.html.node || property.html);
          row.find(".input").append(property.input_node);
          section.append(row);
          property.input.init && property.input.init(property.input_node);
        }

        if (property.config.afterInit) {
          property.config.afterInit(element.get(0), property.input_node);
        }
      }

      for (let i in properties) {
        let property = properties[i];

        if (typeof property === "function") {
          let props = property.bind(component)(nodeElement.get(0));
          for (let p of props) {
            handle_property(p);
          }
        } else {
          handle_property(property);
        }
      }
      // if (component.config.init) component.config.init(self.builder.Builder.selectedEl.get(0));
    });
  }
}

class Blocks {
  _blocks = {};

  get(type) {
    return this._blocks[type];
  }

  add(type, data) {
    data.type = type;
    this._blocks[type] = data;
  }
}

class Sections {
  _sections = {};

  get(type) {
    return this._sections[type];
  }

  add(type, data) {
    data.type = type;
    this._sections[type] = data;
  }
}

class WYSIWYGEditor {
  constructor(instance) {
    this.builder = instance;
    this.isActive = false;
    this.oldValue = "";
    this.doc = false;
  }

  editorSetStyle(tag, style = {}, toggle = false) {
    let iframeWindow = this.builder.Builder.iframe.contentWindow;
    let selection = iframeWindow.getSelection();
    let element = this.element;
    let range;

    if (!tag) {
      tag = "span";
    }

    if (selection.rangeCount > 0) {
      //check if the whole text is inside an existing node to use the node directly
      if (
        (selection.baseNode &&
          selection.baseNode.nextSibling == null &&
          selection.baseNode.previousSibling == null &&
          selection.anchorOffset == 0 &&
          selection.focusOffset == selection.baseNode.length) ||
        selection.anchorOffset == selection.focusOffset
      ) {
        element = selection.baseNode.parentNode;
      } else {
        element = document.createElement(tag);
        range = selection.getRangeAt(0);
        range.surroundContents(element);
        range.selectNodeContents(element.childNodes[0], 0);
      }
    }

    if (element && style) {
      for (name in style) {
        if (!style[name] || (toggle && element.style.getPropertyValue(name))) {
          element.style.removeProperty(name);
        } else {
          element.style.setProperty(name, style[name]);
        }
      }
    }

    //if edited text is an empty span remove the span
    if (
      element.tagName == "SPAN" &&
      element.style.length == 0 &&
      element.attributes.length <= 1
    ) {
      let textNode = iframeWindow.document.createTextNode(element.innerText);
      element.replaceWith(textNode);
      element = textNode;

      range = iframeWindow.document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    //select link element to edit link etc
    if (tag == "a") {
      this.builder.Builder.selectNode(element);
      this.builder.Builder.loadNodeComponent(element);
    }
    return element;
  }

  init(doc) {
    this.doc = doc;
    let self = this;

    $("#bold-btn").on("click", function (e) {
      //doc.execCommand('bold',false,null);
      //self.editorSetStyle("b", {"font-weight" : "bold"}, true);
      self.editorSetStyle(false, { "font-weight": "bold" }, true);
      e.preventDefault();
      return false;
    });

    $("#italic-btn").on("click", function (e) {
      //doc.execCommand('italic',false,null);
      //self.editorSetStyle("i", {"font-style" : "italic"}, true);
      self.editorSetStyle(false, { "font-style": "italic" }, true);
      e.preventDefault();
      return false;
    });

    $("#underline-btn").on("click", function (e) {
      //doc.execCommand('underline',false,null);
      //self.editorSetStyle("u", {"text-decoration" : "underline"}, true);
      self.editorSetStyle(false, { "text-decoration": "underline" }, true);
      e.preventDefault();
      return false;
    });

    $("#strike-btn").on("click", function (e) {
      //doc.execCommand('strikeThrough',false,null);
      //self.editorSetStyle("strike",  {"text-decoration" : "line-through"}, true);
      self.editorSetStyle(false, { "text-decoration": "line-through" }, true);
      e.preventDefault();
      return false;
    });

    $("#link-btn").on("click", function (e) {
      //doc.execCommand('createLink',false,"#");
      self.editorSetStyle("a");
      e.preventDefault();
      return false;
    });

    $("#fore-color").on("change", function (e) {
      //doc.execCommand('foreColor',false,this.value);
      self.editorSetStyle(false, { color: this.value });
      e.preventDefault();
      return false;
    });

    $("#back-color").on("change", function (e) {
      //doc.execCommand('hiliteColor',false,this.value);
      self.editorSetStyle(false, { "background-color": this.value });
      e.preventDefault();
      return false;
    });

    $("#font-size").on("change", function (e) {
      //doc.execCommand('fontSize',false,this.value);
      self.editorSetStyle(false, { "font-size": this.value });
      e.preventDefault();
      return false;
    });

    let sizes = "<option value=''> - Font size - </option>";
    for (let i = 1; i <= 128; i++) {
      sizes += "<option value='" + i + "px'>" + i + "</option>";
    }
    $("#font-size").html(sizes);

    $("#font-family").on("change", function (e) {
      let option = this.options[this.selectedIndex];
      let element = self.editorSetStyle(false, { "font-family": this.value });
      this.builder.FontsManager.addFont(
        option.dataset.provider,
        this.value,
        element
      );
      //doc.execCommand('fontName',false,this.value);
      e.preventDefault();
      return false;
    });

    $("#justify-btn a").on("click", function (e) {
      //var command = "justify" + this.dataset.value;
      //doc.execCommand(command,false,"#");
      self.editorSetStyle(false, { "text-align": this.dataset.value });
      e.preventDefault();
      return false;
    });
  }

  undo() {
    this.doc.execCommand("undo", false, null);
  }

  redo() {
    this.doc.execCommand("redo", false, null);
  }

  edit(element) {
    element.attr({ contenteditable: true, spellcheckker: false });
    $("#wysiwyg-editor").show();

    this.element = element;
    this.isActive = true;
    this.oldValue = element.html();

    $("#font-familly").val(getComputedStyle(element[0])["font-family"]);
    element.focus();
  }

  destroy(element) {
    element.removeAttr("contenteditable spellcheckker");
    $("#wysiwyg-editor").hide();
    this.isActive = false;

    let node = this.element.get(0);
    this.builder.Undo.addMutation({
      type: "characterData",
      target: node,
      oldValue: this.oldValue,
      newValue: node.innerHTML,
    });
  }
}

class BuilderPage extends Plugin {
  constructor(name, config) {
    super();
    let self = this;
    this.name = name;
    this.config = config;

    this.iframe = $(
      dom.iframe({
        class: "col",
        onmouseenter() {
          self.builder.Builder.currentPageName = name;
        },
      }).node
    );
    $("#editors").append(this.iframe);

    this.selectedEl = null;
    this.highlightEl = null;

    this.showing = false;
  }

  initialize() {
    this.builder.emit("builder_page:init", this);
  }

  load(url, callback) {
    this.builder.Builder._loadIframe(url || this.config.url, callback, this);
    this.render();
    this.builder.emit("builder_page:load", this);
  }

  toggle() {
    this.builder.emit("builder_page:toggle.before", this);
    if (this.showing === false) {
      this.iframe.show();
      this.render();
      this.showing = true;
    } else {
      this.iframe.hide();
      this.showing = false;
    }
    this.builder.emit("builder_page:toggle", this, this.showing);
  }

  render() {
    // $("#highlight-box").css({ display: "none" });
    // $("#select-box").css({ display: "none" });

    if (this.selectedEl) {
      this.builder.Builder.selectNode(this.selectedEl);
      this.builder.Builder.loadNodeComponent(this.selectedEl);
    }
  }

  delete() {
    this.builder.emit("builder_page:delete.before", this);
    this.iframe.get(0).remove();
    this.builder.emit("builder_page:delete", this);
  }
}

class Builder {
  constructor(instance) {
    this.builder = instance;
    this.component = {};
    this.dragMoveMutation = false;
    this.isPreview = false;
    this.allowResizeableElements = false;
    this.runJsOnSetHtml = false;
    this.designerMode = false;
    this.highlightEnabled = false;
    this.selectPadding = 0;
    this.leftPanelWidth = 275;
    this.ignoreClasses = ["clearfix"];
    this.pages = new Map();
    this.holdingCtrl = false;
    this.currentPageName = "";
    this._currentPageName = "";

    $(window).on("keydown", (ev) => {
      if (ev.originalEvent.key == "Control") {
        this.holdingCtrl = true;
      }
    });
    $(window).on("keyup", (ev) => {
      if (ev.originalEvent.key == "Control") {
        this.holdingCtrl = false;
      }
    });
  }

  init(url, callback) {
    var self = this;

    self.pageName = 0;
    // self.highlightEl = null;
    self.initCallback = callback;

    // self.documentFrame = $("#iframe-wrapper > iframe");
    // self.canvas = $("#iframe-wrapper");

    self.loadControlGroups();
    self.loadBlockGroups();
    self.loadSectionGroups();

    self._initEditorManager();

    // self._loadIframe(url, callback);

    self._initDragdrop();

    self._initBox();

    self.dragElement = null;

    self.highlightEnabled = true;

    self.leftPanelWidth = $("#left-panel").width();

    self.adjustListsHeight();
  }

  get selectedEl() {
    return this.page?.selectedEl;
  }

  set selectedEl(value) {
    this.page.selectedEl = value;
  }

  get highlightEl() {
    return this.page?.highlightEl;
  }

  set highlightEl(value) {
    this.page.highlightEl = value;
  }

  get currentPageName() {
    return this._currentPageName;
  }

  set currentPageName(value) {
    if (value === this._currentPageName) return;
    this._currentPageName = value;
    this.builder.emit("builder:page.focus", value);
  }

  get iframe() {
    return this.page?.iframe.get(0);
  }

  get page() {
    return this.pages.get(this.pageName);
  }

  get currentPage() {
    return this.pages.get(this.currentPageName || this.pageName);
  }

  addPage(name, config) {
    let item = new BuilderPage(name, config);
    item.init(this.builder);
    this.pages.set(name, item);
    this.builder.emit("builder:page.add", name, item);
    return item;
  }

  setPage(page, split) {
    let name = page.name || page;
    if (name == this.page?.name) {
      return null;
    }
    this.pageName = name;

    let keys = this.pages.keys();
    page = this.pages.get(this.pageName);
    if (!page) {
      this.loadPage(this.pageName);
    }

    if (!split && this.holdingCtrl == false) {
      for (let key of keys) {
        let item = this.pages.get(key);
        if (item.showing === true) item.toggle();
      }
    }
    page.toggle();

    this._addEditorItem(page.name, page);
    localStorage.setItem("vvveb.page", name);

    this.builder.emit("builder:page.set", name, page);
  }

  loadPage(name, split = false) {
    if (name == this.page?.name) {
      return null;
    }
    this.builder.FileManager.loadPage(name, split);
    this.builder.emit("builder:page.load", name);
  }

  _initEditorManager() {
    let self = this;
    this.editorTree = $("#editormanager .tree > ol").html("");

    $(this.editorTree).on("click", "a", function (e) {
      e.preventDefault();
      return false;
    });

    $(this.editorTree).on("click", ".close", function (e) {
      e.preventDefault();
      let element = $(e.target).closest("li");
      let page = self.pages.get(element.attr("data-page"));
      page.delete();
      self.pages.delete(element.attr("data-page"));
      element.remove();

      let last = [...self.pages.keys()].at(-1);
      if (last) {
        self.currentPageName = last;
        self.setPage(last);
      }
      return false;
    });

    // $(this.editorTree).on("click", ".rename", function (e) {
    //   let element = $(e.target).closest("li");
    //   self.renamePage(element, e, false);
    //   e.preventDefault();
    //   return false;
    // });

    // $(this.editorTree).on("click", ".duplicate", function (e) {
    //   let element = $(e.target).closest("li");
    //   self.renamePage(element, e, true);
    //   e.preventDefault();
    //   return false;
    // });

    $(this.editorTree).on("click", "li[data-page] label", function () {
      var page = $(this.parentNode).data("page");
      if (page) {
        for (let key of self.pages.keys()) {
          let item = self.pages.get(key);
          if (item.showing === true) {
            item.toggle();
          }
          if (key == page) item.toggle();
        }
        $(this).addClass("active");
      }
      return false;
    });

    $(this.editorTree)
      .on("click", "li[data-component] label ", function (e) {
        let node = $(e.currentTarget.parentNode).data("node");

        delay(
          () =>
            self.builder.Builder.frameHtml.animate(
              {
                scrollTop: $(node).offset().top - $(node).height() / 2,
              },
              500
            ),
          500
        );

        node.click();
      })
      .on("mouseenter", "li[data-component] label", function (e) {
        let node = $(e.currentTarget.parentNode).data("node");

        delay(
          () =>
            self.builder.Builder.frameHtml.animate(
              {
                scrollTop: $(node).offset().top - $(node).height() / 2,
              },
              500
            ),
          1000
        );

        $(node).trigger("mousemove");
      });
  }

  _addEditorItem(name, data) {
    var folder = this.editorTree;
    if (!folder.find(`li[data-page="${name}"]`).get(0)) {
      folder.append(tmpl("vvveb-editormanager-page", data));
    }
    this.builder.emit(
      "manager.editor:item.add",
      name,
      this.pages.get(name),
      folder
    );
  }

  /* controls */
  loadControlGroups() {
    let self = this;
    let componentsList = $(".components-list");
    componentsList.empty();
    let item = {};
    let count = 0;

    componentsList.each(function () {
      let list = $(this);
      let type = this.dataset.type;
      count++;

      for (let group in self.builder.ComponentsGroup) {
        list.append(
          `<li class="header" data-section="${group}"  data-search="">
					<label class="header" for="${type}_comphead_${group}${count}">
						${group}<div class="header-arrow"></div>
					</label>
					<input class="header_check" type="checkbox" checked="true" id="${type}_comphead_${group}${count}">
					<ol></ol>
				</li>`
        );

        let componentsSubList = list.find(
          'li[data-section="' + group + '"]  ol'
        );

        let components = self.builder.ComponentsGroup[group];

        for (let i in components) {
          let componentType = components[i];
          let component = self.builder.Components.get(componentType);

          if (component) {
            item =
              $(`<li data-section="${group}" data-drag-type="component" data-type="${componentType}" data-search="${component.name.toLowerCase()}" title="${component.description || ''}">
							<a href="#">${component.name}</a>
						</li>`);

            if (component.image) {
              item.css({
                backgroundImage:
                  "url(" + self.builder.imgBaseUrl + component.image + ")",
                backgroundRepeat: "no-repeat",
              });
            }
            componentsSubList.append(item);
          }
        }
      }
    });
  }

  loadSectionGroups() {
    let self = this;
    var sectionsList = $(".sections-list");
    sectionsList.empty();
    var item = {};

    sectionsList.each(function () {
      var list = $(this);
      var type = this.dataset.type;

      for (let group in self.builder.SectionsGroup) {
        list.append(
          `<li class="header" data-section="${group}"  data-search="">
					<label class="header" for="${type}_sectionhead_${group}">
						${group}<div class="header-arrow"></div>
					</label>
					<input class="header_check" type="checkbox" checked="true" id="${type}_sectionhead_${group}">
					<ol></ol>
				</li>`
        );

        var sectionsSubList = list.find('li[data-section="' + group + '"]  ol');
        let sections = self.builder.SectionsGroup[group];

        for (let i in sections) {
          let sectionType = sections[i];
          let section = self.builder.Sections.get(sectionType);

          if (section) {
            item =
              $(`<li data-section="${group}" data-type="${sectionType}" data-search="${section.name.toLowerCase()}">
									<a class="name" href="#">${section.name}</a>
									<a class="add-section-btn" href="" title="Add section"><i class="la la-plus"></i></a>
									<img class="preview" src="" loading="lazy">
								</li>`);

            if (section.image) {
              var image =
                (section.image.indexOf("/") == -1
                  ? self.builder.imgBaseUrl
                  : "") + section.image;

              item
                .css({
                  //backgroundImage: "url(" + image + ")",
                  backgroundRepeat: "no-repeat",
                })
                .find("img")
                .attr("src", image);
            }

            sectionsSubList.append(item);
          }
        }
      }
    });
  }

  loadBlockGroups() {
    let self = this;
    var blocksList = $(".blocks-list");
    blocksList.empty();
    var item = {};

    blocksList.each(function () {
      var list = $(this);
      var type = this.dataset.type;

      for (let group in self.builder.BlocksGroup) {
        list.append(
          `<li class="header" data-section="${group}"  data-search="">
					<label class="header" for="${type}_blockhead_${group}">
						${group}<div class="header-arrow"></div>
					</label>
					<input class="header_check" type="checkbox" checked="true" id="${type}_blockhead_${group}">
					<ol></ol>
				</li>`
        );

        var blocksSubList = list.find('li[data-section="' + group + '"]  ol');
        let blocks = self.builder.BlocksGroup[group];

        for (let i in blocks) {
          let blockType = blocks[i];
          let block = self.builder.Blocks.get(blockType);

          if (block) {
            item =
              $(`<li data-section="${group}" data-drag-type="block" data-type="${blockType}" data-search="${block.name.toLowerCase()}">
									<a class="name" href="#">${block.name}</a>
									<img class="preview" src="" loading="lazy">
								</li>`);

            if (block.image) {
              var image =
                (block.image.indexOf("/") == -1
                  ? self.builder.imgBaseUrl
                  : "") + block.image;

              item
                .css({
                  backgroundImage: "url(" + image + ")",
                  backgroundRepeat: "no-repeat",
                })
                .find("img")
                .attr("src", image);
            }

            blocksSubList.append(item);
          }
        }
      }
    });
  }

  adjustListsHeight() {
    let lists = $(".drag-elements-sidepane > div:not(.block-preview)");
    let properties = $(".component-properties >.tab-content");
    let wHeight = $(window).height();

    function adjust(elements) {
      let maxOffset = 0;

      elements.each(function (i, e) {
        maxOffset = Math.max(maxOffset, e.getBoundingClientRect()["top"]);
      });

      elements.each(function (i, e) {
        e.style.height = wHeight - maxOffset + "px";
      });
    }

    adjust(lists);
    adjust(properties);
  }

  loadUrl(url, callback) {
    var self = this;
    $("#select-box").hide();

    self.initCallback = callback;
    if (this.builder.Builder.iframe.src != url)
      this.builder.Builder.iframe.src = url;
  }

  /* iframe */
  _loadIframe(url, callback, page) {
    let self = this;
    let iframe = page?.iframe.get(0) || self.iframe;
    let FrameWindow = iframe.contentWindow;
    let FrameDocument = iframe.contentWindow.document;
    // self.iframe = this.documentFrame.get(0);
    iframe.src = url;

    return $(iframe).on("load", function () {
      self.currentPageName = self.pageName;

      let highlightBox = $("#highlight-box").hide();

      $(FrameWindow).on("beforeunload", function (event) {
        if (self.builder.Undo.undoIndex >= 0) {
          let dialogText = "You have unsaved changes";
          event.returnValue = dialogText;
          return dialogText;
        }
      });

      self.builder.Gui.contextMenu.attach(FrameWindow, "contextmenu");

      $(FrameWindow).on("unload", function () {
        // $(".loading-message").addClass("active");
        self.builder.Undo.reset();
      });

      //prevent accidental clicks on links when editing text
      $(FrameDocument).on("click", "a", function (event) {
        if (self.builder.WysiwygEditor.isActive) {
          event.preventDefault();
          return false;
        }
      });

      $(FrameWindow).on("scroll resize", function () {
        if (self.selectedEl) {
          let offset = self.selectedEl.offset();
          let iframe = self.pages.get(
            self.currentPageName || self.pageName
          ).iframe;
          let frameDoc = $(iframe.get(0).contentDocument);
          let ioffset = iframe.offset();

          let style = {
            top: ioffset.top + offset.top - frameDoc.scrollTop(),
            left: ioffset.left + offset.left - frameDoc.scrollLeft(),
            width: offset.width,
            height: offset.height,
          };

          $("#select-box").css(style);
        }

        if (self.highlightEl) {
          let offset = self.highlightEl.offset();
          let iframe = self.pages.get(
            self.currentPageName || self.pageName
          ).iframe;
          let frameDoc = $(iframe.get(0).contentDocument);
          let ioffset = iframe.offset();

          let style = {
            top: ioffset.top + offset.top - frameDoc.scrollTop(),
            left: ioffset.left + offset.left - frameDoc.scrollLeft(),
            width: offset.width,
            height: offset.height,
            position: "fixed",
          };

          highlightBox.css(style);
        }

        if ($(window).outerWidth() <= SCREEN_SIZES.md) {
          $("#toggle-left-column-btn").attr("data-bs-toggle", "offcanvas");
        } else {
          $("#toggle-left-column-btn").removeAttr("data-bs-toggle");
        }

        self.adjustListsHeight();
      });

      self.builder.WysiwygEditor.init(FrameDocument);
      self.builder.emit("wysisyg:init");

      self.builder.StyleManager.init(FrameDocument);
      self.builder.emit("manager.style:init");

      self.builder.ColorPaletteManager.init(FrameDocument);
      self.builder.emit("manager.palette:init");


      self.builder.emit("builder:iframe.load");

      if (self.initCallback) self.initCallback();
      if (callback) callback();

      return self._frameLoaded();
    });
  }

  get frameDoc() {
    let name = this.currentPageName || this.pageName;
    let page = this.pages.get(name);
    let FrameDocument = page?.iframe.get(0).contentDocument;
    return $(FrameDocument);
  }
  get frameHtml() {
    return this.frameDoc.find("html");
  }
  get frameBody() {
    return this.frameDoc.find("body");
  }
  get frameHead() {
    return this.frameDoc.find("head");
  }

  _frameLoaded() {
    var _self = this.builder;
    var self = this.builder.Builder;

    // let mutationObserver = new MutationObserver(mutations => {
    //   mutations.forEach(item => {
    //     console.log(item, item.target instanceof Node)
    //     if (item.target) {
    //       _self.Undo.mutations.splice(++_self.Undo.undoIndex, _self.Undo.mutations.length - _self.Undo.undoIndex, item);
    //       self.frameBody.trigger("vvveb.undo.add", item);
    //     }
    //   })
    // })
    // mutationObserver.observe(
    //   self.frameDoc.get(0).querySelector("html"),
    //   { childList: true, attributes: true, subtree: true }
    // );
    // mutationObserver
    // let FrameDocument = self.iframe.contentWindow.document;

    // self.frameDoc = $(FrameDocument);
    // self.frameHtml = $(FrameDocument).find("html");
    // self.frameBody = $(FrameDocument).find("body");
    // self.frameHead = $(FrameDocument).find("head");

    // self.builder.Gui.contextMenu.attach(self.frameBody);

    //insert editor helpers like non editable areas
    self.frameHead.append(
      '<link data-vvveb-helpers href="' +
        this.builder.baseUrl +
        '../../css/vvvebjs-editor-helpers.css" rel="stylesheet">'
    );

    self._initHighlight();

    self.builder.emit("builder:iframe.loaded", self.frameDoc);
    $(".loading-message").removeClass("active");

    //enable save button only if changes are made
    self.frameBody.on("builder.undo.add builder.undo.restore", () => {
      if (this.builder.Undo.hasChanges()) {
        $("#top-panel .save-btn").removeAttr("disabled");
      } else {
        $("#top-panel .save-btn").attr("disabled", "true");
      }
    });
  }

  _getElementType(el) {
    //search for component attribute
    let componentName = "";
    let componentAttribute = "";

    el.get && (el = el.get(0));

    if (el.attributes) {
      for (let attr of el.attributes) {
        let nodeName = attr.name;

        if (nodeName.indexOf("data-component") > -1) {
          componentName = nodeName.replace("data-component-", "");
        }

        if (nodeName.indexOf("data-v-") > -1) {
          componentAttribute =
            (componentAttribute ? componentAttribute + " - " : "") +
            nodeName.replace("data-v-", "") +
            " ";
        }

        if (nodeName == "id" && attr.value) {
          componentAttribute = `#${attr.value}`;
        }
      }
    }
    if (componentName != "") return componentName;
    let name = el.tagName;
    name = name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
    return (
      name +
      (componentName ? " - " + componentName : "") +
      (componentAttribute ? " - " + componentAttribute : "")
    );
  }

  loadNodeComponent(node) {
    let data = this.builder.Components.matchNode(node);
    let component;

    if (data) component = data.type;
    else component = this.builder.defaultComponent;
    this.builder.component = this.builder.Components.get(component);
    this.builder.Components.render(component);
  }

  moveNodeUp(node) {
    if (!node) {
      node = this.builder.Builder.selectedEl.get(0);
    }

    let oldParent = node.parentNode;
    let oldNextSibling = node.nextSibling;

    let next = $(node).prev();

    if (next.length > 0) {
      next.before(node);
    } else {
      $(node).parent().before(node);
    }

    let newParent = node.parentNode;
    let newNextSibling = node.nextSibling;

    this.builder.emit("builder:node.move", node, "up", {
      oldParent,
      oldNextSibling,
      newParent,
      newNextSibling,
    });

    this.builder.Undo.addMutation({
      type: "move",
      target: node,
      oldParent: oldParent,
      newParent: newParent,
      oldNextSibling: oldNextSibling,
      newNextSibling: newNextSibling,
    });
  }

  moveNodeDown(node) {
    if (!node) {
      node = this.builder.Builder.selectedEl.get(0);
    }

    let oldParent = node.parentNode;
    let oldNextSibling = node.nextSibling;

    let next = $(node).next();

    if (next.length > 0) {
      next.after(node);
    } else {
      $(node).parent().after(node);
    }

    let newParent = node.parentNode;
    let newNextSibling = node.nextSibling;

    this.builder.emit("builder:node.move", node, "down", {
      oldParent,
      oldNextSibling,
      newParent,
      newNextSibling,
    });

    this.builder.Undo.addMutation({
      type: "move",
      target: node,
      oldParent: oldParent,
      newParent: newParent,
      oldNextSibling: oldNextSibling,
      newNextSibling: newNextSibling,
    });
  }

  cloneNode(node) {
    if (!node) {
      node = this.builder.Builder.selectedEl;
    }

    let clone = node.clone();

    node.after(clone);

    node = clone.click();

    let element = clone.get(0);
    this.builder.emit("builder:node.clone", node.get(0), element);

    this.builder.Undo.addMutation({
      type: "childList",
      target: node.parentNode,
      addedNodes: [element],
      nextSibling: node.nextSibling,
    });
  }

  selectNode(node) {
    let self = this;

    if (!node) {
      $("#select-box").hide();
      return;
    }

    if (self.texteditEl && self.selectedEl.get(0) != node) {
      this.builder.WysiwygEditor.destroy(self.texteditEl);
      self.selectPadding = 0;
      $("#select-box").removeClass("text-edit").find("#select-actions").show();
      self.texteditEl = null;
    }

    let target = $(node);

    if (target) {
      self.selectedEl = target;

      try {
        let offset = target.offset();
        let iframe = self.pages.get(
          self.currentPageName || self.pageName
        ).iframe;
        let frameDoc = $(iframe.get(0).contentDocument);
        let ioffset = iframe.offset();

        let style = {
          top: ioffset.top + offset.top - frameDoc.scrollTop(),
          left: ioffset.left + offset.left - frameDoc.scrollLeft(),
          display: "block",
          width: target.outerWidth() + self.selectPadding * 2,
          height: target.outerHeight() + self.selectPadding * 2,
          position: "fixed",
        };
        $("#select-box").css(style);

        this.builder.Breadcrumb.loadBreadcrumb(target.get(0));
        $("#highlight-name").html(this._getElementType(node));
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  }

  getPercent(width, against) {
    return `${(width / against) * 100}%`;
  }

  /* iframe highlight */
  _initHighlight() {
    let _self = this;
    let self = this.builder.Builder;

    self.frameBody.on("mousemove dragover touchmove", function (event) {
      let target;
      if (
        self.highlightEnabled == true &&
        event.target &&
        isElement(event.target) &&
        event.originalEvent
      ) {
        self.highlightEl = target = $(event.target);
        let offset = target.offset();
        let height = target.outerHeight();
        let halfHeight = Math.max(height / 2, 50);
        let width = target.outerWidth();
        let halfWidth = Math.max(width / 2, 50);
        let prepend = true;

        let x = event.originalEvent.x;
        let y = event.originalEvent.y;

        if (self.isResize) {
          if (!self.initialPosition) {
            self.initialPosition = { x, y };
          }

          let deltaX = x - self.initialPosition.x;
          let deltaY = y - self.initialPosition.y;

          offset = self.selectedEl.offset();

          width = self.initialSize.width;
          height = self.initialSize.height;

          switch (self.resizeHandler) {
            // top
            case "top-left":
              height -= deltaY;
              width -= deltaX;
              break;

            case "top-center":
              height -= deltaY;
              break;

            case "top-right":
              height -= deltaY;
              width += deltaX;
              break;

            // center
            case "center-left":
              width -= deltaX;
              break;

            case "center-right":
              width += deltaX;
              break;

            // bottom
            case "bottom-left":
              width -= deltaX;
              height += deltaY;
              break;

            case "bottom-center":
              height += deltaY;
              break;

            case "bottom-right":
              width += deltaX;
              height += deltaY;
              break;
          }

          if (self.resizeMode == "css") {
            let selectedEl = self.selectedEl.get(0);

            let oldAttrs = selectedEl.attributes.style;
            self.selectedEl.css({
              width: self.getPercent(width, self.frameBody.outerWidth()),
              height: self.getPercent(height, self.frameBody.outerHeight()),
            });

            let mutation = {
              type: "attributes",
              target: selectedEl,
              attributeName: "style",
              oldValue: oldAttrs,
              newValue: selectedEl.attributes.style,
            };
            _self.builder.Undo.addMutation(mutation);
          } else {
            self.selectedEl.attr({ width, height });
          }

          $("#select-box").css({
            top: offset.top - self.frameDoc.scrollTop(),
            left: offset.left - self.frameDoc.scrollLeft(),
            width: width,
            height: self.selectedEl.outerHeight(),
          });
          let rect = self.selectedEl.get(0).getBoundingClientRect();

          let style = {
            top: rect.top - offset.top, // - self.frameDoc.scrollTop(),
            left: rect.left - offset.left, // - self.frameDoc.scrollLeft(),
            width: rect.width, //width,
            height: rect.height, //height,
            display:
              event.target.getAttribute("contenteditable") == false
                ? "none"
                : "block",
            "border-left": self.isDragging ? "3px dashed limegreen" : "",
          };

          $("#highlight-box").css(style);
        } //else
        if (self.isDragging) {
          var parent = self.highlightEl;

          try {
            if (offset.top < y - halfHeight || offset.left < x - halfWidth) {
              parent.append(self.dragElement);
              prepend = true;
              // self.dragElement.appendTo(parent);
            } else {
              prepend = false;
              // self.dragElement.prependTo(parent);
              parent.prepend(self.dragElement);
            }

            if (self.designerMode) {
              var parentOffset = self.dragElement.offsetParent().offset();

              self.dragElement.css({
                position: "absolute",
                left: x - (parentOffset.left - self.frameDoc.scrollLeft()),
                top: y - (parentOffset.top - self.frameDoc.scrollTop()),
              });
            }

            $("#drop-highlight-box").css({
              top: offset.top - self.frameDoc.scrollTop(),
              left: offset.left - self.frameDoc.scrollLeft(),
              width: parent.Width,
              height: "5px",
              display: "block",
              borderLeft: "2px dashed limegreen",
            });
          } catch (err) {
            // console.log(err);
            return false;
          }

          if (!self.designerMode && self.iconDrag) {
            self.iconDrag.css({
              left: x + self.leftPanelWidth + 10,
              top: y + 60,
            });
          }
        } //else //uncomment else to disable parent highlighting when dragging
        {
          //if text editor is open check if the highlighted element is not inside the editor
          if (_self.builder.WysiwygEditor.isActive) {
            if (self.texteditEl?.get(0).contains(event.target)) {
              return true;
            }
          }

          if (!self.selectedEl) return;

          // let style = {
          //   top: offset.top - self.frameDoc.scrollTop(),
          //   left: offset.left - self.frameDoc.scrollLeft(),
          //   width: width,
          //   height: height,
          //   display: event.target.hasAttribute("contenteditable")
          //     ? "none"
          //     : "block",
          //   "border-left": self.isDragging ? "3px dashed limegreen" : "",
          // };
          let iframe = self.pages.get(
            self.currentPageName || self.pageName
          ).iframe;
          let frameDoc = $(iframe.get(0).contentDocument);
          let ioffset = iframe.offset();

          let style = {
            top: ioffset.top + offset.top - frameDoc.scrollTop(),
            left: ioffset.left + offset.left - frameDoc.scrollLeft(),
            width: width, //width,
            height: height, //height,
            display:
              event.target.getAttribute("contenteditable") == false
                ? "none"
                : "block",
            "border-left": self.isDragging ? "3px dashed limegreen" : "",
            position: "fixed",
          };

          $("#highlight-box").css(style);

          if (height < 50) {
            $("#section-actions").addClass("outside");
          } else {
            $("#section-actions").removeClass("outside");
          }

          event.target &&
            $("#highlight-name").html(self._getElementType(event.target));
        }
      }
    });

    self.frameHtml.on("mouseup dragend touchend", function () {
      self.isResize = false;
      $("#section-actions, #highlight-name, #select-box").show();

      if (self.isDragging) {
        self.isDragging = false;
        self.highlightEnabled = true;
        if (self.iconDrag) self.iconDrag.remove();
        $("#component-clone").remove();

        if (self.dragMoveMutation === false) {
          if (self.component.dragHtml || _self.builder.dragHtml) {
            //if dragHtml is set for dragging then set real component html
            let newElement = $(self.component.html.node || self.component.html);
            self.dragElement.replaceWith(newElement);
            self.dragElement = newElement;
          }

          if (self.component.afterDrop)
            self.dragElement = self.component.afterDrop(self.dragElement);
        }

        self.dragElement.css("border", "");

        let node = self.dragElement.get(0);
        self.selectNode(node);
        self.loadNodeComponent(node);

        if (self.dragMoveMutation === false) {
          _self.builder.Undo.addMutation({
            type: "childList",
            target: node.parentNode,
            addedNodes: [node],
            nextSibling: node.nextSibling,
          });
        } else {
          self.dragMoveMutation.newParent = node.parentNode;
          self.dragMoveMutation.newNextSibling = node.nextSibling;

          _self.builder.Undo.addMutation(self.dragMoveMutation);
          self.dragMoveMutation = false;
        }
      }
    });

    self.frameHtml.on("dblclick", function (event) {
      let target;
      if (self.isPreview == false) {
        if (!_self.builder.WysiwygEditor.isActive) {
          self.selectPadding = 10;
          self.texteditEl = target = $(event.target);

          _self.builder.WysiwygEditor.edit(self.texteditEl);

          //update select box when the text size is changed
          self.texteditEl.on("blur keyup paste input", self._updateSelectBox);
          self._updateSelectBox();

          $("#select-box").addClass("text-edit").find("#select-actions").hide();
          $("#highlight-box").hide();
        }
      }
    });

    self.frameHtml.on("click", function (event) {
      if (self.isPreview == false) {
        if (event.target) {
          if (_self.builder.WysiwygEditor.isActive) {
            if (self.texteditEl?.get(0).contains(event.target)) {
              return true;
            }
          }
          //if component properties is loaded in left panel tab instead of right panel show tab
          if ($(".component-properties-tab").is(":visible"))
            //if properites tab is enabled/visible
            $(".component-properties-tab a").show().tab("show");
          self.selectNode(event.target);
          self.loadNodeComponent(event.target);

          if (
            self.allowResizeableElements ||
            _self.builder.component.resizable
          ) {
            $("#select-box").addClass("resizable");
            self.resizeMode = _self.builder.component.resizeMode || "css";
          } else {
            $("#select-box").removeClass("resizable");
          }
          $("#add-section-box").hide();
          event.preventDefault();
          self.builder.emit("gui:node.select", event.target);
          return false;
        }
      }
    });
  }

  _updateSelectBox() {
    if (!self.texteditEl) return;
    var offset = self.selectedEl.offset();

    $("#select-box").css({
      top: offset.top - self.frameDoc.scrollTop() - self.selectPadding,
      left: offset.left - self.frameDoc.scrollLeft() - self.selectPadding,
      width: self.texteditEl.outerWidth() + self.selectPadding * 2,
      height: self.texteditEl.outerHeight() + self.selectPadding * 2,
    });
  }

  _initBox() {
    var self = this.builder.Builder;
    let _self = this;

    $("#toggle-resize-btn").on("mousedown", function (event) {
      self.allowResizeableElements = !self.allowResizeableElements;
      if (self.allowResizeableElements) {
        $("#select-box").addClass("resizable");
      } else {
        $("#select-box").removeClass("resizable");
      }
      event.preventDefault();
      return false;
    });

    $("#drag-btn").on("mousedown", function (event) {
      self.dragElement = self.selectedEl.css("position", "");
      self.isDragging = true;
      $("#section-actions, #highlight-name, #select-box").hide();

      let node = self.dragElement.get(0);

      self.dragMoveMutation = {
        type: "move",
        target: node,
        oldParent: node.parentNode,
        oldNextSibling: node.nextSibling,
      };

      //self.selectNode(false);
      event.preventDefault();
      return false;
    });

    $(".resize > div").on("mousedown", function (event) {
      $("#section-actions, #highlight-name, #highlight-box").hide();

      self.isResize = true;
      self.initialSize = {
        width: self.selectedEl.outerWidth(),
        height: self.selectedEl.outerHeight(),
      };
      self.initialPosition = false;
      self.resizeHandler = this.className;

      event.preventDefault();
      return false;
    });

    $("#down-btn").on("click", function (event) {
      $("#select-box").hide();

      self.moveNodeDown();

      event.preventDefault();
      return false;
    });

    $("#up-btn").on("click", function (event) {
      $("#select-box").hide();

      self.moveNodeUp();

      event.preventDefault();
      return false;
    });

    $("#clone-btn").on("click", function (event) {
      event.preventDefault();
      self.cloneNode();

      return false;
    });

    $("#parent-btn").on("click", function (event) {
      event.preventDefault();
      let node = self.selectedEl.parent().get(0);

      self.selectNode(node);
      self.loadNodeComponent(node);

      return false;
    });

    $("#delete-btn").on("click", function (event) {
      event.preventDefault();
      $("#select-box").hide();

      let node = self.selectedEl.get(0);

      _self.builder.Undo.addMutation({
        type: "childList",
        target: node.parentNode,
        removedNodes: [node],
        nextSibling: node.nextSibling,
      });

      self.selectedEl.remove();
      self.selectNode(self.frameBody);
      self.loadNodeComponent(self.frameBody);
      return false;
    });

    var addSectionBox = $("#add-section-box");
    var addSectionElement = {};

    $("#add-section-btn").on("click", function (event) {
      addSectionElement = self.highlightEl;
      let FrameWindow = self.iframe.contentWindow;

      var offset = $(addSectionElement).offset();
      var top =
        offset.top -
        self.frameDoc.scrollTop() +
        addSectionElement.outerHeight();
      var left =
        offset.left -
        self.frameDoc.scrollLeft() +
        addSectionElement.outerWidth() / 2 -
        addSectionBox.outerWidth() / 2;
      var outerHeight = $(FrameWindow).height() + self.frameDoc.scrollTop();

      //check if box is out of viewport and move inside
      if (left < 0) left = 0;
      if (top < 0) top = 0;
      if (left + addSectionBox.outerWidth() > self.frameDoc.outerWidth())
        left = self.frameDoc.outerWidth() - addSectionBox.outerWidth();
      if (
        top + addSectionBox.outerHeight() + self.frameDoc.scrollTop() >
        outerHeight
      )
        top = top - addSectionBox.outerHeight();

      addSectionBox.css({
        top: top,
        left: left,
        display: "block",
      });

      event.preventDefault();
      return false;
    });

    $("#close-section-btn").on("click", function () {
      addSectionBox.hide();
    });

    function addSectionComponent(html, mode = "inside") {
      var node = $(html.node || html);

      if (mode == "after") {
        addSectionElement.after(node);
      } else if (mode == "replace") {
        addSectionElement.replaceWith(node);
      } else {
        addSectionElement.append(node);
      }

      node = node.get(0);

      _self.builder.Undo.addMutation({
        type: "childList",
        target: node.parentNode,
        addedNodes: [node],
        removedNodes:
          mode == "replace" ? [addSectionElement.get(0)] : undefined,
        nextSibling: node.nextSibling,
      });
    }

    $(".components-list li ol li", addSectionBox).on("click", function () {
      var html = _self.builder.Components.get(this.dataset.type).html;

      addSectionComponent(
        html,
        $("[name='add-section-insert-mode']:checked").val()
      );

      addSectionBox.hide();
    });

    $(".blocks-list li ol li", addSectionBox).on("click", function () {
      var html = _self.builder.Blocks.get(this.dataset.type).html;

      addSectionComponent(
        html,
        $("[name='add-section-insert-mode']:checked").val()
      );

      addSectionBox.hide();
    });

    $(".sections-list li ol li", addSectionBox).on("click", function () {
      var html = _self.builder.Sections.get(this.dataset.type).html;

      addSectionComponent(
        html,
        $("[name='add-section-insert-mode']:checked").val()
      );

      addSectionBox.hide();
    });
  }

  /* drag and drop */
  _initDragdrop() {
    var self = this;
    self.isDragging = false;

    $(".drag-elements-sidepane ul > li > ol > li[data-drag-type]").on(
      "mousedown touchstart",
      function (event) {
        let $this = $(this),
          html;

        $("#component-clone").remove();
        $("#section-actions, #highlight-name, #select-box").hide();

        if ($this.data("drag-type") == "component") {
          self.component = self.builder.Components.get($this.data("type"));
        } else if ($this.data("drag-type") == "section") {
          self.component = self.builder.Sections.get($this.data("type"));
        } else if ($this.data("drag-type") == "block") {
          self.component = self.builder.Blocks.get($this.data("type"));
        }

        if (self.component.dragHtml) {
          html = self.component.dragHtml;
        } else if (self.builder.dragHtml) {
          html = self.builder.dragHtml;
        } else {
          html = self.component.html.node || self.component.html;
        }

        self.dragElement = $(html);
        //self.dragElement.css("border", "1px dashed #4285f4");

        if (self.component.dragStart)
          self.dragElement = self.component.dragStart(self.dragElement);

        self.isDragging = true;
        if (self.builder.dragIcon == "html") {
          self.iconDrag = $(html)
            .attr("id", "dragElement-clone")
            .css("position", "absolute");
        } else if (self.designerMode == false) {
          self.iconDrag = $('<img src=""/>')
            .attr({
              id: "dragElement-clone",
              src: $this
                .css("background-image")
                .replace(/^url\(['"](.+)['"]\)/, "$1"),
            })
            .css({
              "z-index": 100,
              position: "absolute",
              width: "64px",
              height: "64px",
              top: event.originalEvent.y,
              left: event.originalEvent.x,
            });
        }

        $("body").append(self.iconDrag);

        event.preventDefault();
        return false;
      }
    );

    $("body").on("mouseup dragend touchend", function () {
      if (self.iconDrag && self.isDragging == true) {
        self.isDragging = false;
        $("#component-clone").remove();
        $("#section-actions, #highlight-name, #select-box").show();
        self.iconDrag.remove();
        if (self.dragElement) {
          self.dragElement.remove();
        }
      }
    });

    $("body").on("mousemove dragover touchmove", function (event) {
      if (self.iconDrag && self.isDragging == true) {
        var x = event.clientX || event.originalEvent.clientX || 0;
        var y = event.clientY || event.originalEvent.clientY || 0;

        self.iconDrag.css({ left: x - 60, top: y - 30 });

        let elementMouseIsOver = document.elementFromPoint(x - 60, y - 40);

        //if drag elements hovers over iframe switch to iframe mouseover handler
        // return;
        if (elementMouseIsOver && elementMouseIsOver.tagName == "IFRAME") {
          self.frameBody.trigger("mousemove", event);
          event.stopPropagation();
          self.selectNode(false);
        }
      }
    });

    $(".drag-elements-sidepane ul > ol > li > li").on(
      "mouseup dragend touchend",
      function () {
        self.isDragging = false;
        $("#component-clone").remove();
        $("#section-actions, #highlight-name, #select-box").show();
      }
    );
  }

  removeHelpers(html, keepHelperAttributes = false) {
    //tags like stylesheets or scripts
    html = html.replace(/<[^>]+?data-vvveb-helpers.+?>/gi, "");
    //attributes
    if (!keepHelperAttributes) {
      html = html.replace(/\s*data-vvveb-\w+(=["'].*?["'])?\s*/gi, "");
    }

    return html;
  }

  getHtml(keepHelperAttributes = true) {
    var doc = this.builder.Builder.iframe.contentWindow.document;
    var hasDoctpe = doc.doctype !== null;
    var html = "";

    $("[contenteditable]", doc).removeAttr("contenteditable");
    $("[spellcheckker]", doc).removeAttr("spellcheckker");

    $(window).triggerHandler("vvveb.getHtml.before", doc);

    if (hasDoctpe)
      html =
        "<!DOCTYPE " +
        doc.doctype.name +
        (doc.doctype.publicId ? ' PUBLIC "' + doc.doctype.publicId + '"' : "") +
        (!doc.doctype.publicId && doc.doctype.systemId ? " SYSTEM" : "") +
        (doc.doctype.systemId ? ' "' + doc.doctype.systemId + '"' : "") +
        ">\n";

    this.builder.FontsManager.cleanUnusedFonts();

    html += doc.documentElement.outerHTML;
    html = this.removeHelpers(html, keepHelperAttributes);

    $(window).triggerHandler("vvveb.getHtml.after", doc);

    var filter = $(window).triggerHandler("vvveb.getHtml.filter", html);
    if (filter) return filter;

    return html;
  }

  setHtml(html) {
    //documentElement.innerHTML resets <head> each time and the page flickers
    //return window.FrameDocument.documentElement.innerHTML = html;
    let FrameDocument = this.builder.Builder.iframe.contentWindow.document;

    function getTag(html, tag, outerHtml = false) {
      let start = html.indexOf("<" + tag);
      let end = html.indexOf("</" + tag);

      if (start >= 0 && end >= 0) {
        if (outerHtml) return html.slice(start, end + 3 + tag.length);
        else return html.slice(html.indexOf(">", start) + 1, end);
      } else {
        return html;
      }
    }

    if (this.runJsOnSetHtml) this.frameBody.html(getTag(html, "body"));
    else FrameDocument.body.innerHTML = getTag(html, "body");

    //use outerHTML if you want to set body tag attributes
    //window.FrameDocument.body.outerHTML = getTag(html, "body", true);

    //set head html only if changed to avoid page flicker
    let headHtml = getTag(html, "head");
    if (FrameDocument.head.innerHTML != headHtml) {
      FrameDocument.head.innerHTML = getTag(html, "head");
    }
  }

  saveAjax(fileName, startTemplateUrl, callback, saveUrl) {
    var data = {};
    let self = this;
    data["file"] =
      fileName && fileName != ""
        ? fileName
        : self.builder.FileManager.getCurrentFileName();
    data["startTemplateUrl"] = startTemplateUrl;
    if (!startTemplateUrl || startTemplateUrl == null) {
      data["html"] = this.getHtml();
    }

    return $.ajax({
      type: "POST",
      url: saveUrl, //set your server side save script url
      data: data,
      cache: false,
    })
      .done(function (data) {
        if (callback) callback(data);
        self.builder.Undo.reset();
        $("#top-panel .save-btn").attr("disabled", "true");
      })
      .fail(function (data) {
        alert(data.responseText);
      });
  }

  setDesignerMode(designerMode = false) {
    this.designerMode = designerMode;
  }

  generateXPath(node) {
    let get_element_index = (node) => {
        let temp = [];

        for (let child of (node.parentElement?.children || [])) {
            if (typeof child !== "undefined") {
                if (child.tagName.toLowerCase() == node.localName) {
                    temp.push(child);
                }
            }
        }
        return temp;
    };
    let temp_one = get_element_index(node);
    let last_node_index = Array.prototype.indexOf.call(temp_one, node);
    let current = "";
    let path;

    if (temp_one.length == 1) {
        path = "/" + node.localName;
    } else if (temp_one.length > 1) {
        last_node_index = last_node_index + 1;
        path = "/" + node.localName + "[" + last_node_index + "]";
    }

    while (node != document.html && node.parentNode !== null) {
      node = node.parentNode;
      /* When loop reaches the last element of the dom (body)*/
      if (node.localName == "body") {
        current = "/body";
        path = current + path;
        break;
      }
      /* if the node has id attribute and is not the last element */
      if (node.id != "" && node.localName != "body") {
        current = "/" + node.localName + "[@id='" + node.id + "']";
        path = current + path;
        break;
      }
      /* if the node has class attribute and has no id attribute or is not the last element */
      if (node.id == "" && node.localName != "body") {
        if (node.parentNode !== null) {
          let temp = get_element_index(node);
          let node_index = Array.prototype.indexOf.call(temp, node);

          if (temp.length == 1) {
            current = "/" + node.localName;
          } else if (temp.length > 1) {
            node_index = node_index + 1;
            current = "/" + node.localName + "[" + node_index + "]";
          }
        }
      }
      path = current + path;
    }
    return "/" + path;
  }
}

class CodeEditor {
  constructor(instance) {
    this.builder = instance;
    this.isActive = false;
    this.oldValue = "";
    this.doc = false;
  }

  init() {
    $("#vvveb-code-editor textarea").val(this.builder.Builder.getHtml());

    $("#vvveb-code-editor textarea").keyup(function () {
      delay(() => this.builder.Builder.setHtml(this.value), 1000);
    });

    //load code on document changes
    this.builder.Builder.frameBody.on(
      "vvveb.undo.add vvveb.undo.restore",
      function () {
        this.builder.CodeEditor.setValue();
      }
    );
    //load code when a new url is loaded
    this.builder.Builder.documentFrame.on("load", function () {
      this.builder.CodeEditor.setValue();
    });

    this.isActive = true;
  }

  setValue() {
    if (this.isActive) {
      $("#vvveb-code-editor textarea").val(this.builder.Builder.getHtml());
    }
  }

  destroy() {
    this.isActive = false;
    // $("#vvveb-code-editor").hide()
  }

  toggle() {
    if (this.isActive != true) {
      return this.init();
    } else {
      this.destroy();
    }
  }
}

class Gui {
  constructor(instance) {
    let self = this;
    this.builder = instance;
    this.oldHTML = "";

    this.previewManager = "default";
    this.previewManagers = { default: this.prepareHtml };

    this.mainGui = new SectionManager("#vvveb-builder");

    this.topPanel = new SectionManager("#top-panel");
    this.bottomPanel = new SectionManager("#bottom-panel");
    this.leftPanel = new SectionManager("#left-panel");
    this.previewPanel = new SectionManager("#preview-panel");
    this.codeEditorPanel = new SectionManager("#vvveb-code-editor");

    this.previewPanel.selectBox = new SectionManager("#select-box");
    this.previewPanel.selectActions = new SectionManager("#select-actions");
    this.previewPanel.highlightBox = new SectionManager("#highlight-box");

    this.leftPanel.fileManager = new SectionManager("#filemanager");

    this.bottomPanel.breadCrumb = new SectionManager("#breadcrumb-navigator");

    let getNode = () => {
      return self.builder.Builder.highlightEl || self.builder.Builder.selectedEl
    }

    let selectNode = (node) => {
      self.builder.Builder.selectNode(node);
      self.builder.Builder.loadNodeComponent(node);
    }

    this.contextMenu = new Menu({ builder: this.builder }, [
      new SubMenu("Action", { divider: false }, [
        new MenuItem("Select", {
          icon: "la la-mouse-pointer",
          action(e, data) {
            let node = getNode();
            selectNode(node)
          }
        }),
        new MenuItem("Rename", {
          action() {
            let node = getNode();
            let target = prompt("New node name: ");
            if (target) {
              changeNodeName(node, target);
              selectNode(node);
            }
          }
        }),
        new MenuItem("Xpath", {
          icon: "la la-clipboard",
          action(e) {
            let node = getNode();
            let path = self.builder.Builder.generateXPath(node.get(0))
            try { navigator.clipboard.writeText(path) }
            catch { alert(path) }
          }
        })
      ]),
    ]);
    this.contextMenu.attach("#options-btn", "click");
  }

  init() {
    let self = this;

    this.toggleFileManager = function () {
      self.builder.Gui.togglePanel(
        "#filemanager",
        "--builder-filemanager-height"
      );
    };

    this.toggleLeftColumn = function () {
      if ($(window).outerWidth() <= SCREEN_SIZES.md) return;
      self.builder.Gui.togglePanel("#left-panel", "--builder-left-panel-width");
      $("#preview-panel").toggleClass("col-md-9").toggleClass("col-md-12");
      $("#left-sidebar").toggleClass("col-md-3");
    };

    this.toggleRightColumn = function (rightColumnEnabled = null) {
      rightColumnEnabled = self.builder.Gui.togglePanel(
        "#right-panel",
        "--builder-right-panel-width"
      );

      $("#vvveb-builder").toggleClass("no-right-panel");
      $(".component-properties-tab").toggle();

      self.builder.Components.componentPropertiesElement =
        (rightColumnEnabled ? "#right-panel" : "#left-panel #properties") +
        " .component-properties";
      if ($("#properties").is(":visible"))
        $(".component-tab a").show().tab("show");
    };

    this.undo = function () {
      if (self.builder.WysiwygEditor.isActive) {
        self.builder.WysiwygEditor.undo();
      } else {
        self.builder.Undo.undo();
      }
      self.builder.Builder.selectNode();
    };

    this.redo = function () {
      if (self.builder.WysiwygEditor.isActive) {
        self.builder.WysiwygEditor.redo();
      } else {
        self.builder.Undo.redo();
      }
      self.builder.Builder.selectNode();
    };

    //show modal with html content
    this.save = function () {
      $("#textarea-modal textarea").val(self.builder.Builder.getHtml());
      $("#textarea-modal").modal();
    };

    //post html content through ajax to save to filesystem/db
    this.saveAjax = function () {
      var btn = $(this);
      var saveUrl = this.dataset.vvvebUrl;
      var url = self.builder.FileManager.getPageData("file");

      $(".loading", btn).toggleClass("d-none");
      $(".button-text", btn).toggleClass("d-none");

      return self.builder.Builder.saveAjax(url, null, null, saveUrl)
        .done(function (data, text) {
          /*
				//use modal to show save status
				var messageModal = new bootstrap.Modal(document.getElementById('message-modal'), {
				  keyboard: false
				});
				
				$("#message-modal .modal-body").html(data);
				messageModal.show();
				*/

          //use toast to show save status

          let bg = "bg-success";
          if (data.success || text == "success") {
            $("#top-panel .save-btn").attr("disabled", "true");
          } else {
            bg = "bg-danger";
          }
          displayToast(bg, data.message ?? data);
        }, saveUrl)
        .fail(function () {
          displayToast("bg-danger", "Error saving!");
        }, saveUrl)
        .always(function () {
          $(".loading", btn).toggleClass("d-none");
          $(".button-text", btn).toggleClass("d-none");
        });
    };
    this.toggleEditor = function () {
      $("#toggleEditorJsExecute").toggle();
      //hide breadcrumb when showing the editor
      $(".breadcrumb-navigator .breadcrumb").toggle();

      if (self.builder.CodeEditor.isActive) {
        $("#vvveb-code-editor").hide();
      } else {
        $("#vvveb-code-editor").show();
      }
      self.builder.CodeEditor.toggle();
    };

    this.toggleEditorJsExecute = function () {
      self.builder.Builder.runJsOnSetHtml = this.checked;
    };

    this.preview = function () {
      $("#iframe-layer").toggle();
      $("#vvveb-builder").toggleClass("preview");
      $("#preview-panel").toggleClass("col-md-9").toggleClass("col-md-12");

      for (let elem of $(self.builder.Builder.editorTree).find("li")) {
        let page = self.builder.Builder.pages.get(elem.attr("data-page"));
        let FrameDocument = page.iframe.get(0).contentDocument;
        $(".loading-message").addClass("active");

        let target = $(FrameDocument).find("body").get(0);

        if (self.builder.Builder.isPreview === true) {
          target.replaceWith(self.oldHTML);
          self.builder.Builder.isPreview = false;

          // To reinitialize select box
          self.builder.Builder._frameLoaded();
        } else {
          self.oldHTML = target.cloneNode(true);
          target.outerHTML = self.previewManagers[self.previewManager](
            target.cloneNode(true)
          );
          self.builder.Builder.isPreview = true;
        }
        $(".loading-message").removeClass("active");
      }
    };

    this.compile = function () {
      let FrameDocument = this.builder.Builder.iframe.contentWindow.document;
      let target = $(FrameDocument).find("body");
      let clone = target.get(0).cloneNode(true);
      return self.previewManagers[self.previewManager](clone, false);
    };

    this.download = function () {
      let filename = /[^\/]+$/.exec(self.builder.Builder.iframe.src)[0];
      let uriContent =
        "data:application/octet-stream," +
        encodeURIComponent(self.builder.Builder.getHtml());
      console.log(filename)

      var link = document.createElement("a");
      if ("download" in link) {
        link.dataset.download = filename;
        link.href = uriContent;
        link.target = "_blank";

        document.body.appendChild(link);
        result = link.click();
        document.body.removeChild(link);
        link.remove();
      } else {
        location.href = uriContent;
      }
    };

    this.toggleMode = function () {
      let theme = $("html").attr("data-bs-theme");
      if (theme == "dark") {
        theme = "light";
      } else {
        theme = "dark";
      }
      self.setMode(theme);
    };

    $("[data-vvveb-action]").each(function () {
      let on = this.dataset?.vvvebOn || "click";
      let action = this.dataset.vvvebAction;

      $(this).on(on, function(...args) {
        self[action].call(this, ...args)
      });
      //   if (this.dataset.vvvebShortcut) {
      //     $(document).bind(
      //       "keydown",
      //       this.dataset.vvvebShortcut,
      //       self.builder.Gui[this.dataset.vvvebAction]
      //     );
      //     $(window.FrameDocument, window.FrameWindow).bind(
      //       "keydown",
      //       this.dataset.vvvebShortcut,
      //       self.builder.Gui[this.dataset.vvvebAction]
      //     );
      //   }
    });

    if ($(window).outerWidth() <= SCREEN_SIZES.md) {
      $("#toggle-left-column-btn").attr("data-bs-toggle", "offcanvas");
    } else {
      $("#toggle-left-column-btn").removeAttr("data-bs-toggle");
    }

    this.checkMode();
    this.viewport.call({ dataset: { view: "auto" } });
    this.toggleRightColumn();
  }

  buildContextMenu() {}

  viewport() {
    let elem = $("#iframe-wrapper");
    let view = this.dataset.view || "desktop";

    ["mobile", "tablet", "desktop", "auto"].map((i) => {
      elem.removeClass(i);
    });
    elem.addClass(view);
  }

  prepareHtml() {
    return this.oldHTML;
  }

  addPreviewManager(name, handler) {
    this.previewManagers[name] = handler;
  }

  setPreviewManager(name) {
    if (this.previewManagers[name]) {
      this.previewManager = name;
    }
  }

  fullscreen() {
    if (document.documentElement.requestFullScreen) {
      if (document.FullScreenElement) document.exitFullScreen();
      else document.documentElement.requestFullScreen();
      //mozilla
    } else if (document.documentElement.mozRequestFullScreen) {
      if (document.mozFullScreenElement) document.mozCancelFullScreen();
      else document.documentElement.mozRequestFullScreen();
      //webkit
    } else if (document.documentElement.webkitRequestFullScreen) {
      if (document.webkitFullscreenElement) document.webkitExitFullscreen();
      else document.documentElement.webkitRequestFullScreen();
      //ie
    } else if (document.documentElement.msRequestFullscreen) {
      if (document.msFullScreenElement) document.msExitFullscreen();
      else document.documentElement.msRequestFullscreen();
    }
  }

  search() {
    let searchText = this.value;
    let panel = $("div > ul", this.parentNode.parentNode);

    $("li ol li", panel).each(function () {
      let $this = $(this);

      $this.hide();
      if ($this.data("search").indexOf(searchText) > -1) $this.show();
    });
  }

  clearSearch() {
    $("input", this.parentNode).val("").keyup();
  }

  expand() {
    $(
      'input.header_check[type="checkbox"]',
      this.parentNode.parentNode.parentNode
    ).prop("checked", true);
  }

  collapse() {
    $(
      'input.header_check[type="checkbox"]',
      this.parentNode.parentNode.parentNode
    ).prop("checked", false);
  }

  //Pages, file/components tree
  newPage() {
    let _this = this;
    var newPageModal = $("#new-page-modal");

    newPageModal
      .modal("show")
      .find("form")
      .off("submit")
      .submit(function (e) {
        var data = {};
        $.each($(this).serializeArray(), function () {
          data[this.name] = this.value;
        });

        data["title"] = data["file"].replace("/", "").replace(".html", "");
        var name = (data["name"] =
          data["folder"].replace("/", "_") + "-" + data["title"]);
        data["url"] = data["file"] = data["folder"] + "/" + data["file"];

        _this.builder.FileManager.addPage(data.name, data);
        e.preventDefault();

        return _this.builder.Builder.saveAjax(
          data.file,
          data.startTemplateUrl,
          function () {
            _this.builder.FileManager.loadPage(name);
            _this.builder.FileManager.scrollBottom();
            newPageModal.modal("hide");
          },
          this.action
        );
      });
  }

  setDesignerMode() {
    //aria-pressed attribute is updated after action is called and we check for false instead of true
    let designerMode = this.attributes["aria-pressed"].value != "true";
    this.builder.Builder.setDesignerMode(designerMode);
  }
  //layout
  togglePanel(panel, cssVar) {
    panel = $(panel);
    let body = $("body");
    let prevValue = body.css(cssVar);
    if (prevValue !== "0px") {
      panel.data("layout-toggle", prevValue);
      body.css(cssVar, "0px");
      panel.hide();
      return false;
    } else {
      prevValue = panel.data("layout-toggle");
      body.css(cssVar, "");
      panel.show();
      return true;
    }
  }

  setMode(theme) {
    theme = theme || "auto";
    if (theme == "dark") {
      $(".btn-dark-mode i").removeClass("la-sun").addClass("la-moon");
    } else {
      $(".btn-dark-mode i").removeClass("la-moon").addClass("la-sun");
    }
    $("html").attr("data-bs-theme", theme);
    localStorage.setItem("vvveb.theme", theme);
  }

  checkMode() {
    let mode = localStorage.getItem("vvveb.theme") || "light";
    this.setMode(mode);
  }
}

class Undo {
  constructor(builder) {
    this.builder = builder;
    this.mutations = [];
    this.undoIndex = -1;
    this.enabled = true;
  }
  /*		
	init: function() {
	}
	*/
  addMutation(mutation) {
    /*
			this.mutations.push(mutation);
			this.undoIndex++;
		*/
    this.mutations.splice(
      ++this.undoIndex,
      this.mutations.length - this.undoIndex,
      mutation
    );
    this.builder.Builder.frameBody.trigger("vvveb.undo.add", mutation);
  }

  restore(mutation, undo) {
    let FrameDocument = this.builder.Builder.iframe.contentWindow.document;
    let addedNodes, removedNodes, parent, sibling, value;
    switch (mutation.type) {
      case "childList":
        if (undo == true) {
          addedNodes = mutation.removedNodes;
          removedNodes = mutation.addedNodes;
        } //redo
        else {
          addedNodes = mutation.addedNodes;
          removedNodes = mutation.removedNodes;
        }

        if (addedNodes)
          for (let i in addedNodes) {
            let node = addedNodes[i];
            if (mutation.nextSibling) {
              console.log(mutation.nextSibling);
              mutation.nextSibling.parentNode.insertBefore(
                node,
                mutation.nextSibling
              );
            } else {
              mutation.target.append(node);
            }
          }

        if (removedNodes)
          for (let i in removedNodes) {
            let node = removedNodes[i];
            node.parentNode.removeChild(node);
          }
        break;
      case "move":
        if (undo == true) {
          parent = mutation.oldParent;
          sibling = mutation.oldNextSibling;
        } //redo
        else {
          parent = mutation.newParent;
          sibling = mutation.newNextSibling;
        }

        if (sibling) {
          sibling.parentNode.insertBefore(mutation.target, sibling);
        } else {
          parent.append(node);
        }
        break;
      case "characterData":
        mutation.target.innerHTML = undo
          ? mutation.oldValue
          : mutation.newValue;
        break;
      case "style":
        $("#vvvebjs-styles", FrameDocument).html(
          undo ? mutation.oldValue : mutation.newValue
        );
        break;
      case "attributes":
        value = undo ? mutation.oldValue : mutation.newValue;

        if (value || value === false || value === 0)
          mutation.target.setAttribute(mutation.attributeName, value);
        else mutation.target.removeAttribute(mutation.attributeName);

        break;
    }

    this.builder.Builder.frameBody.trigger("vvveb.undo.restore", mutation);
  }

  undo() {
    if (this.undoIndex >= 0) {
      this.restore(this.mutations[this.undoIndex--], true);
    }
  }

  redo() {
    if (this.undoIndex < this.mutations.length - 1) {
      this.restore(this.mutations[++this.undoIndex], false);
    }
  }

  hasChanges() {
    return this.mutations.length;
  }

  reset() {
    this.mutations = [];
    this.undoIndex = -1;
  }
}

class StyleManager {
  constructor(instance) {
    this.builder = instance;
    this.styles = {};
    this.cssContainer = false;
    this.mobileWidth = "320px";
    this.tabletWidth = "768px";
  }

  init(doc) {
    if (doc) {
      var style = false;
      var _style = false;

      //check if editor style is present
      for (let i = 0; i < doc.styleSheets.length; i++) {
        _style = doc.styleSheets[i];
        if (_style.ownerNode.id && _style.ownerNode.id == "vvvebjs-styles") {
          style = _style;
          break;
        }
      }

      //if style element does not exist create it
      if (!style) {
        this.cssContainer = $('<style id="vvvebjs-styles"></style>');
        $(doc.head).append(this.cssContainer);
        return this.cssContainer;
      }

      //if style exist then load all css styles for editor
      for (let j = 0; j < style.cssRules.length; j++) {
        media =
          typeof style.cssRules[j].media === "undefined"
            ? "desktop"
            : style.cssRules[j].media[0] === "screen and (max-width: 1220px)"
            ? "tablet"
            : style.cssRules[j].media[0] === "screen and (max-width: 320px)"
            ? "mobile"
            : "desktop";

        selector =
          media === "desktop"
            ? style.cssRules[j].selectorText
            : style.cssRules[j].cssRules[0].selectorText;
        styles =
          media === "desktop"
            ? style.cssRules[j].style
            : style.cssRules[j].cssRules[0].style;

        if (media) {
          this.styles[media] = {};
          if (selector) {
            this.styles[media][selector] = {};

            for (let k = 0; k < styles.length; k++) {
              property = styles[k];
              value = styles[property];

              this.styles[media][selector][property] = value;
            }
          }
        }
      }

      return (this.cssContainer = $("#vvvebjs-styles", doc));
    }
  }

  getSelectorForElement(element) {
    var currentElement = element;
    var selector = [];
    let self = this;

    while (currentElement.parentElement) {
      let elementSelector = "";
      let classSelector = Array.from(currentElement.classList)
        .map(function (className) {
          if (self.builder.Builder.ignoreClasses.indexOf(className) == -1) {
            return "." + className;
          }
        })
        .join("");

      //stop at a unique element (with id)
      if (currentElement.id) {
        elementSelector = "#" + currentElement.id;
        selector.push(elementSelector);
        break;
      } else if (classSelector) {
        //class selector
        elementSelector = classSelector;
      } else {
        //element (tag) selector
        var tag = currentElement.tagName.toLowerCase();
        //exclude top most element body unless the parent element is body
        if (tag != "body" || (tag == "body" && selector.length <= 1)) {
          elementSelector = tag;
        }
      }

      if (elementSelector) {
        selector.push(elementSelector);
      }

      currentElement = currentElement.parentElement;
    }

    return selector.reverse().join(" > ");
  }

  setStyle(element, styleProp, value) {
    let selector;
    if (typeof element == "string") {
      selector = element;
    } else {
      selector = this.getSelectorForElement(element.get(0));
    }

    let media = $("#iframe-wrapper").hasClass("tablet")
      ? "tablet"
      : $("#iframe-wrapper").hasClass("mobile")
      ? "mobile"
      : "desktop";

    //styles[media][selector][styleProp] = value
    if (!this.styles[media]) {
      this.styles[media] = {};
    }
    if (!this.styles[media][selector]) {
      this.styles[media][selector] = {};
    }
    if (!this.styles[media][selector][styleProp]) {
      this.styles[media][selector][styleProp] = {};
    }
    this.styles[media][selector][styleProp] = value;

    this.generateCss(media);

    return element;
    //uncomment bellow code to set css in element's style attribute
    //return element.css(styleProp, value);
  }

  generateCss(media) {
    //var css = "";
    //for (selector in this.styles[media]) {

    //	css += `${selector} {`;
    //	for (property in this.styles[media][selector]) {
    //		value = this.styles[media][selector][property];
    //		css += `${property}: ${value};`;
    //	}
    //	css += '}';
    //}

    //this.cssContainer.html(css);

    //return element;
    var css = "";
    for (media in this.styles) {
      if (media === "tablet" || media === "mobile") {
        css += `@media screen and (max-width: ${
          media === "tablet" ? this.tabletWidth : this.mobileWidth
        }){`;
      }
      for (let selector in this.styles[media]) {
        css += `${selector} {`;
        for (let property in this.styles[media][selector]) {
          let value = this.styles[media][selector][property];
          css += `${property}: ${value};`;
        }
        css += "}";
      }
      if (media === "tablet" || media === "mobile") {
        css += `}`;
      }
    }

    this.cssContainer.html(css);
  }

  _getCssStyle(element, styleProp) {
    var value = "";
    var el = element.get(0);
    let selector;

    if (typeof element == "string") {
      selector = element;
    } else {
      selector = this.getSelectorForElement(el);
    }

    let media = $("#iframe-wrapper").hasClass("tablet")
      ? "tablet"
      : $("#iframe-wrapper").hasClass("mobile")
      ? "mobile"
      : "desktop";

    if (el.style && el.style.length > 0 && el.style[styleProp])
      //check inline
      var value = el.style[styleProp];
    else if (
      this.styles[media] !== undefined &&
      this.styles[media][selector] !== undefined &&
      this.styles[media][selector][styleProp] !== undefined
    ) {
      //check defined css
      var value = this.styles[media][selector][styleProp];
    } else if (window.getComputedStyle) {
      var value = document.defaultView.getDefaultComputedStyle
        ? document.defaultView
            .getDefaultComputedStyle(el, null)
            .getPropertyValue(styleProp)
        : window.getComputedStyle(el, null).getPropertyValue(styleProp);
    }

    return value;
  }

  getStyle(element, styleProp) {
    return this._getCssStyle(element, styleProp);
  }
}

class ContentManager {
  getAttr(element, attrName) {
    return element.attr(attrName);
  }

  setAttr(element, attrName, value) {
    return element.attr(attrName, value);
  }

  setHtml(element, html) {
    return element.html(html);
  }

  getHtml(element) {
    return element.html();
  }

  setText(element, text) {
    return element.text(text);
  }

  getText(element) {
    return element.text();
  }
}

class SectionList {
  constructor(instance) {
    this.builder = instance;
    this.selector = ".sections-container";
    this.allowedComponents = {};
    this.selected = null;
    this.dragover = null;
  }

  init(allowedComponents = {}) {
    let _this = this;
    this.allowedComponents = allowedComponents;

    $(this.selector)
      .on("click", "> div .controls", function (e) {
        var node = $(e.currentTarget.parentNode).data("node");
        if (node) {
          delay(
            () =>
              _this.builder.Builder.frameHtml.animate(
                {
                  scrollTop: $(node).offset().top - $(node).height() / 2,
                },
                500
              ),
            300
          );

          //node.click();
          _this.builder.Builder.selectNode(node);
          _this.builder.Builder.loadNodeComponent(node);
        }
      })
      .on("dblclick", "> div", function (e) {
        node = $(e.currentTarget).data("node");
        node.click();
      });

    $(this.selector)
      .on("click", "li[data-component] label ", function (e) {
        let node = $(e.currentTarget.parentNode).data("node");

        delay(
          () =>
            _this.builder.Builder.frameHtml.animate(
              {
                scrollTop: $(node).offset().top - $(node).height() / 2,
              },
              1000
            ),
          300
        );

        node.click();
      })
      .on("mouseenter", "li[data-component] label", function (e) {
        let node = $($(e.currentTarget.parentNode).data("node"));
        node.css("outline", "1px dashed blue");
        /*
			delay(
				() => this.builder.Builder.frameHtml.animate({
					scrollTop: $(node).offset().top - ($(node).height() / 2)
				}, 500), 
			1000);

			$(node).trigger("mousemove");
			*/
      })
      .on("mouseleave", "li[data-component] label", function (e) {
        let node = $($(e.currentTarget.parentNode).data("node"));
        node.css("outline", "");
        if (node.attr("style") == "") node.removeAttr("style");
      });

    $(this.selector).on("dragstart", "> div", this.dragStart);
    $(this.selector).on("dragover", "> div", this.dragOver);
    $(this.selector).on("dragend", "> div", this.dragEnd);

    $(this.selector).on("click", ".delete-btn", function (e) {
      var section = $(e.currentTarget).parents(".section-item");
      var node = section.data("node");
      node.remove();
      section.remove();

      e.stopPropagation();
      e.preventDefault();
    });

    $(".sections-list")
      .on("mouseenter", "li[data-section]", function () {
        var src = $("img", this).attr("src");
        $(".block-preview img").attr("src", src).show();
      })
      .on("mouseleave", "li[data-section]", function () {
        $(".block-preview img").attr("src", "").hide();
      });
    /*
		$(this.selector).on("click", ".up-btn", function (e) {
			var section = $(e.currentTarget).parents(".section-item");
			var node = section.data("node");
			this.builder.Builder.moveNodeUp(node);
			this.builder.Builder.moveNodeUp(section.get(0));
			
			e.preventDefault();
		});


		$(this.selector).on("click", ".down-btn", function (e) {
			var section = $(e.currentTarget).parents(".section-item");
			var node = section.data("node");
			this.builder.Builder.moveNodeDown(node);
			this.builder.Builder.moveNodeDown(section.get(0));
			
			e.preventDefault();
		});
		*/

    var self = this;
    $("#sections .sections-list").on(
      "click",
      " .add-section-btn",
      function (e) {
        e.preventDefault();

        var section = self.builder.Sections.get(this.parentNode.dataset.type);
        var node = $(section.html.node || section.html);
        var sectionType = node[0].tagName.toLowerCase();
        var afterSection = $(
          sectionType + ":last",
          self.builder.Builder.frameBody
        );

        if (afterSection.length) {
          afterSection.after(node);
        } else {
          if (sectionType != "footer") {
            afterSection = $("footer:first", self.builder.Builder.frameBody);

            if (afterSection.length) {
              afterSection.before(node);
            } else {
              $(self.builder.Builder.frameBody).append(node);
            }
          } else {
            $(self.builder.Builder.frameBody).append(node);
          }
        }

        self.builder.Builder.frameHtml.animate(
          {
            scrollTop: $(node).offset().top,
          },
          1000
        );

        delay(() => node.click(), 1000);

        node = node.get(0);
        self.builder.Undo.addMutation({
          type: "childList",
          target: node.parentNode,
          addedNodes: [node],
          nextSibling: node.nextSibling,
        });

        self.loadSections();
      }
    );

    $(this.selector).on("click", ".properties-btn", function (e) {
      var section = $(e.currentTarget).parents(".section-item");
      var node = section.data("node");
      node.click();

      e.preventDefault();
    });
  }

  getSections() {
    let FrameDocument = this.builder.Builder.iframe.contentWindow.document;

    var sections = [];
    var sectionList = $(
      "> section, > header, > footer, > main, > nav, > aside",
      FrameDocument.body
    );

    sectionList.each(function (i, node) {
      var id = node.id ? node.id : node.title ? node.title : node.className;
      if (!id) {
        id = "section-" + Math.floor(Math.random() * 10000);
      }
      var section = {
        name: id.replace(/[^\w+]+/g, " "),
        id: node.id,
        type: node.tagName.toLowerCase(),
        node: node,
      };
      sections.push(section);
    });

    return sections;
  }

  loadComponents(sectionListItem, section, allowedComponents = {}) {
    var tree = [];
    this.builder.getNodeTree(section, tree, allowedComponents);

    var html = this.builder.drawComponentsTree(tree);
    $("ol", sectionListItem).replaceWith(html);
  }

  addSection(data) {
    var section = $(tmpl("vvveb-section", data));
    section.data("node", data.node);
    $(this.selector).append(section);

    this.loadComponents(section, data.node, this.allowedComponents);
  }

  loadSections() {
    var sections = this.getSections();

    $(this.selector).html("");
    for (let i in sections) {
      this.addSection(sections[i]);
    }
  }

  //drag and drop
  dragOver(e) {
    if (e.target != this.dragover && e.target.className == "section-item") {
      if (this.dragover) {
        this.dragover.classList.remove("drag-over");
      }
      this.dragover = e.target;
      this.dragover.classList.add("drag-over");
    }
  }

  dragEnd() {
    if (this.dragover) {
      let parent = this.selected.parentNode;
      let selectedNode = $(this.selected).data("node");
      let replaceNode = $(this.dragover).data("node");

      if (this.dragover.offsetTop > this.selected.offsetTop) {
        //replace section item list
        parent.insertBefore(this.selected, this.dragover.nextElementSibling);
        //replace section
        replaceNode.parentNode.insertBefore(
          selectedNode,
          replaceNode.nextElementSibling
        );
      } else {
        //replace section item list
        parent.insertBefore(this.selected, this.dragover);
        //replace section
        replaceNode.parentNode.insertBefore(selectedNode, replaceNode);
      }

      this.dragover.classList.remove("drag-over");
      console.log(selectedNode)

      let node = selectedNode.get ? selectedNode.get(0) : selectedNode;

      this.builder.Undo.addMutation({
        type: "move",
        target: node,
        oldParent: node.parentNode,
        oldNextSibling: node.nextSibling,
      });
    }

    this.selected = null;
    this.dragover = null;
  }

  dragStart(e) {
    this.selected = e.target;
  }
}

class FileManager {
  constructor(instance) {
    this.builder = instance;
    this.tree = false;
    this.pages = {};
    this.currentPage = false;
    this.allowedComponents = {};
  }

  init(allowedComponents = {}) {
    let self = this;
    this.allowedComponents = allowedComponents;
    this.tree = $("#filemanager .tree > ol").html("");

    $(this.tree).on("click", "a", function (e) {
      e.preventDefault();
      return false;
    });

    $(this.tree).on("click", ".delete", function (e) {
      let element = $(e.target).closest("li");
      self.deletePage(element);
      e.preventDefault();
      return false;
    });

    $(this.tree).on("click", ".rename", function (e) {
      let element = $(e.target).closest("li");
      self.renamePage(element, e, false);
      e.preventDefault();
      return false;
    });

    $(this.tree).on("click", ".duplicate", function (e) {
      let element = $(e.target).closest("li");
      self.renamePage(element, e, true);
      e.preventDefault();
      return false;
    });

    $(this.tree).on("click", ".split", function () {
      let page = $(this).closest("li").data("page");
      if (page)
        self.loadPage(page, allowedComponents, undefined, undefined, true);
      return false;
    });

    $(this.tree).on("click", "li[data-page] label", function () {
      let page = $(this.parentNode).data("page");
      if (page) self.loadPage(page, allowedComponents);
      return false;
    });

    $(this.tree)
      .on("click", "li[data-component] label ", function (e) {
        let node = $(e.currentTarget.parentNode).data("node");

        delay(
          () =>
            self.builder.Builder.frameHtml.animate(
              {
                scrollTop: $(node).offset().top - $(node).height() / 2,
              },
              500
            ),
          500
        );

        node.click();
      })
      .on("mouseenter", "li[data-component] label", function (e) {
        let node = $(e.currentTarget.parentNode).data("node");

        delay(
          () =>
            self.builder.Builder.frameHtml.animate(
              {
                scrollTop: $(node).offset().top - $(node).height() / 2,
              },
              500
            ),
          1000
        );

        $(node).trigger("mousemove");
      });
  }

  deletePage(element) {
    let page = element[0].dataset;
    if (confirm(`Are you sure you want to delete "${page.file}"template?`)) {
      $.ajax({
        type: "POST",
        url: deleteUrl, //set your server side save script url
        data: { file: page.file },
        success: function (data) {
          let bg = "bg-success";
          if (data.success) {
            $("#top-panel .save-btn").attr("disabled", "true");
          } else {
            //bg = "bg-danger";
          }

          displayToast(bg, data.message ?? data);
        },
        error: function (data) {
          displayToast("bg-danger", data.responseText);
        },
      });
      element.remove();
    }
  }

  friendlyName(name) {
    name = name.replaceAll("--bs-", "").replaceAll("-", " ").trim();
    return (name = name[0].toUpperCase() + name.slice(1));
  }

  renamePage(element, e, duplicate = false) {
    let page = element[0].dataset;
    let newfile = prompt(`Enter new file name for "${page.file}"`, page.file);
    let _self = this;
    if (newfile) {
      let req_data = { file: page.file, newfile: newfile, duplicate };
      this.builder.emit("filemanager:page.rename.before", req_data);

      $.ajax({
        type: "POST",
        url: renameUrl, //set your server side save script url
        data: req_data,
        success: function (data) {
          let bg = "bg-success";
          if (data.success) {
            $("#top-panel .save-btn").attr("disabled", "true");
          } else {
            //bg = "bg-danger";
          }

          displayToast(bg, data.message ?? data);
          let baseName = newfile.replace(".html", "");
          let newName = this.friendlyName(
            newfile.replace(/.*[\/\\]+/, "")
          ).replace(".html", "");

          if (duplicate) {
            let data = _self.pages[page.page];
            data["file"] = newfile;
            data["title"] = newName;
            this.builder.FileManager.addPage(baseName, data);
          } else {
            _self.pages[page.page]["file"] = newfile;
            _self.pages[page.page]["title"] = newName;
            $("> label span", element).html(newName);
            page.url = page.url.replace(page.file, newfile);
            page.file = newfile;
            _self.pages[page.page]["url"] = page.url;
            _self.pages[page.page]["file"] = page.file;
          }
        },
        error: function (data) {
          displayToast("bg-danger", data.responseText);
        },
      });
      this.builder.emit("filemanager:page.rename", req_data);
    }
  }

  addPage(name, data) {
    this.pages[name] = data;
    data["name"] = name;

    var folder = this.tree;
    if (data.folder) {
      if (
        !(folder = this.tree.find('li[data-folder="' + data.folder + '"]'))
          .length
      ) {
        data.folderTitle = data.folder[0].toUpperCase() + data.folder.slice(1);
        folder = $(tmpl("vvveb-filemanager-folder", data));
        this.tree.append(folder);
      }

      folder = folder.find("> ol");
    }

    folder.append(tmpl("vvveb-filemanager-page", data));
    this.builder.emit("filemanager:page.add", name, this.pages[name], folder);
  }

  addPages(pages) {
    for (let page in pages) {
      this.addPage(pages[page]["name"], pages[page]);
    }
  }

  addComponent(name, url, title, page) {
    $("[data-page='" + page + "'] > ol", this.tree).append(
      tmpl("vvveb-filemanager-component", {
        name: name,
        url: url,
        title: title,
      })
    );
  }

  loadComponents(allowedComponents = {}) {
    let FrameDocument = this.builder.Builder.iframe.contentWindow.document;

    var tree = [];
    this.builder.getNodeTree(FrameDocument.body, tree, allowedComponents);

    var html = this.builder.drawComponentsTree(tree);
    $("[data-page='" + this.currentPage + "'] > ol", this.tree).replaceWith(
      html
    );
  }

  getCurrentUrl() {
    if (this.currentPage) {
      return this.pages[this.currentPage]["url"];
    }
  }

  getPageData(key) {
    if (this.currentPage) {
      return this.pages[this.currentPage][key];
    }
  }

  getCurrentFileName() {
    if (this.currentPage) {
      var folder = this.pages[this.currentPage]["folder"];
      folder = folder ? folder + "/" : "";
      return folder + this.pages[this.currentPage]["file"];
    }
  }

  reloadCurrentPage() {
    if (this.currentPage) return this.loadPage(this.currentPage);
  }

  loadPage(
    name,
    allowedComponents = false,
    disableCache = true,
    loadComponents = false,
    split = false
  ) {
    if (name == this.builder.Builder.page?.name) return null;
    let page = $("[data-page='" + name + "']", this.tree);
    //remove active from current active page
    $("[data-page]", this.tree).removeClass("active");
    //set loaded page as active
    page.addClass("active");
    //open parent folder if closed
    $("> input[type=checkbox]", $(page).parents("[data-folder]")).prop(
      "checked",
      true
    );

    this.currentPage = name;
    var url = this.pages[name]["url"];
    $(".btn-preview-url").attr("href", url);

    url =
      url +
      (disableCache
        ? (url.indexOf("?") > -1 ? "&r=" : "?r=") + Math.random()
        : "");

    let pageItem = this.builder.Builder.addPage(name, this.pages[name]);
    this.builder.Builder.setPage(pageItem.name, split);
    pageItem.load(url, () => {
      if (loadComponents) {
        this.builder.FileManager.loadComponents(allowedComponents);
      }
      this.builder.SectionList.loadSections(allowedComponents);
      this.builder.StyleManager.init();
    });

    this.builder.emit("filemanager:page.load", name, this.pages[name], page);
  }

  scrollBottom() {
    var scroll = this.tree.parent();
    scroll.scrollTop(scroll.prop("scrollHeight"));
  }
}

class Breadcrumb {
  constructor(instance) {
    this.builder = instance;
    this.tree = false;
  }

  init() {
    let self = this;
    this.tree = $(".breadcrumb-navigator > .breadcrumb").html("");

    $(this.tree)
      .on("click", ".breadcrumb-item", function (e) {
        let node = $(this).data("node");
        if (node) {
          node.click();

          delay(
            () =>
              self.builder.Builder.frameHtml.animate(
                {
                  scrollTop: $(node).offset().top - $(node).height() / 2,
                },
                500
              ),
            100
          );
        }
        e.preventDefault();
      })
      .on("mouseenter", ".breadcrumb-item", function () {
        let node = $($(this).data("node"));
        node.css("outline", "1px dashed blue");
        /*
			delay(
				() => this.builder.Builder.frameHtml.animate({
					scrollTop: $(node).offset().top - ($(node).height() / 2)
				}, 500),
			 1000);

			$(node).trigger("mousemove");
			*/
      })
      .on("mouseleave", ".breadcrumb-item", function () {
        let node = $($(this).data("node"));
        node.css("outline", "");
        if (node.attr("style") == "") node.removeAttr("style");
      });
  }

  addElement(data, element) {
    var li = $(tmpl("vvveb-breadcrumb-navigaton-item", data));
    li.data("node", element);
    $(this.tree).prepend(li);
  }

  loadBreadcrumb(element) {
    this.tree.html("");
    var currentElement = element;

    while (currentElement.parentElement) {
      this.addElement(
        {
          name: this.builder.Builder._getElementType(
            currentElement
          ).toLowerCase(),
        },
        currentElement
      );

      currentElement = currentElement.parentElement;
    }
  }
}

class FontsManager {
  constructor(instance) {
    this.builder = instance;
    this.activeFonts = [];
    this.providers = {}; //{"google":GoogleFontsManager};
  }

  addProvider(provider, Obj) {
    this.providers[provider] = Obj;
  }

  //add also element so we can keep track of the used fonts to remove unused ones
  addFont(provider, fontFamily, element = false) {
    if (!provider) return;

    let providerObj = this.providers[provider];
    if (providerObj) {
      providerObj.addFont(fontFamily);
      this.activeFonts.push({ provider, fontFamily, element });
    }
  }

  removeFont(provider, fontFamily) {
    let providerObj = this.providers[provider];
    if (provider != "default" && providerObj) {
      providerObj.removeFont(fontFamily);
    }
  }

  //check if the added fonts are still used for the elements they were set and remove unused ones
  cleanUnusedFonts() {
    for (i in this.activeFonts) {
      let elementFont = this.activeFonts[i];
      if (elementFont.element) {
        //if (getComputedStyle(elementFont.element)['font-family'] != elementFont.fontFamily) {
        if (
          this.builder.StyleManager.getStyle(element, "font-family") !=
          elementFont.fontFamily
        ) {
          this.removeFont(elementFont.provider, elementFont.fontFamily);
        }
      }
    }
  }
}

class ColorPaletteManager {
  constructor(instance) {
    this.builder = instance;
  }

  getAllCSSVariableNames(styleSheets = document.styleSheets, selector) {
    let cssVars = { font: {}, color: {}, dimensions: {} };
    for (var i = 0; i < styleSheets.length; i++) {
      try {
        let cssRules = styleSheets[i].cssRules;
        for (var j = 0; j < cssRules.length; j++) {
          try {
            let style = cssRules[j].style;
            if (
              selector &&
              cssRules[j].selectorText &&
              cssRules[j].selectorText != selector
            )
              continue;
            for (var k = 0; k < style.length; k++) {
              let name = style[k];
              let value = style.getPropertyValue(name).trim();
              let type = "";

              if (name.startsWith("--")) {
                //ignore bootstrap rgb variables
                if (name.endsWith("-rgb")) continue;
                //ignore variables depending on other variables
                if (value.startsWith("var(")) continue;

                let friendlyName = name
                  .replace("--bs-", "")
                  .replaceAll("-", " ");

                if (value.startsWith("#")) {
                  type = "color";
                } else if (value.indexOf('"') >= 0 || value.indexOf("'") >= 0) {
                  type = "font";
                } else if (
                  value.endsWith("em") > 0 ||
                  value.endsWith("px") > 0
                ) {
                  type = "dimensions";
                } else if (!isNaN(parseFloat(value))) {
                  type = "dimensions";
                }

                if (type) {
                  if (!cssVars[type]) cssVars[type] = {};
                  cssVars[type][name] = { value, type, friendlyName };
                }
              }
            }
          } catch (error) {}
        }
      } catch (error) {}
    }
    return cssVars;
  }

  getCssWithVars(styleSheets = document.styleSheets, vars) {
    let cssVars = {};
    let css = "";
    let cssStyles = "";
    for (var i = 0; i < styleSheets.length; i++) {
      try {
        let cssRules = styleSheets[i].cssRules;
        for (var j = 0; j < cssRules.length; j++) {
          try {
            let style = cssRules[j].style;
            //if (selector && cssRules[j].selectorText && cssRules[j].selectorText != selector) continue;
            cssStyles = "";
            for (var k = 0; k < style.length; k++) {
              let name = style[k];
              let value = style.getPropertyValue(name);
              if (name.startsWith("--bs-btn-")) {
                for (v in vars) {
                  if (value == vars[v]) {
                    cssVars[name] = v;
                    cssStyles += name + ":var(" + v + ");\n";
                  }
                }
              }
            }
            if (cssStyles) {
              css += cssRules[j].selectorText + "{\n";
              css += cssStyles;
              css += "}\n";
            }
          } catch (error) {}
        }
      } catch (error) {}
    }
    return cssVars;
  }

  init(document) {
    this.builder.Builder.selectedEl = $(document.body);
    this.builder.Components.render(
      "config/bootstrap",
      "#configuration .component-properties"
    );
  }
}

class VvvebJS extends EventEmitter {
  constructor(config) {
    super();
    config = config || {};
    this.config = {
      ...config,
      themeBaseUrl: config.themeBaseUrl || "demo/landing/",
      components: [new HTMLComponents(), ...(config.components || [])],
      plugins: [...(config.plugins || [])],
      sections: [...(config.sections || [])],
      blocks: [...(config.blocks || [])],
    };
    this.defaultComponent = "_base";
    this.preservePropertySections = true;
    //icon = use component icon when dragging | html = use component html to create draggable element
    this.dragIcon = "icon";
    //if empty the html of the component is used to view dropping in real time but for large elements it can jump around for this you can set a html placeholder with this option
    this.dragHtml =
      '<div style="background:limegreen;;width:100%;height:3px;border:1px solid limegreen;box-shadow:0px 0px 2px 1px rgba(0,0,0,0.14);"></div>';

    this.baseUrl = document.currentScript
      ? document.currentScript.src.replace(/[^\/]*?\.js$/, "")
      : "";
    this.imgBaseUrl = this.baseUrl + "libs/builder/";
    this.themeBaseUrl = this.config.themeBaseUrl || "demo/landing/";

    this.ComponentsGroup = {};
    this.SectionsGroup = {};
    this.BlocksGroup = {};

    this.Blocks = new Blocks();
    this.Sections = new Sections();
    this.Components = new Components(this);

    this.Gui = new Gui(this);
    this.Undo = new Undo(this);
    this.Builder = new Builder(this);
    this.CodeEditor = new CodeEditor(this);
    this.WysiwygEditor = new WYSIWYGEditor(this);

    this.Breadcrumb = new Breadcrumb(this);
    this.SectionList = new SectionList(this);
    this.FileManager = new FileManager(this);

    this.FontsManager = new FontsManager(this);
    this.StyleManager = new StyleManager(this);
    this.ContentManager = new ContentManager(this);
    this.ColorPaletteManager = new ColorPaletteManager(this);
  }

  initialize() {
    this.Components._baseComponent = new Component();
    this.Components._baseComponent.init(this);

    this.loadPlugins();
    this.loadBlocks();
    this.loadComponents();
    this.loadSections();

    let page = localStorage.getItem("vvveb.page");
    if (page) {
      page = this.config.pages.find((item) => item.name === page);
    }

    if (!page) page = this.config.pages[0];

    this.Builder.init(page["url"]);
    this.on("builder:page.focus", () => this.Gui.pageProperties.render());

    this.Gui.init();
    this.Gui.pageProperties = new PagePropertiesConfigComponent();
    this.Gui.pageProperties.init(this);
    this.emit("gui:init");

    this.FileManager.init();
    this.emit("filemanager:init");

    this.SectionList.init();
    this.emit("sectionlist:init");

    this.Breadcrumb.init();
    this.emit("breadcrumb:init");

    this.FileManager.addPages(this.config.pages);
    this.Builder.loadPage(page["name"]);
    this.Breadcrumb.init();
  }

  load(key) {
    for (let item of this.config[key]) {
      item.init(this);
    }
  }

  loadPlugins() {
    this.load("plugins");
  }

  loadComponents() {
    this.load("components");
  }

  loadSections() {
    this.load("sections");
  }

  loadBlocks() {
    this.load("blocks");
  }

  getNodeTree(node, parent, allowedComponents) {
    let self = this;

    function getNodeTreeTraverse(node, parent) {
      if (node.hasChildNodes()) {
        for (var j = 0; j < node.childNodes.length; j++) {
          let child = node.childNodes[j];
          let element, matchChild;

          //skip text and comments nodes
          if (child.nodeType == 3 || child.nodeType == 8) {
            continue;
          }

          if (
            child &&
            child["attributes"] != undefined &&
            (matchChild = self.Components.matchNode(child))
          ) {
            if (
              Array.isArray(allowedComponents) &&
              allowedComponents.indexOf(matchChild.type) == -1
            ) {
              element = getNodeTreeTraverse(child, parent);
              continue;
            }

            element = {
              name: matchChild.name,
              image: matchChild.image,
              type: matchChild.type,
              node: child,
              children: [],
            };

            element.children = [];
            parent.push(element);

            element = getNodeTreeTraverse(child, element.children);
          } else {
            element = getNodeTreeTraverse(child, parent);
          }
        }
      }

      return false;
    }

    getNodeTreeTraverse(node, parent);
  }

  drawComponentsTree(tree) {
    var j = 1;
    let self = this;
    var prefix = Math.floor(Math.random() * 100);

    function drawComponentsTreeTraverse(tree) {
      var html = $("<ol></ol>");
      j++;

      for (let i in tree) {
        var node = tree[i];
        var id = prefix + "-" + j + "-" + i;

        if (tree[i].children.length > 0) {
          var li = $(
            '<li data-component="' +
              node.name +
              '">\
								<label for="id' +
              id +
              '" style="background-image:url(' +
              self.imgBaseUrl +
              node.image +
              ')"><span>' +
              node.name +
              '</span></label>\
								<input type="checkbox" id="id' +
              id +
              '">\
							</li>'
          );
          li.append(drawComponentsTreeTraverse(node.children));
        } else {
          var li = $(
            '<li data-component="' +
              node.name +
              '" class="file">\
							<label for="id' +
              id +
              '" style="background-image:url(' +
              self.imgBaseUrl +
              node.image +
              ')"><span>' +
              node.name +
              '</span></label>\
							<input type="checkbox" id="id' +
              id +
              '">\
							</li>'
          );
        }

        li.data("node", node.node);
        html.append(li);
      }

      return html;
    }

    return drawComponentsTreeTraverse(tree);
  }
}
