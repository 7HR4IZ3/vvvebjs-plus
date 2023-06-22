
class PropertyGroup {
  constructor(name, config, properties) {
    this.name = name;
    this.key = `${this.name.toLowerCase()}_header`

    if (config && config instanceof Array) {
      this.properties = config;
      this.config = properties || {};
    } else {
      this.properties = properties;
      this.config = config || {};
    }
    this.input = new SectionInput({ key: this.key, ...this.config, header: this.name });
  }

  get html() {
    return tmpl("vvveb-input-sectioninput", {
      header: this.name,
      key: this.key,
      ...this.config
    })
  }
}

class Property {
  constructor(name, input, config) {
    this.name = name;
    this.config = {
      col: 6,
      inline: false,
      sort: base_sort++,
      ...(config || {}),
    };
    this.input = this.config.input = input || new TextInput();
  }

  get html() {
    return tmpl("vvveb-property", {
      name: this.name,
      ...this.config.input.data,
      ...this.config
    })
  }
}

var base_sort = 100; //start sorting for base component from 100 to allow extended properties to be first
var content_section = "content"
var style_section = "style";
var advanced_section = "advanced";

function capitalize(name) {
  return name.slice(0,1).toUpperCase() + name.slice(1).toLowerCase()
}

function toCamel(string) {
  let ret = string.split("-");
  return ret.slice(0, 1) + ret.slice(1).map(capitalize).join("")
}

class Component extends Plugin {
  type = "_base"
  name = "Element";

  initialize() {
    this.builder.Components.add(this.type, this)
  }
  
  render(builder) {
      if (builder) {
          this.init(builder)
      }
      this.builder.Components.render(this.type, this.panel)
  }
  
  get properties() {
    let self = this;
    return [
      new PropertyGroup("Attributes", {
        section: content_section,
        beforeInit(element) {
          for (let attr of element.attributes) {
            let name = attr.name;
            if (name !== "class" && name !== "id" && name !== "style") {
              let prop;
              if (name.startsWith("on")) {
                prop = new Property(name, new CodeInput({
                  key: name, htmlAttr: name,
                  defaultValue: attr.value,
                  config: {
                    mode: "javascript"
                  }
                }), { col: 12 })
              } else {
                prop = new Property(name, new TextInput({
                  key: name, htmlAttr: name,
                  defaultValue: attr.value
                }))
              }
              this.properties.splice(0, 0, prop)
            }
          }
        }
      }, [
        new Property(
          "Id",
          new TextInput({
            key: "id",
            htmlAttr: "id",
          }),
          { section: content_section }
        ),
        new Property(
          "Class",
          new TextInput({
            key: "class",
            htmlAttr: "class",
          })
        ),
        // new Property("Inner Text",
        //   new TextareaInput({ key: "innertext", htmlAttr: "innerText" }),
        //   { col: 12 }
        // ),
        // new Property("Inner HTML",
        //   new code_input({ key: "innerhtml", htmlAttr: "innerHTML" }),
        //   { col: 12 }
        // )
        new PropertyGroup("Add Attribute", [
          new Property(
            "",
            new MultiInput({
              name: new TextInput({ col: 12 }),
              value: new TextInput({ col: 12 }),
              "Add Attr": new ButtonInput({
                key: "addAttr",
                icon: "la-plus",
                text: "",
                class: "col-12"
              })
            }),
            {
              col: 12,
              onChange(node, value, input, component, caller, caller_input) {
                if (caller == "Add Attr") {
                  $(node).attr(value.name, value.value);
                  //render component properties again to include the new column inputs
                  self.builder.Builder.loadNodeComponent(node);
                }
                return node;
              },
            }
          )
        ])
      ]),
      new PropertyGroup("Add Style", { section: style_section }, [
        new Property(
          "",
          new MultiInput({
            name: new TextInput({ col: 12 }),
            value: new TextInput({ col: 12 }),
            "Add Attr": new ButtonInput({
              key: "addAttr",
              icon: "la-plus",
              text: "",
              class: "col-12"
            })
          }),
          {
            col: 12,
            onChange(node, value, input, component, caller, caller_input) {
              if (caller == "Add Attr") {
                let style = {};
                style[value.name] = value.value;
                $(node).css(style);
                //render component properties again to include the new column inputs
                self.builder.Builder.loadNodeComponent(node);
              }
              return node;
            },
          }
        )
      ]),
      new PropertyGroup("Display", { section: style_section }, [
        new Property(
          "Mode",
          new SelectInput({
            key: "display",
            htmlAttr: "style",
            options: [
              {
                value: "none",
                text: "None",
              },
              {
                value: "block",
                text: "Block",
              },
              {
                value: "inline",
                text: "Inline",
              },
              {
                value: "run-in",
                text: "Run In",
              },
              {
                value: "contents",
                text: "Contents",
              },
              {
                value: "flow",
                text: "Flow",
              },
              {
                value: "flow-root",
                text: "Flow Root",
              },
              {
                value: "flex",
                text: "Flex",
              },
              {
                value: "table",
                text: "Table",
              },
              {
                value: "grid",
                text: "Grid",
              },
              {
                value: "ruby",
                text: "Ruby",
              },
              {
                value: "table",
                text: "Table",
              },
              {
                value: "inline block",
                text: "Inline Block",
              },
              {
                value: "inline flex",
                text: "Inline Flex",
              },
              {
                value: "inline table",
                text: "Inline Table",
              },
              {
                value: "inline grid",
                text: "Inline Grid",
              },
            ],
          })
        ),
        new Property(
          "Position",
          new SelectInput({
            key: "position",
            htmlAttr: "style",
            options: [
              {
                value: "static",
                text: "Static",
              },
              {
                value: "fixed",
                text: "Fixed",
              },
              {
                value: "relative",
                text: "Relative",
              },
              {
                value: "absolute",
                text: "Absolute",
              },
            ],
          })
        ),
        new Property(
          "Top",
          new CssUnitInput({ key: "top", htmlAttr: "style" })
        ),
        new Property(
          "Bottom",
          new CssUnitInput({ key: "bottom", htmlAttr: "style" })
        ),
        new Property(
          "Left",
          new CssUnitInput({ key: "left", htmlAttr: "style" })
        ),
        new Property(
          "Right",
          new CssUnitInput({ key: "right", htmlAttr: "style" })
        ),
        new Property(
          "Float",
          new RadioButtonInput({
            key: "float",
            htmlAttr: "style",
            extraclass: "btn-group-sm btn-group-fullwidth",
            options: [
              {
                value: "none",
                icon: "la la-times",
                //text: "None",
                title: "None",
                checked: true,
              },
              {
                value: "left",
                //text: "Left",
                title: "Left",
                icon: "la la-align-left",
                checked: false,
              },
              {
                value: "right",
                //text: "Right",
                title: "Right",
                icon: "la la-align-right",
                checked: false,
              },
            ],
          }),
          { col: 12 }
        ),
        new Property(
          "Opacity",
          new RangeInput({ key: "opacity", htmlAttr: "style", max: 1, min: 0, step: 0.1 }),
          { parent: "" }
        ),
        new Property(
          "Background Color",
          new ColorInput({ key: "background-color", htmlAttr: "style" })
        ),
        new Property(
          "Text Color",
          new ColorInput({ key: "color", htmlAttr: "style" })
        ),
      ]),
      new PropertyGroup("Typography", { section: style_section }, [
        new Property(
          "Font Size",
          new CssUnitInput({ key: "font-size", htmlAttr: "style" })
        ),
        new Property(
          "Font Weight",
          new SelectInput({
            key: "font-weight",
            htmlAttr: "style",
            options: [
              {
                value: "",
                text: "Default",
              },
              {
                value: "100",
                text: "Thin",
              },
              {
                value: "200",
                text: "Extra-Light",
              },
              {
                value: "300",
                text: "Light",
              },
              {
                value: "400",
                text: "Normal",
              },
              {
                value: "500",
                text: "Medium",
              },
              {
                value: "600",
                text: "Semi-Bold",
              },
              {
                value: "700",
                text: "Bold",
              },
              {
                value: "800",
                text: "Extra-Bold",
              },
              {
                value: "900",
                text: "Ultra-Bold",
              },
            ],
          })
        ),
        new Property(
          "Font Family",
          new SelectInput({
            key: "font-family",
            htmlAttr: "style",
            options: fontList,
          }),
          { col: 12 }
        ),
        new Property(
          "Text Align",
          new RadioButtonInput({
            key: "text-align",
            htmlAttr: "style",
            extraclass: "btn-group-sm btn-group-fullwidth",
            options: [
              {
                value: "",
                icon: "la la-times",
                //text: "None",
                title: "None",
                checked: true,
              },
              {
                value: "left",
                //text: "Left",
                title: "Left",
                icon: "la la-align-left",
                checked: false,
              },
              {
                value: "center",
                //text: "Center",
                title: "Center",
                icon: "la la-align-center",
                checked: false,
              },
              {
                value: "right",
                //text: "Right",
                title: "Right",
                icon: "la la-align-right",
                checked: false,
              },
              {
                value: "justify",
                //text: "justify",
                title: "Justify",
                icon: "la la-align-justify",
                checked: false,
              },
            ],
          }),
          { col: 12 }
        ),
        new Property(
          "Line Height",
          new CssUnitInput({ key: "line-height", htmlAttr: "style" })
        ),
        new Property(
          "Letter Spacing",
          new CssUnitInput({ key: "letter-spacing", htmlAttr: "style" })
        ),
        new Property(
          "Text Decoration",
          new RadioButtonInput({
            key: "text-decoration-line",
            htmlAttr: "style",
            extraclass: "btn-group-sm btn-group-fullwidth",
            options: [
              {
                value: "none",
                icon: "la la-times",
                //text: "None",
                title: "None",
                checked: true,
              },
              {
                value: "underline",
                //text: "Left",
                title: "underline",
                icon: "la la-long-arrow-alt-down",
                checked: false,
              },
              {
                value: "overline",
                //text: "Right",
                title: "overline",
                icon: "la la-long-arrow-alt-up",
                checked: false,
              },
              {
                value: "line-through",
                //text: "Right",
                title: "Line Through",
                icon: "la la-strikethrough",
                checked: false,
              },
              {
                value: "underline overline",
                //text: "justify",
                title: "Underline Overline",
                icon: "la la-arrows-alt-v",
                checked: false,
              },
            ],
          }),
          { col: 12 }
        ),
        new Property(
          "Decoration Color",
          new ColorInput({ key: "text-decoration-color", htmlAttr: "style" })
        ),
        new Property(
          "Decoration Style",
          new SelectInput({
            key: "text-decoration-style",
            htmlAttr: "style",
            options: [
              {
                value: "",
                text: "Default",
              },
              {
                value: "solid",
                text: "Solid",
              },
              {
                value: "wavy",
                text: "Wavy",
              },
              {
                value: "dotted",
                text: "Dotted",
              },
              {
                value: "dashed",
                text: "Dashed",
              },
              {
                value: "double",
                text: "Double",
              },
            ],
          })
        ),
      ]),
      new PropertyGroup("Size", { expanded: true, section: style_section }, [
        new Property(
          "Width",
          new CssUnitInput({ key: "width", htmlAttr: "style" })
        ),
        new Property(
          "Height",
          new CssUnitInput({ key: "height", htmlAttr: "style" })
        ),
        new Property(
          "Min Width",
          new CssUnitInput({ key: "min-width", htmlAttr: "style" })
        ),
        new Property(
          "Min Height",
          new CssUnitInput({ key: "min-height", htmlAttr: "style" })
        ),
        new Property(
          "Max Width",
          new CssUnitInput({ key: "max-width", htmlAttr: "style" })
        ),
        new Property(
          "ax Height",
          new CssUnitInput({ key: "max-height", htmlAttr: "style" })
        )
      ]),
      new PropertyGroup("Margin", { section: style_section }, [
        new Property(
          "Top",
          new CssUnitInput({ key: "margin-top", htmlAttr: "style" })
        ),
        new Property(
          "Bottom",
          new CssUnitInput({ key: "margin-bottom", htmlAttr: "style" })
        ),
        new Property(
          "Left",
          new CssUnitInput({ key: "margin-left", htmlAttr: "style" })
        ),
        new Property(
          "Right",
          new CssUnitInput({ key: "margin-right", htmlAttr: "style" })
        )
      ]),
      new PropertyGroup("Padding", { section: style_section }, [
        new Property(
          "Top",
          new CssUnitInput({ key: "padding-top", htmlAttr: "style" })
        ),
        new Property(
          "Bottom",
          new CssUnitInput({ key: "padding-bottom", htmlAttr: "style" })
        ),
        new Property(
          "Left",
          new CssUnitInput({ key: "padding-left", htmlAttr: "style" })
        ),
        new Property(
          "Right",
          new CssUnitInput({ key: "padding-right", htmlAttr: "style" })
        )
      ]),
      new PropertyGroup("Border", { section: style_section }, [
        new Property("Top",
          new TextInput({ key: "border-top", htmlAttr: "style" }),
          { col: 12 }
        ),
        new Property("Bottom",
          new TextInput({ key: "border-bottom", htmlAttr: "style" }),
          { col: 12 }
        ),
        new Property(
          "Style",
          new SelectInput({
            key: "border-style",
            htmlAttr: "style",
            options: [
              {
                value: "",
                text: "Default",
              },
              {
                value: "solid",
                text: "Solid",
              },
              {
                value: "dotted",
                text: "Dotted",
              },
              {
                value: "dashed",
                text: "Dashed",
              },
            ]
          }),
          { col: 12 }
        ),
        new Property(
          "Width",
          new CssUnitInput({ key: "border-width", htmlAttr: "style" })
        ),
        new Property(
          "Color",
          new ColorInput({ key: "border-color", htmlAttr: "style" })
        ),
        new PropertyGroup("Radius", { section: style_section }, [
          new Property("Top Left",
            new CssUnitInput({ key: "border-top-left-radius", htmlAttr: "style" }) 
          ),
          new Property("Top Right",
            new CssUnitInput({ key: "border-top-right-radius", htmlAttr: "style" })
          ),
          new Property("Bottom Left",
            new CssUnitInput({ key: "border-bottom-left-radius", htmlAttr: "style" }) 
          ),
          new Property("Bottom Right",
            new CssUnitInput({ key: "border-bottom-right-radius", htmlAttr: "style" })
          )
        ])
      ]),
      new PropertyGroup("Background", { section: style_section }, [
        new PropertyGroup("Image", [
          new Property("Image",
            new ImageInput({ key: "image" }),
            {
              init(node) {
                var image = $(node)
                  .css("background-image")
                  .replace(/url\(['"]?([^"\)$]+?)['"]?\).*/, "$1");
                return image;
              },

              onChange(node, value) {
                $(node).css("background-image", "url(" + value + ")");
                return node;
              }
            }
          ),
          new Property("Repeat",
            new SelectInput({
              key: "background-repeat",
              htmlAttr: "style",
              options: [
                {
                  value: "",
                  text: "Default",
                },
                {
                  value: "repeat-x",
                  text: "repeat-x",
                },
                {
                  value: "repeat-y",
                  text: "repeat-y",
                },
                {
                  value: "no-repeat",
                  text: "no-repeat",
                },
              ]
            })
          ),
          new Property("Size",
            new SelectInput({
              key: "background-size",
              htmlAttr: "style",
              options: [
                {
                  value: "",
                  text: "Default",
                },
                {
                  value: "contain",
                  text: "contain",
                },
                {
                  value: "cover",
                  text: "cover",
                },
              ]
            })
          ),
          new Property("Position X",
            new SelectInput({
              key: "backgrounnd-position-x",
              htmlAttr: 'style',
              options: [
                {
                  value: "",
                  text: "Default",
                },
                {
                  value: "center",
                  text: "center",
                },
                {
                  value: "right",
                  text: "right",
                },
                {
                  value: "left",
                  text: "left",
                },
              ]
            })
          ),
          new Property("Position Y",
            new SelectInput({
              key: "backgrounnd-position-y",
              htmlAttr: 'style',
              options: [
                {
                  value: "",
                  text: "Default",
                },
                {
                  value: "center",
                  text: "center",
                },
                {
                  value: "right",
                  text: "right",
                },
                {
                  value: "left",
                  text: "left",
                },
              ]
            })
          )
        ]),
        new Property("Color",
          new ColorInput({ key: "background-color", htmlAttr: "style" })
        )
      ]),

      new PropertyGroup("Device Visibility", { section: advanced_section }, [
        new Property("Extra Small Devices",
          new ToggleInput({
            key: "hidexs", htmlAttr: "class",
            on: "d-xs-none", off: "", validValues: ["d-xs-none"]
          }), { inline: true }
        ),
        new Property("Small Devices",
          new ToggleInput({
            key: "hidesm", htmlAttr: "class",
            on: "d-sm-none", off: "", validValues: ["d-sm-none"]
          }), { inline: true }
        ),
        new Property("Medium Devices",
          new ToggleInput({
            key: "hidemd", htmlAttr: "class",
            on: "d-md-none", off: "", validValues: ["d-md-none"]
          }), { inline: true }
        ),
        new Property("Large Devices",
          new ToggleInput({
            key: "hidelg", htmlAttr: "class",
            on: "d-lg-none", off: "", validValues: ["d-lg-none"]
          }), { inline: true }
        ),
        new Property("Extra Large Devices",
          new ToggleInput({
            key: "hidexl", htmlAttr: "class",
            on: "d-xl-none", off: "", validValues: ["d-xl-none"]
          }), { inline: true }
        ),
        new Property("Extra Extra Large Devices",
          new ToggleInput({
            key: "hidexxl", htmlAttr: "class",
            on: "d-xxl-none", off: "", validValues: ["d-xxl-none"]
          }), { inline: true }
        )
      ])
    ];
  }
}

class PagePropertiesConfigComponent extends Component {
  panel = CONFIGURATION_PANEL;
  name = "";
  type = "config/page";
  preserveSection = true;
  installed = [];

  get properties() {
    let FrameDocument = this.builder.Builder.iframe.contentWindow.document
    let properties = [
      new PropertyGroup("Page Properties", [
        new PropertyGroup("Styles", { section: content_section }, [
          new Property(
            "",
            new DOMNodeInput(FrameDocument, "[rel='stylesheet'], style", [
              "href",
              "innerText",
            ]),
            { col: 12 }
          ),
        ]),
        new PropertyGroup("Scripts", { section: content_section }, [
          new Property(
            "",
            new DOMNodeInput(FrameDocument, "script[src]", [
              "src",
              "innerText",
            ]),
            { col: 12 }
          ),
        ]),
        // new PropertyGroup("Simulate Event", {
        //   section: advanced_section,
        //   beforeInit(element) {
        //     if (!element) return
        //     for (let attr in element) {
        //       if (attr.startsWith("on") && element[attr]) {
        //         let prop = new Property("",
        //           new ButtonInput({
        //             key: attr,
        //             text: capitalize(attr.slice(2)),
        //             icon: "la-play"
        //           }),
        //           {
        //             onChange(node) {
        //               $(node).trigger(attr.slice(2));
        //               return node;
        //             }
        //           }
        //         )
        //         this.properties.push(prop);
        //       }
        //     }
        //   }
        // }, []),
        // new PropertyGroup("Event Listeners", {
        //   section: advanced_section,
        //   beforeInit(element) {
        //     if (!element) return
        //     for (let attr in element) {
        //       if (attr.startsWith("on")) {
        //         let prop = new Property(
        //           capitalize(attr.slice(2)),
        //           new code_input({ key: attr, htmlAttr: attr }),
        //           { col: 12 }
        //         )
        //         this.properties.push(prop)
        //       }
        //     }
        //   }
        // }, [])
      ]),
    ];
    for (let prop of this.installed) {
      properties.push(new PropertyGroup(prop.name, prop.properties));
    }
    return properties;
  }

  install(prop) {
    prop.init && prop.init(this.builder);
    this.installed.push(prop);
  }
}

