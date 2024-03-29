bgcolorClasses = ["bg-primary", "bg-secondary", "bg-success", "bg-danger", "bg-warning", "bg-info", "bg-light-subtle", "bg-dark", "bg-white"]

bgcolorSelectOptions = 
[{
	value: "Default",
	text: ""
}, 
{
	value: "bg-primary",
	text: "Primary"
}, {
	value: "bg-secondary",
	text: "Secondary"
}, {
	value: "bg-success",
	text: "Success"
}, {
	value: "bg-danger",
	text: "Danger"
}, {
	value: "bg-warning",
	text: "Warning"
}, {
	value: "bg-info",
	text: "Info"
}, {
	value: "bg-light-subtle",
	text: "Light"
}, {
	value: "bg-dark",
	text: "Dark"
}, {
	value: "bg-white",
	text: "White"
}];


class Bootstrap5ConfigComponent extends Component {
  name = "Bootstrap5 Variables"
  type = "config/bootstrap"
  panel = CONFIGURATION_PANEL
  preserveSection = true

  get properties() {
    let properties = [];
        var i = 0;
        var j = 0;
        let FrameDocument = this.builder.Builder.iframe.contentWindow.document

        let cssVars = builder.ColorPaletteManager.getAllCSSVariableNames(
          FrameDocument.styleSheets /*, ":root"*/
        );

        for (let type in cssVars) {
          let group = new PropertyGroup(
            type[0].toUpperCase() + type.slice(1),
            { name: type, section: "content" }, []
          )

          for (let selector in cssVars[type]) {
            let friendlyName = selector
              .replaceAll(/--bs-/g, "")
              .replaceAll("-", " ")
              .trim();
            friendlyName =
              friendlyName[0].toUpperCase() + friendlyName.slice(1);

            let value = cssVars[type][selector];
            let input;
            
            i++;

            let data = { selector, type: value.type, step: "any", key: "cssvar" + i, defaultValue: value.value };

            if (value.type == "color") {
              input = new ColorInput({ ...data });
            } else if (value.type == "font") {
              data.options = fontList;
              input = new SelectInput({ ...data });
            } else if (value.type == "dimensions") {
              input = new CssUnitInput({ ...data });
            }

            group.properties.push(
              new Property(friendlyName, input,
                {
                  col: value.type == "font" || value.type == "dimensions" ? 12 : 4,
                  columnNode: this,
                  onChange(node, value, input) {
                    if (this.input.data.type == "font") {
                      let option = input.options[input.selectedIndex];
                      builder.FontsManager.addFont(
                        option.dataset.provider,
                        value,
                        node[0]
                      );
                    }

                    builder.StyleManager.setStyle(":root", this.input.data.selector, value);

                    return node;
                  }
                }
              )
            );
          }
          properties.push(group);
        }

    return properties;
  }
}

class BsContainerComponent extends HTMLDivComponent {
  name = "Container"
  image = "icons/container.svg"
  nodes = [(node) => (
    $(node).hasClass("container") ||
    $(node).hasClass("container-fluid")
  )]
  html = dom.div({ class: "container" }, "My Div")

  get properties(){
    return [
      new Property("Type",
        new SelectInput({
          key: "type", htmlAttr: "class",
          options: [
            {
              value: "container",
              text: "Default",
            },
            {
              value: "container-fluid",
              text: "Fluid",
            },
          ]
        })
      ),
      new Property("Background",
        new SelectInput({
          key: "background", htmlAttr: "class",
          options: bgcolorSelectOptions
        })
      ),
      new Property("Background Color",
        new ColorInput({ key: "background-color", htmlAttr: "style" })
      ),
      new Property("Text Color",
        new ColorInput({ key: "color", htmlAttr: "style" })
      ),
      ...super.properties
    ]
  }
}

class BsButtonComponent extends HTMLButtonComponent {
  nodes = [(node) => $(node).hasClass("btn")]
  html = dom.button({ class: "btn btn-primary" }, "Button")
  
  get properties() {
    return [
      new Property("Background",
        new SelectInput({
          key: "background", htmlAttr: "class",
          options: [
            {
              value: "btn-default",
              text: "Default",
            },
            {
              value: "btn-primary",
              text: "Primary",
            },
            {
              value: "btn btn-info",
              text: "Info",
            },
            {
              value: "btn-success",
              text: "Success",
            },
            {
              value: "btn-warning",
              text: "Warning",
            },
            {
              value: "btn-info",
              text: "Info",
            },
            {
              value: "btn-light",
              text: "Light",
            },
            {
              value: "btn-dark",
              text: "Dark",
            },
            {
              value: "btn-outline-primary",
              text: "Primary outline",
            },
            {
              value: "btn btn-outline-info",
              text: "Info outline",
            },
            {
              value: "btn-outline-success",
              text: "Success outline",
            },
            {
              value: "btn-outline-warning",
              text: "Warning outline",
            },
            {
              value: "btn-outline-info",
              text: "Info outline",
            },
            {
              value: "btn-outline-light",
              text: "Light outline",
            },
            {
              value: "btn-outline-dark",
              text: "Dark outline",
            },
            {
              value: "btn-link",
              text: "Link",
            },
          ]
        })
      ),
      new Property("Size",
        new SelectInput({
          key: 'size', htmlAttr: "class",
          options: [
            {
              value: "",
              text: "Default",
            },
            {
              value: "btn-lg",
              text: "Large",
            },
            {
              value: "btn-sm",
              text: "Small",
            },
          ]
        })
      ),
      ...super.properties
    ]
  }
}

class BsButtonGroupComponent extends Component {
  name = "Button Group"
  nodes = [(node) => $(node).hasClass("btn-group")]
  image = "icons/button_group.svg"
  html = dom.div({ class: "btn-group", role: "group", "aria-label": "Basic example" },
    dom.button({ type: "button", class: "btn btn-primary" }, "Left"),
    dom.button({ type: "button", class: "btn btn-secondary" }, "Middle"),
    dom.button({ type: "button", class: "btn btn-danger" }, "Right")
  )

  get properties() {
    return [
      new Property("Size",
        new SelectInput({
          key: "size", htmlAttr: "class",
          options: [
            {
              value: "",
              text: "Default",
            },
            {
              value: "btn-group-lg",
              text: "Large",
            },
            {
              value: "btn-group-sm",
              text: "Small",
            },
          ]
        })
      ),
      new Property("Alignment",
        new SelectInput({
          key: "alignment", htmlAttr: "class",
          options: [
            {
              value: "",
              text: "Default",
            },
            {
              value: "btn-group",
              text: "Horizontal",
            },
            {
              value: "btn-group-vertical",
              text: "Vertical",
            },
          ]
        })
      ),
      ...super.properties
    ]
  }
}

class BsButtonToolbarCOmponent extends Component {
  name = "Button Toolbar"
  nodes = [(node) => $(node).hasClass("btn-toolbar")]
  image = "icons/button_toolbar.svg"
  html = dom.div({ class: "btn-toolbar", role: "toolbar", "aria-label": "Toolbar with button groups" },
    dom.div({ class: "btn-group me-2", role: "group", "aria-label": "Basic example" },
      dom.button({ type: "button", class: "btn btn-primary" }, "1"),
      dom.button({ type: "button", class: "btn btn-secondary" }, "2"),
      dom.button({ type: "button", class: "btn btn-danger" }, "3")
    ),
    dom.div({ class: "btn-group me-2", role: "group", "aria-label": "Basic example" },
      dom.button({ type: "button", class: "btn btn-primary" }, "4"),
      dom.button({ type: "button", class: "btn btn-secondary" }, "5"),
      dom.button({ type: "button", class: "btn btn-danger" }, "6")
    ),
    dom.div({ class: "btn-group me-2", role: "group", "aria-label": "Basic example" },
      dom.button({ type: "button", class: "btn btn-primary" }, "7"),
      dom.button({ type: "button", class: "btn btn-secondary" }, "8"),
      dom.button({ type: "button", class: "btn btn-danger" }, "9")
    ),
  )
}

class BsAlertComponent extends Component {
  name = "Alert"
  image = "icons/alert.svg"
  nodes = [(n) => $(n).hasClass("alert")]
  html = dom.div(
    { class: "alert alert-warning alert-dismissible fade show", role: "alert" },
    dom.button({ type: "button", class: "btn-close", "data-bs-dismiss": "alert", "aria-label": "Close" }),
    dom.strong("Holy guacamole!"), " You should check in on some of those fields below."
  )

  get properties() {
    return [
      new Property("Type",
        new SelectInput({
          key: "type", htmlAttr: "class",
          options: [
            {
              value: "alert-primary",
              text: "Default",
            },
            {
              value: "alert-secondary",
              text: "Secondary",
            },
            {
              value: "alert-success",
              text: "Success",
            },
            {
              value: "alert-danger",
              text: "Danger",
            },
            {
              value: "alert-warning",
              text: "Warning",
            },
            {
              value: "alert-info",
              text: "Info",
            },
            {
              value: "alert-light",
              text: "Light",
            },
            {
              value: "alert-dark",
              text: "Dark",
            },
          ]
        })
      ),
      ...super.properties
    ]
  }
}

class BsBadgeComponent extends Component {
  name = "Badge"
  nodes = [(n) => $(n).hasClass("badge")]
  image = "icons/badge.svg"
  html = dom.span({ class: "badge bg-primary" }, "Primary Badge")

  get properties() {
    return [
      new Property("Color",
        new SelectInput({
          key: "color", htmlAttr: "class",
          options: [
            {
              value: "",
              text: "Default",
            },
            {
              value: "bg-primary",
              text: "Primary",
            },
            {
              value: "bg-secondary",
              text: "Secondary",
            },
            {
              value: "bg-success",
              text: "Success",
            },
            {
              value: "bg-warning",
              text: "Warning",
            },
            {
              value: "bg-danger",
              text: "Danger",
            },
            {
              value: "bg-info",
              text: "Info",
            },
            {
              value: "bg-body-secondary",
              text: "Light",
            },
            {
              value: "bg-dark",
              text: "Dark",
            },
          ]
        })
      ),
      ...super.properties
    ]
  }
}

class BsCardComponent extends Component {
  name = "Card"
  nodes = [(n) => $(n).hasClass("card")]
  image = "icons/panel.svg"
  html = dom.div({ class: "card" },
    dom.div({ class: "card-header" }, dom.img({ src: "http", alt: "Card Image" })),
    dom.div({ class: "card-body" },
      dom.h4({ class: "class-title" }, "Card Title"),
      dom.p({ class: "card-text" },
        "Some wuick example text to build on card and make up the card's content"
      ),
      dom.a({ href: "#", class: "btn btn-primay" }, "Go somewhere")
    ),
    dom.div({ class: "card-footer" }, "Card footer content")
  )
}

class BsListGroupComponent extends Component {
  name = "List Group"
  image = "icons/list_group.svg"
  nodes = [(n) => $(n).hasClass("list-group")]
  html = dom.ul({ class: "list-group" },
    dom.li({ class: "list-group-item" },
      dom.span({ class: "badge bg-success" }, "1"),
      "Cras justo odio"
    ),
    dom.li({ class: "list-group-item" },
      dom.span({ class: "badge bg-primary" }, "2"),
      "Cras justo odio"
    ),
    dom.li({ class: "list-group-item" },
      dom.span({ class: "badge bg-danger" }, "3"),
      "Cras justo odio"
    )
  )

  get properties() {
    return [
      new Property("Flush",
        new ToggleInput({
          key: "flush", htmlAttr: "class",
          on: "list-group-flush", off: ""
        })
      ),
      new Property("Numbered",
        new ToggleInput({
          key: "numbered", htmlAttr: "class",
          on: "list-group-numbered", off: ""
        })
      ),
      new Property("Horizontal",
        new ToggleInput({
          key: "horizontal", htmlAttr: "class",
          on: "list-group-horizontal", off: ""
        })
      )
    ]
  }
}

class BsListItemComponent extends Component {
  name = "List Item"
  nodes = [(n) => $(n).hasClass("list-group-item")]
  html = dom.li({ class: "list-group-item" },
    dom.span({ class: "badge bg-primary" }, "1"), "Cras justo odio"
  )

  get properties() {
    return [
      new Property("Background",
        new SelectInput({
          key: "background", htmlAttr: "class",
          options: [
            {
              value: "",
              text: "Default",
            },
            {
              value: "list-group-item-primary",
              text: "Primary",
            },
            {
              value: "list-group-item-secondary",
              text: "Secondary",
            },
            {
              value: "list-group-item-success",
              text: "Success",
            },
            {
              value: "list-group-item-warning",
              text: "Warning",
            },
            {
              value: "list-group-item-danger",
              text: "Danger",
            },
            {
              value: "list-group-item-info",
              text: "Info",
            },
            {
              value: "list-group-item-light",
              text: "Light",
            },
            {
              value: "list-group-item-dark",
              text: "Dark",
            },
          ]
        })
      ),
      new Property("Active",
        new ToggleInput({
          key: "active", htmlAttr: "class",
          on: "active", off: ""
        }),
      ),
      new Property("Disabled",
        new ToggleInput({
          key: "disabled", htmlAttr: "class",
          on: "disabled", off: ""
        })
      )
    ]
  }
}

class BsBreadcrumbComponent extends HTMLListComponent {
  name = "Breadcrumb"
  image = "icons/breadcrumbs.svg"
  nodes = [n => $(n).hasClass("breadcrumb")]
  html = dom.ol({ class: "breadcrumb" },
    dom.li({ class: "breadcrumb-item" }, dom.a({ href: "#" }, "Home")),
    dom.li({ class: "breadcrumb-item active" }, dom.a({ href: "#" }, "Library")),
    dom.li({ class: "breadcrumb-item" }, dom.a({ href: "#" }, "Book"))
  )

  get properties() {
    return [
      new Property("Divider",
        new TextInput({ key: "--bs-breadcrumb-divider", htmlAttr: "style" })
      ),
      ...super.properties
    ]
  }
}

class BsBreadcrumbItemComponent extends HTMLListItemComponent {
  name = "Breadcrumb Item"
  nodes = [n => $(n).hasClass("breadcrumb-item")]
  html = dom.li({ class: "breadcrumb-item" }, dom.a({ href: "#" }, "Item"))

  get properties() {
    return [
      new Property("Active",
        new ToggleInput({
          key: "active", htmlAttr: "class",
          on: "active", off: ""
        })
      )
    ]
  }
}

class BsPaginationComponent extends HTMLNavComponent {
  name = "Pagination"
  nodes = [n => $(n).hasClass("pagination")]
  image = "icons/pagination.svg"
  html = dom.nav(
    dom.ul({ class: "pagination" },
      dom.li({ class: "page-item" },
       dom.a({ class: "page-link", href: "#" }, "Previous")
      ),
      dom.li({ class: "page-item" },
       dom.a({ class: "page-link", href: "#" }, "1")
      ),
      dom.li({ class: "page-item" },
       dom.a({ class: "page-link", href: "#" }, "2")
      ),
      dom.li({ class: "page-item" },
       dom.a({ class: "page-link", href: "#" }, "3")
      ),
      dom.li({ class: "page-item" },
       dom.a({ class: "page-link", href: "#" }, "Next")
      )
    )
  )

  get properties() {
    return [
      new Property("Size",
        new SelectInput({
          key: "size", htmlAttr: "class",
          options: [
              {
                value: "",
                text: "Default",
              },
              {
                value: "pagination-lg",
                text: "Large",
              },
              {
                value: "pagination-sm",
                text: "Small",
              },
            ]
        })
      ),
      new Property("Alignment",
        new SelectInput({
          key: "alignment", htmlAttr: "class",
          options: [
            {
              value: "",
              text: "Default",
            },
            {
              value: "justify-content-center",
              text: "Center",
            },
            {
              value: "justify-content-end",
              text: "Right",
            },
          ]
        })
      ),
      ...super.properties
    ]
  }
}

class BsPaginationItemComponent extends HTMLListItemComponent {
  name = "Page Item"
  nodes = [n => $(n).hasClass("page-item")]
  html = dom.li({ class: "page-item" },
    dom.a({ class: "page-link", href: "#" }, "1")
  )

  get properties() {
    return [
      new Property("Target",
        new LinkInput({ key: "href", htmlAttr: "href" }), { child: ".page-link" }
      ),
      new Property("Active",
        new ToggleInput({
          key: "active", htmlAttr: "class",
          on: "active", off: ""
        })
      ),
      new Property("Disabled",
        new ToggleInput({
          key: "disabled", htmlAttr: "class",
          on: "disabled", off: ""
        })
      )
    ]
  }
}

class BsProgressComponent extends Component {
  name = "Progress Bar"
  nodes = [n => $(n).hasClass("progress")]
  image = "icons/progress.svg"
  html = dom.div({ class: "progress" }, dom.div({ class: "progress-bar w-25" }))

  get properties() {
    return [
      new Property("Background",
        new SelectInput({ key: "background", htmlAttr: "class", options: bgcolorSelectOptions })
      ),
      new Property("Progress",
        new SelectInput({
          key: "process", htmlAttr: "class",
          options: [
            {
              value: "",
              text: "None",
            },
            {
              value: "w-25",
              text: "25%",
            },
            {
              value: "w-50",
              text: "50%",
            },
            {
              value: "w-75",
              text: "75%",
            },
            {
              value: "w-100",
              text: "100%",
            },
          ]
        }),
        { child: ".progress-bar" }
      ),
      new Property("Striped",
        new ToggleInput({
          key: "striped", htmlAttr: "class",
          on: "progress-bar-striped", off: ""
        }), { child: ".progress-bar" }
      ),
      new Property("Animated",
        new ToggleInput({
          key: "animated", htmlAttr: "class",
          on: "progress-bar-animated", off: ""
        }), { child: ".progress-bar" }
      )
    ]
  }
}

class BsNavbarComponent extends Component {
  name = "Navbar"
  nodes = [n => $(n).hasClass("navbar")]
  image = "icons/navbar.svg"
  html = dom.nav({ class: "navbar navbar-expand-lg bg-body-secondary" },
    dom.div({ class: "container-fluid" },
      dom.a({ class: "navbar-brand", href: "#" }, "Navbar"),
      dom.button({
        class: "navbar-toggler", type: "button",
        'data-bs-toggle': "collapse", 'data-bs-target': "#navbarTogglerDemo02",
        'aria-controls': "navbarTogglerDemo02", 'aria-expanded': "false",
        'aria-label': "Toggle navigation"
      }, dom.span({ class: "navbar-toggler-icon" })),

      dom.div({ class: "collapse navbar-collapse", id: "navbarTogglerDemo02" },
        dom.ul({ class: "navbar me-auto mb-2 mb-lg-0" },
          dom.li({ class: "nav-item" }, dom.a({ class: "nav-link active", href: "#" }, "Home")),
          dom.li({ class: "nav-item" }, dom.a({ class: "nav-link", href: "#" }, "Link")),
          dom.li({ class: "nav-item" }, dom.a({ class: "nav-link disabled", href: "#" }, "Disabled"))
        ),
        dom.form({ class: "d-flex", role: "search" },
          dom.input({ class: "form-control me-2", type: "search", placeholder: "Search", 'aria-label': "Search" }),
          dom.button({ class: "btn btn-outline-success", type: "submit" }, "Search")
        )
      )
    )
  )

  get properties() {
    return [
      new Property("Theme",
        new SelectInput({
          key: "color", htmlAttr: "class",
          options: [
            {
              value: "",
              text: "Default",
            },
            {
              value: "navbar-light",
              text: "Light",
            },
            {
              value: "navbar-dark",
              text: "Dark",
            },
          ]
        })
      ),
      new Property("Color",
        new SelectInput({
          key: "background", htmlAttr: "class",
          options: bgcolorSelectOptions
        })
      ),
      new Property("Placement",
        new SelectInput({
          key: "placement", htmlAttr: "class",
          options: [
            {
              value: "",
              text: "Default",
            },
            {
              value: "fixed-top",
              text: "Fixed Top",
            },
            {
              value: "fixed-bottom",
              text: "Fixed Bottom",
            },
            {
              value: "sticky-top",
              text: "Sticky top",
            },
          ]
        })
      )
    ]
  }
}

class BsGridColumnComponent extends Component {
  name = "Grid Column"
  classesRegex = ["col"]
  image = "icons/grid_row.svg"
  html = dom.div({ class: "col" }, "Column")

  get properties() {
    return [
      new Property("Column",
        new GridInput({
          key: "column", hide_remove: true
        }),
        {col: 12, inline: false, beforeInit(node) {
          let _class = $(node).attr("class");
          let reg = /col-([^-\$ ]*)?-?(\d+)/g;
          let match;
          while ((match = reg.exec(_class)) != null) {
            this.input.data["col" + (match[1] != undefined ? "_" + match[1] : "")] =
              match[2];
          }
        },
        onChange(node, value, input) {
          let _class = node.attr("class");
          //remove previous breakpoint column size
          _class = _class.replace(new RegExp(input.name + "-\\d+?"), "");
          //add new column size
          if (value) _class += " " + input.name + "-" + value;
          node.attr("class", _class.replace(new RegExp("  ", 'g'), ""));
          return node;
        }}
      )
    ]
  }
}

class BsGridRowComponent extends Component {
  name = "Row"
  nodes = [n => $(n).hasClass("row")]
  image = "icons/grid_row.svg"
  html = dom.div({ class: "row" },
    dom.div({ class: "col-sm" }, "Column 1"),
    dom.div({ class: "col-sm" }, "Column 2"),
    dom.div({ class: "col-sm" }, "Column 3"),
  )

  constructor() {
    super();
    this._properties = [
      new Property("Column",
        new GridInput({ key: "column1" })
      ),
      new Property("Column",
        new GridInput({ key: "column2" })
      ),
      new Property("",
        new ButtonInput({
          key: "addChild", text: "Add Column", icon: "la la-plus"
        }),
        {onChange(node) {
          $(node).append('<div class="col">Col</div>');
          //render component properties again to include the new column inputs
          this.builder.Components.render("html/gridrow");
          return node;
        }}
      )
    ]
  }

  beforeInit(node) {
    let self = this;
    let properties = [...super.properties];
    let i = 0;
    let j = 0;
    // window.node = node

    $(node)
      .find('[class*="col"]')
      .each(function () {
        let elem = this;
        let _class = $(this).attr("class");

        let reg = /col([^-\$ ]*)?-?(\d+)/g;
        let match;
        let data = {};

        while ((match = reg.exec(_class)) != null) {
          data["col" + (match[1] != undefined ? "_" + match[1] : "")] =
            match[2];
        }

        i++;
        let prop = new Property("Column " + i,
          new GridInput({
            key: "column " + i, ...data
          }), { col: 12, inline: false,
            onChange(node, value, input) {
              //column = $('[class*="col-"]:eq(' + this.index + ')', node);
              let column = $(elem);
              //if remove button is clicked remove column and render row properties
              if (input.nodeName == "BUTTON") {
                column.remove();
                self.builder.Components.render("html/gridrow");
                return node;
              }
              //if select input then change column class
              _class = column.attr("class");
              //remove previous breakpoint column size
              _class = _class.replace(new RegExp(input.name + "-\\d+?"), "");
              //add new column size
              if (value) _class += " " + input.name + "-" + value;
              column.attr("class", _class.trim());

              return node;
            }
          }
        )
        properties.push(prop);
      });

    //remove all column properties
    this.properties = this.properties.filter(function (item) {
      return item.input.data.key.indexOf("column") === -1;
    });

    //add remaining properties to generated column properties
    properties.push(this.properties[0]);

    this.properties = properties;
    return node;
  }

  get properties() {return this._properties}
  set properties(value) {this._properties = value}
}

class BsFlexComponent extends Component {
  name = "Row"
  nodes = [n => $(n).hasClass("d-flex")]
  image = "icons/flex.svg"
  html = dom.div({ class: "d-flex" },
    dom.div({ class: "col-sm" }, "Column 1"),
    dom.div({ class: "col-sm" }, "Column 2"),
    dom.div({ class: "col-sm" }, "Column 3"),
  )
}

class Bootstrap5Components extends ComponentGroup {
  name = "Bootstrap 5"
  prefix = "html"

  container = new BsContainerComponent;
  button = new BsButtonComponent;
  button_group = new BsButtonGroupComponent;
  button_toolbar = new BsButtonToolbarCOmponent;
  alert = new BsAlertComponent;
  badge = new BsBadgeComponent;
  card = new BsCardComponent;
  list_group = new BsListGroupComponent;
  list_item = new BsListItemComponent;
  breadcrumb = new BsBreadcrumbComponent;
  breadcrumb_item = new BsBreadcrumbItemComponent;
  pagination = new BsProgressComponent;
  pagination_item = new BsPaginationItemComponent;
  navbar = new BsNavbarComponent;
  grid_row = new BsGridRowComponent;
  grid_column = new BsGridColumnComponent;
  flex = new BsFlexComponent;
}

class Bootstrap5ColorInput extends ColorInput {
    events = [
        ["change", "onChange", "input"],
	]

	setValue(value) {
		var color = this.rgb2hex(value);
		$('input', this.element).val();
		$('i', this.element).css('background-color', value);
	}
	
	init(data) {
		var colorinput = this.render("bootstrap-color-picker-input", data);
		var colorpicker = $('.input-group', colorinput).colorpicker();
		return colorinput;
	}
 }

class Bootstrap5Sections extends SectionGroup {
  initialize() {
    let Vvveb = this.builder;

    Vvveb.SectionsGroup["Bootstrap"] = [
      "bootstrap4/signin-split",
      "bootstrap4/image-gallery",
      "bootstrap4/video-header",
      "bootstrap4/slider-header",
      "bootstrap4/about-team",
      "bootstrap4/portfolio-one-column",
      "bootstrap4/portfolio-two-column",
      "bootstrap4/portfolio-three-column",
      "bootstrap4/portfolio-four-column",
    ];

    Vvveb.Sections.add("bootstrap4/signin-split", {
      name: "Modern Sign In Page with Split Screen Format",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/product.png">',
      image:
        "https://assets.startbootstrap.com/img/screenshots/snippets/sign-in-split.jpg",
      html: `
<section data-name="sigin-split">    
<div class="container-fluid">
  <div class="row no-gutter">
    <div class="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
    <div class="col-md-8 col-lg-6">
      <div class="login d-flex align-items-center py-5">
        <div class="container">
          <div class="row">
            <div class="col-md-9 col-lg-8 mx-auto">
              <h3 class="login-heading mb-4">Welcome back!</h3>
              <form>
                <div class="form-label-group">
                  <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
                  <label for="inputEmail">Email address</label>
                </div>

                <div class="form-label-group">
                  <input type="password" id="inputPassword" class="form-control" placeholder="Password" required>
                  <label for="inputPassword">Password</label>
                </div>

                <div class="mb-3">
                  <input type="checkbox" class="form-check-input" id="customCheck1">
                  <label class="custom-control-label" for="customCheck1">Remember password</label>
                </div>
                <button class="btn btn-lg btn-primary btn-section btn-login text-uppercase font-weight-bold mb-2" type="submit">Sign in</button>
                <div class="text-center">
                  <a class="small" href="#">Forgot password?</a></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
<style>
.login,
.image {
  min-height: 100vh;
}

.bg-image {
  background-image: url('https://source.unsplash.com/WEQbe2jBg40/600x1200');
  background-size: cover;
  background-position: center;
}

.login-heading {
  font-weight: 300;
}

.btn-login {
  font-size: 0.9rem;
  letter-spacing: 0.05rem;
  padding: 0.75rem 1rem;
  border-radius: 2rem;
}

.form-label-group {
  position: relative;
  margin-bottom: 1rem;
}

.form-label-group>input,
.form-label-group>label {
  padding: 1rem 1rem;
  height: auto;
  border-radius: 2rem;
}

.form-label-group>label {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  margin-bottom: 0;
  line-height: 1.5;
  color: #495057;
  cursor: text;
  /* Match the input under the label */
  border: 1px solid transparent;
  border-radius: .25rem;
  transition: all .1s ease-in-out;
}

.form-label-group input::-webkit-input-placeholder {
  color: transparent;
}

.form-label-group input:-ms-input-placeholder {
  color: transparent;
}

.form-label-group input::-ms-input-placeholder {
  color: transparent;
}

.form-label-group input::-moz-placeholder {
  color: transparent;
}

.form-label-group input::placeholder {
  color: transparent;
}

.form-label-group input:not(:placeholder-shown) {
  padding-top: calc(var(--input-padding-y) + var(--input-padding-y) * (2 / 3));
  padding-bottom: calc(var(--input-padding-y) / 3);
}

.form-label-group input:not(:placeholder-shown)~label {
  padding-top: 0.5;
  padding-bottom: 0.5;
  font-size: 12px;
  color: #777;
}
</style>  
</div>
</section>
`,
    });

    Vvveb.Sections.add("bootstrap4/image-gallery", {
      name: "Image gallery",
      image:
        "https://assets.startbootstrap.com/img/screenshots/snippets/thumbnail-gallery.jpg",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/product.png">',
      html: `
<section data-name="image-gallery">    
<div class="container">

  <h1 class="font-weight-light text-center text-lg-left">Thumbnail Gallery</h1>

  <hr class="mt-2 mb-5">

  <div class="row text-center text-lg-left">

    <div class="col-lg-3 col-md-4 col-6">
      <a href="#" class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="https://source.unsplash.com/pWkk7iiCoDM/400x300" alt="">
          </a>
    </div>
    <div class="col-lg-3 col-md-4 col-6">
      <a href="#" class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="https://source.unsplash.com/aob0ukAYfuI/400x300" alt="">
          </a>
    </div>
    <div class="col-lg-3 col-md-4 col-6">
      <a href="#" class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="https://source.unsplash.com/EUfxH-pze7s/400x300" alt="">
          </a>
    </div>
    <div class="col-lg-3 col-md-4 col-6">
      <a href="#" class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="https://source.unsplash.com/M185_qYH8vg/400x300" alt="">
          </a>
    </div>
    <div class="col-lg-3 col-md-4 col-6">
      <a href="#" class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="https://source.unsplash.com/sesveuG_rNo/400x300" alt="">
          </a>
    </div>
    <div class="col-lg-3 col-md-4 col-6">
      <a href="#" class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="https://source.unsplash.com/AvhMzHwiE_0/400x300" alt="">
          </a>
    </div>
    <div class="col-lg-3 col-md-4 col-6">
      <a href="#" class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="https://source.unsplash.com/2gYsZUmockw/400x300" alt="">
          </a>
    </div>
    <div class="col-lg-3 col-md-4 col-6">
      <a href="#" class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="https://source.unsplash.com/EMSDtjVHdQ8/400x300" alt="">
          </a>
    </div>
    <div class="col-lg-3 col-md-4 col-6">
      <a href="#" class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="https://source.unsplash.com/8mUEy0ABdNE/400x300" alt="">
          </a>
    </div>
    <div class="col-lg-3 col-md-4 col-6">
      <a href="#" class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="https://source.unsplash.com/G9Rfc1qccH4/400x300" alt="">
          </a>
    </div>
    <div class="col-lg-3 col-md-4 col-6">
      <a href="#" class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="https://source.unsplash.com/aJeH0KcFkuc/400x300" alt="">
          </a>
    </div>
    <div class="col-lg-3 col-md-4 col-6">
      <a href="#" class="d-block mb-4 h-100">
            <img class="img-fluid img-thumbnail" src="https://source.unsplash.com/p2TQ-3Bh3Oo/400x300" alt="">
          </a>
    </div>
  </div>

</div>
</section>
`,
    });

    Vvveb.Sections.add("bootstrap4/slider-header", {
      name: "Image Slider Header",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/product.png">',
      image:
        "https://assets.startbootstrap.com/img/screenshots/snippets/full-slider.jpg",
      html: `
<header class="slider" data-name="slider">
  <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
    <ol class="carousel-indicators">
      <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
      <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
      <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
    </ol>
    <div class="carousel-inner" role="listbox">
      <!-- Slide One - Set the background image for this slide in the line below -->
      <div class="carousel-item active" style="background-image: url('https://source.unsplash.com/LAaSoL0LrYs/1920x1080')">
        <div class="carousel-caption d-none d-md-block">
          <h2 class="display-4">First Slide</h2>
          <p class="lead">This is a description for the first slide.</p>
        </div>
      </div>
      <!-- Slide Two - Set the background image for this slide in the line below -->
      <div class="carousel-item" style="background-image: url('https://source.unsplash.com/bF2vsubyHcQ/1920x1080')">
        <div class="carousel-caption d-none d-md-block">
          <h2 class="display-4">Second Slide</h2>
          <p class="lead">This is a description for the second slide.</p>
        </div>
      </div>
      <!-- Slide Three - Set the background image for this slide in the line below -->
      <div class="carousel-item" style="background-image: url('https://source.unsplash.com/szFUQoyvrxM/1920x1080')">
        <div class="carousel-caption d-none d-md-block">
          <h2 class="display-4">Third Slide</h2>
          <p class="lead">This is a description for the third slide.</p>
        </div>
      </div>
    </div>
    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
  </div>
    
<style>
.carousel-item {
  height: 100vh;
  min-height: 350px;
  background: no-repeat center center scroll;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
</style>  
</header>
`,
    });

    Vvveb.Sections.add("bootstrap4/video-header", {
      name: "Video Header",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/image.svg">',
      image:
        "https://assets.startbootstrap.com/img/screenshots/snippets/video-header.jpg",
      html: `
<header class="video" data-name="header-video">
  <div class="overlay"></div>
  <video playsinline="playsinline" autoplay="autoplay" muted="muted" loop="loop">
    <source src="https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4" type="video/mp4">
  </video>
  <div class="container h-100">
    <div class="d-flex h-100 text-center align-items-center">
      <div class="w-100 text-white">
        <h1 class="display-3">Video Header</h1>
        <p class="lead mb-0">With HTML5 Video and Bootstrap 4</p>
      </div>
    </div>
  </div>


<div class="my-5">
  <div class="container">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <p>The HTML5 video element uses an mp4 video as a source. Change the source video to add in your own background! The header text is vertically centered using flex utilities that are build into Bootstrap 4.</p>
      </div>
    </div>
  </div>
</div>
<style>
header.video {
  position: relative;
  background-color: black;
  height: 75vh;
  min-height: 25rem;
  width: 100%;
  overflow: hidden;
}

header.video video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: 0;
  -ms-transform: translateX(-50%) translateY(-50%);
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
}

header.video .container {
  position: relative;
  z-index: 2;
}

header.video .overlay {
  /*position: absolute;*/
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: black;
  opacity: 0.5;
  z-index: 1;
}

@media (pointer: coarse) and (hover: none) {
  header {
    background: url('https://source.unsplash.com/XT5OInaElMw/1600x900') black no-repeat center center scroll;
  }
  header video {
    display: none;
  }
}
</style>
</header>
`,
    });

    Vvveb.Sections.add("bootstrap4/about-team", {
      name: "About and Team Section",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/image.svg">',
      image:
        "https://assets.startbootstrap.com/img/screenshots/snippets/about-team.jpg",
      html: `
<section data-name="about-team">    
<header class="bg-primary text-center py-5 mb-4">
  <div class="container">
    <h1 class="font-weight-light text-white">Meet the Team</h1>
  </div>
</header>

<div class="container">
  <div class="row">
    <!-- Team Member 1 -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-0 shadow">
        <img src="https://source.unsplash.com/TMgQMXoglsM/500x350" class="card-img-top" alt="...">
        <div class="card-body text-center">
          <h5 class="card-title mb-0">Team Member</h5>
          <div class="card-text text-black-50">Web Developer</div>
        </div>
      </div>
    </div>
    <!-- Team Member 2 -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-0 shadow">
        <img src="https://source.unsplash.com/9UVmlIb0wJU/500x350" class="card-img-top" alt="...">
        <div class="card-body text-center">
          <h5 class="card-title mb-0">Team Member</h5>
          <div class="card-text text-black-50">Web Developer</div>
        </div>
      </div>
    </div>
    <!-- Team Member 3 -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-0 shadow">
        <img src="https://source.unsplash.com/sNut2MqSmds/500x350" class="card-img-top" alt="...">
        <div class="card-body text-center">
          <h5 class="card-title mb-0">Team Member</h5>
          <div class="card-text text-black-50">Web Developer</div>
        </div>
      </div>
    </div>
    <!-- Team Member 4 -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-0 shadow">
        <img src="https://source.unsplash.com/ZI6p3i9SbVU/500x350" class="card-img-top" alt="...">
        <div class="card-body text-center">
          <h5 class="card-title mb-0">Team Member</h5>
          <div class="card-text text-black-50">Web Developer</div>
        </div>
      </div>
    </div>
  </div>
  <!-- /.row -->

</div>
</section>
`,
    });

    Vvveb.Sections.add("bootstrap4/portfolio-one-column", {
      name: "One Column Portfolio Layout",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/image.svg">',
      image:
        "https://assets.startbootstrap.com/img/screenshots/snippets/portfolio-one-column.jpg",
      html: `
<section data-name="portfolion-one-column">    
    <div class="container">

      <!-- Page Heading -->
      <h1 class="my-4">Page Heading
        <small>Secondary Text</small>
      </h1>

      <!-- Project One -->
      <div class="row">
        <div class="col-md-7">
          <a href="#">
            <img class="img-fluid rounded mb-3 mb-md-0" src="http://placehold.it/700x300" alt="">
          </a>
        </div>
        <div class="col-md-5">
          <h3>Project One</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium veniam exercitationem expedita laborum at voluptate. Labore, voluptates totam at aut nemo deserunt rem magni pariatur quos perspiciatis atque eveniet unde.</p>
          <a class="btn btn-primary" href="#">View Project</a>
        </div>
      </div>
      <!-- /.row -->

      <hr>

      <!-- Project Two -->
      <div class="row">
        <div class="col-md-7">
          <a href="#">
            <img class="img-fluid rounded mb-3 mb-md-0" src="http://placehold.it/700x300" alt="">
          </a>
        </div>
        <div class="col-md-5">
          <h3>Project Two</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut, odit velit cumque vero doloremque repellendus distinctio maiores rem expedita a nam vitae modi quidem similique ducimus! Velit, esse totam tempore.</p>
          <a class="btn btn-primary" href="#">View Project</a>
        </div>
      </div>
      <!-- /.row -->

      <hr>

      <!-- Project Three -->
      <div class="row">
        <div class="col-md-7">
          <a href="#">
            <img class="img-fluid rounded mb-3 mb-md-0" src="http://placehold.it/700x300" alt="">
          </a>
        </div>
        <div class="col-md-5">
          <h3>Project Three</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis, temporibus, dolores, at, praesentium ut unde repudiandae voluptatum sit ab debitis suscipit fugiat natus velit excepturi amet commodi deleniti alias possimus!</p>
          <a class="btn btn-primary" href="#">View Project</a>
        </div>
      </div>
      <!-- /.row -->

      <hr>

      <!-- Project Four -->
      <div class="row">

        <div class="col-md-7">
          <a href="#">
            <img class="img-fluid rounded mb-3 mb-md-0" src="http://placehold.it/700x300" alt="">
          </a>
        </div>
        <div class="col-md-5">
          <h3>Project Four</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo, quidem, consectetur, officia rem officiis illum aliquam perspiciatis aspernatur quod modi hic nemo qui soluta aut eius fugit quam in suscipit?</p>
          <a class="btn btn-primary" href="#">View Project</a>
        </div>
      </div>
      <!-- /.row -->

      <hr>

      <!-- Pagination -->
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">1</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">2</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">3</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>

    </div>
</section>    
`,
    });

    Vvveb.Sections.add("bootstrap4/portfolio-two-column", {
      name: "Two Column Portfolio Layout",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/image.svg">',
      image:
        "https://assets.startbootstrap.com/img/screenshots/snippets/portfolio-one-column.jpg",
      html: `
<section data-name="portfolio-two-column">    
<div class="container">

  <!-- Page Heading -->
  <h1 class="my-4">Page Heading
    <small>Secondary Text</small>
  </h1>

  <div class="row">
    <div class="col-lg-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project One</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Two</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit aliquam aperiam nulla perferendis dolor nobis numquam, rem expedita, aliquid optio, alias illum eaque. Non magni, voluptates quae, necessitatibus unde temporibus.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Three</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Four</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit aliquam aperiam nulla perferendis dolor nobis numquam, rem expedita, aliquid optio, alias illum eaque. Non magni, voluptates quae, necessitatibus unde temporibus.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Five</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Six</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit aliquam aperiam nulla perferendis dolor nobis numquam, rem expedita, aliquid optio, alias illum eaque. Non magni, voluptates quae, necessitatibus unde temporibus.</p>
        </div>
      </div>
    </div>
  </div>
  <!-- /.row -->

  <!-- Pagination -->
  <ul class="pagination justify-content-center">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">1</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">2</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">3</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
    </li>
  </ul>

</div>
</section>
`,
    });

    Vvveb.Sections.add("bootstrap4/portfolio-three-column", {
      name: "Three Column Portfolio Layout",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/image.svg">',
      image:
        "https://assets.startbootstrap.com/img/screenshots/snippets/portfolio-three-column.jpg",
      html: `
<section data-name="portfolio-three-column">    
<div class="container">

  <!-- Page Heading -->
  <h1 class="my-4">Page Heading
    <small>Secondary Text</small>
  </h1>

  <div class="row">
    <div class="col-lg-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project One</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur eum quasi sapiente nesciunt? Voluptatibus sit, repellat sequi itaque deserunt, dolores in, nesciunt, illum tempora ex quae? Nihil, dolorem!</p>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Two</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Three</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos quisquam, error quod sed cumque, odio distinctio velit nostrum temporibus necessitatibus et facere atque iure perspiciatis mollitia recusandae vero vel quam!</p>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Four</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Five</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Six</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque earum nostrum suscipit ducimus nihil provident, perferendis rem illo, voluptate atque, sit eius in voluptates, nemo repellat fugiat excepturi! Nemo, esse.</p>
        </div>
      </div>
    </div>
  </div>
  <!-- /.row -->

  <!-- Pagination -->
  <ul class="pagination justify-content-center">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">1</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">2</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">3</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
    </li>
  </ul>

</div>
</section>`,
    });

    Vvveb.Sections.add("bootstrap4/portfolio-four-column", {
      name: "Four Column Portfolio Layout",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/image.svg">',
      image:
        "https://assets.startbootstrap.com/img/screenshots/snippets/portfolio-four-column.jpg",
      html: `
<section data-name="portfolio-four-column">
<div class="container">

  <!-- Page Heading -->
  <h1 class="my-4">Page Heading
    <small>Secondary Text</small>
  </h1>

  <div class="row">
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project One</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet numquam aspernatur eum quasi sapiente nesciunt? Voluptatibus sit, repellat sequi itaque deserunt, dolores in, nesciunt, illum tempora ex quae? Nihil, dolorem!</p>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Two</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Three</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos quisquam, error quod sed cumque, odio distinctio velit nostrum temporibus necessitatibus et facere atque iure perspiciatis mollitia recusandae vero vel quam!</p>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Four</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Five</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Six</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque earum nostrum suscipit ducimus nihil provident, perferendis rem illo, voluptate atque, sit eius in voluptates, nemo repellat fugiat excepturi! Nemo, esse.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Seven</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="http://placehold.it/700x400" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a href="#">Project Eight</a>
          </h4>
          <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius adipisci dicta dignissimos neque animi ea, veritatis, provident hic consequatur ut esse! Commodi ea consequatur accusantium, beatae qui deserunt tenetur ipsa.</p>
        </div>
      </div>
    </div>
  </div>
  <!-- /.row -->

  <!-- Pagination -->
  <ul class="pagination justify-content-center">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">1</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">2</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#">3</a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
    </li>
  </ul>

</div>
<section>
`,
    });
  }
}

class Bootstrap5Blocks extends BlocksGroup {
  initialize() {
    let Vvveb = this.builder;

    Vvveb.BlocksGroup["Bootstrap"] = [
      "bootstrap4/product-card",
      "bootstrap4/user-online",
      "bootstrap4/our-team",
      "bootstrap4/login-form",
      "bootstrap4/about-team",
      "bootstrap4/pricing-1",
      "bootstrap4/loading-circle",
      "bootstrap4/block-quote",
      "bootstrap4/subscribe-newsletter",
    ];

    Vvveb.Blocks.add("bootstrap4/product-card", {
      name: "Product Cards with Transition",
      image:
        "https://d2d3qesrx8xj6s.cloudfront.net/img/screenshots/0c3153bcb2ed97483a82b1f4ea966f8187379792.png",
      html: `
<div class="container">
	<div class="row ads">
    <!-- Category Card -->
    <div class="col-md-4">
        <div class="card rounded">
            <div class="card-image">
                <span class="card-notify-badge">Low KMS</span>
                <span class="card-notify-year">2018</span>
                <img class="img-fluid" src="https://imageonthefly.autodatadirect.com/images/?USER=eDealer&PW=edealer872&IMG=USC80HOC011A021001.jpg&width=440&height=262" alt="Alternate Text" />
            </div>
            <div class="card-image-overlay m-auto">
                <span class="card-detail-badge">Used</span>
                <span class="card-detail-badge">$28,000.00</span>
                <span class="card-detail-badge">13000 Kms</span>
            </div>
            <div class="card-body text-center">
                <div class="ad-title m-auto">
                    <h5>Honda Accord LX</h5>
                </div>
                <a class="ad-btn" href="#">View</a>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card rounded">
            <div class="card-image">
                <span class="card-notify-badge">Fully-Loaded</span>
                <span class="card-notify-year">2017</span>
                <img class="img-fluid" src="https://imageonthefly.autodatadirect.com/images/?USER=eDealer&PW=edealer872&IMG=CAC80HOC021B121001.jpg&width=440&height=262" alt="Alternate Text" />
            </div>
            <div class="card-image-overlay m-auto">
                <span class="card-detail-badge">Used</span>
                <span class="card-detail-badge">$28,000.00</span>
                <span class="card-detail-badge">13000 Kms</span>
            </div>
            <div class="card-body text-center">
                <div class="ad-title m-auto">
                    <h5>Honda CIVIC HATCHBACK LS</h5>
                </div>
                <a class="ad-btn" href="#">View</a>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <div class="card rounded">
            <div class="card-image">
                <span class="card-notify-badge">Price Reduced</span>
                <span class="card-notify-year">2018</span>
                <img class="img-fluid" src="https://imageonthefly.autodatadirect.com/images/?USER=eDealer&PW=edealer872&IMG=USC80HOC091A021001.jpg&width=440&height=262" alt="Alternate Text" />
            </div>
            <div class="card-image-overlay m-auto">
                <span class="card-detail-badge">Used</span>
                <span class="card-detail-badge">$22,000.00</span>
                <span class="card-detail-badge">8000 Kms</span>
            </div>
            <div class="card-body text-center">
                <div class="ad-title m-auto">
                    <h5>Honda Accord Hybrid LT</h5>
                </div>
                <a class="ad-btn" href="#">View</a>
            </div>
        </div>
    </div>

</div>
<style>
.ads {
    margin: 30px 0 30px 0;
   
}

.ads .card-notify-badge {
        position: absolute;
        left: -10px;
        top: -20px;
        background: #f2d900;
        text-align: center;
        border-radius: 30px 30px 30px 30px; 
        color: #000;
        padding: 5px 10px;
        font-size: 14px;

    }

.ads .card-notify-year {
        position: absolute;
        right: -10px;
        top: -20px;
        background: #ff4444;
        border-radius: 50%;
        text-align: center;
        color: #fff;      
        font-size: 14px;      
        width: 50px;
        height: 50px;    
        padding: 15px 0 0 0;
}


.ads .card-detail-badge {      
        background: #f2d900;
        text-align: center;
        border-radius: 30px 30px 30px 30px;
        color: #000;
        padding: 5px 10px;
        font-size: 14px;        
    }

   

.ads .card:hover {
            background: #fff;
            box-shadow: 12px 15px 20px 0px rgba(46,61,73,0.15);
            border-radius: 4px;
            transition: all 0.3s ease;
        }

.ads .card-image-overlay {
        font-size: 20px;
        
    }


.ads .card-image-overlay span {
            display: inline-block;              
        }


.ads .ad-btn {
        text-transform: uppercase;
        width: 150px;
        height: 40px;
        border-radius: 80px;
        font-size: 16px;
        line-height: 35px;
        text-align: center;
        border: 3px solid #e6de08;
        display: block;
        text-decoration: none;
        margin: 20px auto 1px auto;
        color: #000;
        overflow: hidden;        
        position: relative;
        background-color: #e6de08;
    }

.ads .ad-btn:hover {
            background-color: #e6de08;
            color: #1e1717;
            border: 2px solid #e6de08;
            background: transparent;
            transition: all 0.3s ease;
            box-shadow: 12px 15px 20px 0px rgba(46,61,73,0.15);
        }

.ads .ad-title h5 {
        text-transform: uppercase;
        font-size: 18px;
    }
</style>    
</div>
`,
    });

    Vvveb.Blocks.add("bootstrap4/user-online", {
      name: "User online",
      image:
        "https://d2d3qesrx8xj6s.cloudfront.net/img/screenshots/75091e3b5e6efba238457f05e6f9edd847de1bf8.jpg",
      html: `
   	<div class="container user-online-thumb">
		<div class="d-flex justify-content-center h-100">
			<div class="image_outer_container">
				<div class="green_icon"></div>
				<div class="image_inner_container">
					<img src="https://source.unsplash.com/9UVmlIb0wJU/500x500">
				</div>
			</div>
		</div>
<style>
.container.user-online-thumb{
	height: 100%;
	align-content: center;
}

.user-online-thumb .image_outer_container{
margin-top: auto;
margin-bottom: auto;
border-radius: 50%;
position: relative;
}

.user-online-thumb .image_inner_container{
border-radius: 50%;
padding: 5px;
background: #833ab4; 
background: -webkit-linear-gradient(to bottom, #fcb045, #fd1d1d, #833ab4); 
background: linear-gradient(to bottom, #fcb045, #fd1d1d, #833ab4);
}

.user-online-thumb .image_inner_container img{
height: 200px;
width: 200px;
border-radius: 50%;
border: 5px solid white;
}

.user-online-thumb .image_outer_container .green_icon{
 background-color: #4cd137;
 position: absolute;
 right: 30px;
 bottom: 10px;
 height: 30px;
 width: 30px;
 border:5px solid white;
 border-radius: 50%;
}
</style>	
</div>
`,
    });

    Vvveb.Blocks.add("bootstrap4/our-team", {
      name: "Our team",
      image:
        "https://d2d3qesrx8xj6s.cloudfront.net/img/screenshots/b43c39513963d870d399a0aab2438af225f9f485.jpg",
      html: `
<div class="team pb-5">
    <div class="container">
        <h5 class="div-title h1">OUR TEAM</h5>
        <div class="row">
            <!-- Team member -->
            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="image-flip" >
                    <div class="mainflip flip-0">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <p><img class=" img-fluid" src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_01.png" alt="card image"></p>
                                    <h4 class="card-title">Sunlimetech</h4>
                                    <p class="card-text">This is basic card with image on top, title, description and button.</p>
                                    <a href="https://www.fiverr.com/share/qb8D02" class="btn btn-primary btn-sm"><i class="fa fa-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="backside">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title">Sunlimetech</h4>
                                    <p class="card-text">This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button.</p>
                                    <ul class="list-inline">
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-facebook"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-twitter"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-skype"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-google"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ./Team member -->
            <!-- Team member -->
            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                    <div class="mainflip">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <p><img class=" img-fluid" src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_02.png" alt="card image"></p>
                                    <h4 class="card-title">Sunlimetech</h4>
                                    <p class="card-text">This is basic card with image on top, title, description and button.</p>
                                    <a href="https://www.fiverr.com/share/qb8D02" class="btn btn-primary btn-sm"><i class="fa fa-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="backside">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title">Sunlimetech</h4>
                                    <p class="card-text">This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button.</p>
                                    <ul class="list-inline">
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-facebook"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-twitter"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-skype"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-google"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ./Team member -->
            <!-- Team member -->
            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                    <div class="mainflip">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <p><img class=" img-fluid" src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_03.png" alt="card image"></p>
                                    <h4 class="card-title">Sunlimetech</h4>
                                    <p class="card-text">This is basic card with image on top, title, description and button.</p>
                                    <a href="https://www.fiverr.com/share/qb8D02" class="btn btn-primary btn-sm"><i class="fa fa-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="backside">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title">Sunlimetech</h4>
                                    <p class="card-text">This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button.</p>
                                    <ul class="list-inline">
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-facebook"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-twitter"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-skype"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-google"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ./Team member -->
            <!-- Team member -->
            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                    <div class="mainflip">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <p><img class=" img-fluid" src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_04.jpg" alt="card image"></p>
                                    <h4 class="card-title">Sunlimetech</h4>
                                    <p class="card-text">This is basic card with image on top, title, description and button.</p>
                                    <a href="https://www.fiverr.com/share/qb8D02" class="btn btn-primary btn-sm"><i class="fa fa-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="backside">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title">Sunlimetech</h4>
                                    <p class="card-text">This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button.</p>
                                    <ul class="list-inline">
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-facebook"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-twitter"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-skype"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-google"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ./Team member -->
            <!-- Team member -->
            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                    <div class="mainflip">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <p><img class=" img-fluid" src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_05.png" alt="card image"></p>
                                    <h4 class="card-title">Sunlimetech</h4>
                                    <p class="card-text">This is basic card with image on top, title, description and button.</p>
                                    <a href="https://www.fiverr.com/share/qb8D02" class="btn btn-primary btn-sm"><i class="fa fa-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="backside">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title">Sunlimetech</h4>
                                    <p class="card-text">This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button.</p>
                                    <ul class="list-inline">
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-facebook"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-twitter"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-skype"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-google"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ./Team member -->
            <!-- Team member -->
            <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="image-flip" ontouchstart="this.classList.toggle('hover');">
                    <div class="mainflip">
                        <div class="frontside">
                            <div class="card">
                                <div class="card-body text-center">
                                    <p><img class=" img-fluid" src="https://sunlimetech.com/portfolio/boot4menu/assets/imgs/team/img_06.jpg" alt="card image"></p>
                                    <h4 class="card-title">Sunlimetech</h4>
                                    <p class="card-text">This is basic card with image on top, title, description and button.</p>
                                    <a href="https://www.fiverr.com/share/qb8D02" class="btn btn-primary btn-sm"><i class="fa fa-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="backside">
                            <div class="card">
                                <div class="card-body text-center mt-4">
                                    <h4 class="card-title">Sunlimetech</h4>
                                    <p class="card-text">This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button.This is basic card with image on top, title, description and button.</p>
                                    <ul class="list-inline">
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-facebook"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-twitter"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-skype"></i>
                                            </a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-icon text-xs-center" target="_blank" href="https://www.fiverr.com/share/qb8D02">
                                                <i class="fa fa-google"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- ./Team member -->

        </div>
    </div>

<style>
@import url('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
.team {
    background: #eee !important;
}

.btn-primary:hover,
.btn-primary:focus {
    background-color: #108d6f;
    border-color: #108d6f;
    box-shadow: none;
    outline: none;
}

.btn-primary {
    color: #fff;
    background-color: #007b5e;
    border-color: #007b5e;
}

section {
    padding: 60px 0;
}

section .section-title {
    text-align: center;
    color: #007b5e;
    margin-bottom: 50px;
    text-transform: uppercase;
}

.team .card {
    border: none;
    background: #ffffff;
}

.image-flip:hover .backside,
.image-flip.hover .backside {
    -webkit-transform: rotateY(0deg);
    -moz-transform: rotateY(0deg);
    -o-transform: rotateY(0deg);
    -ms-transform: rotateY(0deg);
    transform: rotateY(0deg);
    border-radius: .25rem;
}

.image-flip:hover .frontside,
.image-flip.hover .frontside {
    -webkit-transform: rotateY(180deg);
    -moz-transform: rotateY(180deg);
    -o-transform: rotateY(180deg);
    transform: rotateY(180deg);
}

.mainflip {
    -webkit-transition: 1s;
    -webkit-transform-style: preserve-3d;
    -ms-transition: 1s;
    -moz-transition: 1s;
    -moz-transform: perspective(1000px);
    -moz-transform-style: preserve-3d;
    -ms-transform-style: preserve-3d;
    transition: 1s;
    transform-style: preserve-3d;
    position: relative;
}

.frontside {
    position: relative;
    -webkit-transform: rotateY(0deg);
    -ms-transform: rotateY(0deg);
    z-index: 2;
    margin-bottom: 30px;
}

.backside {
    position: absolute;
    top: 0;
    left: 0;
    background: white;
    -webkit-transform: rotateY(-180deg);
    -moz-transform: rotateY(-180deg);
    -o-transform: rotateY(-180deg);
    -ms-transform: rotateY(-180deg);
    transform: rotateY(-180deg);
    -webkit-box-shadow: 5px 7px 9px -4px rgb(158, 158, 158);
    -moz-box-shadow: 5px 7px 9px -4px rgb(158, 158, 158);
    box-shadow: 5px 7px 9px -4px rgb(158, 158, 158);
}

.frontside,
.backside {
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transition: 1s;
    -webkit-transform-style: preserve-3d;
    -moz-transition: 1s;
    -moz-transform-style: preserve-3d;
    -o-transition: 1s;
    -o-transform-style: preserve-3d;
    -ms-transition: 1s;
    -ms-transform-style: preserve-3d;
    transition: 1s;
    transform-style: preserve-3d;
}

.frontside .card,
.backside .card {
    min-height: 312px;
}

.backside .card a {
    font-size: 18px;
    color: #007b5e !important;
}

.frontside .card .card-title,
.backside .card .card-title {
    color: #007b5e !important;
}

.frontside .card .card-body img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}
</style>
</div>
`,
    });

    Vvveb.Blocks.add("bootstrap4/login-form", {
      name: "Login form",
      image:
        "https://d2d3qesrx8xj6s.cloudfront.net/img/screenshots/fd3f41be24ffb976d66edf08adc4b2453a871b19.jpeg",
      html: `
<div class="container">
    <div class="row justify-content-md-center">
    
        <div class="col-sm-6 col-md-6 col-lg-6">
            <div class="account-wall">
                <div id="my-tab-content" class="tab-content">
						<div class="tab-pane active" id="login">
               		    <img class="profile-img img-fluid rounded-circle" src="https://source.unsplash.com/9UVmlIb0wJU/200x200"
                    alt="">
               			<form class="form-signin" action="" method="">
               				<input type="text" class="form-control" placeholder="Username" required autofocus>
               				<input type="password" class="form-control" placeholder="Password" required>
               				<input type="submit" class="btn btn-lg btn-default w-100" value="Sign In" />
               			</form>
               			<div id="tabs" data-tabs="tabs">
               				<p class="text-center"><a href="#register" data-toggle="tab">Need an Account?</a></p>
               				<p class="text-center"><a href="#select" data-toggle="tab">Select Account</a></p>
              				</div>
						</div>
						<div class="tab-pane" id="register">
							<form class="form-signin" action="" method="">
								<input type="text" class="form-control" placeholder="User Name ..." required autofocus>
								<input type="email" class="form-control" placeholder="Emaill Address ..." required>
								<input type="password" class="form-control" placeholder="Password ..." required>
								<input type="submit" class="btn btn-lg btn-default w-100" value="Sign Up" />
							</form>
							<div id="tabs" data-tabs="tabs">
               			<p class="text-center"><a href="#login" data-toggle="tab">Have an Account?</a></p>
              			</div>
						</div>
						<div class="tab-pane" id="select">
							<div id="tabs" data-tabs="tabs">
								<div class="media account-select">
									<a href="#user1" data-toggle="tab">
										<div class="pull-left">		
											<img class="select-img" src="https://source.unsplash.com/9UVmlIb0wJU/500x500"
                    alt="">
										</div>	 
										<div class="media-body">
											<h4 class="select-name">User Name 1</h4>
										</div>
									</a>
								</div>
                                <hr />
								<div class="media account-select">
									<a href="#user2" data-toggle="tab">
										<div class="pull-left">		
											<img class="select-img" src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                    alt="">
										</div>	 
										<div class="media-body">
											<h4 class="select-name">User Name 2</h4>
										</div>
									</a>
								</div>
                                <hr />
               			<p class="text-center"><a href="#login" data-toggle="tab">Back to Login</a></p>
              			</div>
						</div>
						<div class="tab-pane" id="user1">
							<img class="profile-img" src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                    alt="">
							<h3 class="text-center">User Name 1</h3>
							<form class="form-signin" action="" method="">
								<input type="hidden" class="form-control" value="User Name">
								<input type="password" class="form-control" placeholder="Password" autofocus required>
								<input type="submit" class="btn btn-lg btn-default w-100" value="Sign In" />
							</form>
							<p class="text-center"><a href="#login" data-toggle="tab">Back to Login</a></p>
               		<p class="text-center"><a href="#select" data-toggle="tab">Select another Account</a></p>
						</div>
						<div class="tab-pane" id="user2">
							<img class="profile-img" src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                    alt="">
							<h3 class="text-center">User Name 2</h3>
							<form class="form-signin" action="" method="">
								<input type="hidden" class="form-control" value="User Name">
								<input type="password" class="form-control" placeholder="Password" autofocus required>
								<input type="submit" class="btn btn-lg btn-default w-100" value="Sign In" />
							</form>
							<p class="text-center"><a href="#login" data-toggle="tab">Back to Login</a></p>
               		<p class="text-center"><a href="#select" data-toggle="tab">Select another Account</a></p>
						</div>
					</div>
            </div>
        </div>
    </div>
<style>
body{
    background-color:#f5f5f5;
}
.form-signin
{
    max-width: 330px;
    padding: 15px;
    margin: 0 auto;
}
.form-signin .form-control
{
    position: relative;
    font-size: 16px;
    height: auto;
    padding: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
.form-signin .form-control:focus
{
    z-index: 2;
}
.form-signin input[type="text"]
{
    margin-bottom: -1px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
.form-signin input[type="password"]
{
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
.account-wall
{
    margin-top: 80px;
    padding: 40px 0px 20px 0px;
    background-color: #ffffff;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.16);
}
.login-title
{
    color: #555;
    font-size: 22px;
    font-weight: 400;
    display: block;
}
.profile-img
{
    width: 96px;
    height: 96px;
    margin: 0 auto 10px;
    display: block;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
}
.select-img
{
	border-radius: 50%;
    display: block;
    height: 75px;
    margin: 0 30px 10px;
    width: 75px;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
}
.select-name
{
    display: block;
    margin: 30px 10px 10px;
}

.logo-img
{
    width: 96px;
    height: 96px;
    margin: 0 auto 10px;
    display: block;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
}
</style>    
</div>
`,
    });

    Vvveb.Blocks.add("bootstrap4/about-team", {
      name: "About and Team Section",
      image:
        "https://assets.startbootstrap.com/img/screenshots/snippets/about-team.jpg",
      html: `
<div class="container">
  <div class="row">
    <!-- Team Member 1 -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-0 shadow">
        <img src="https://source.unsplash.com/TMgQMXoglsM/500x350" class="card-img-top" alt="...">
        <div class="card-body text-center">
          <h5 class="card-title mb-0">Team Member</h5>
          <div class="card-text text-black-50">Web Developer</div>
        </div>
      </div>
    </div>
    <!-- Team Member 2 -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-0 shadow">
        <img src="https://source.unsplash.com/9UVmlIb0wJU/500x350" class="card-img-top" alt="...">
        <div class="card-body text-center">
          <h5 class="card-title mb-0">Team Member</h5>
          <div class="card-text text-black-50">Web Developer</div>
        </div>
      </div>
    </div>
    <!-- Team Member 3 -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-0 shadow">
        <img src="https://source.unsplash.com/sNut2MqSmds/500x350" class="card-img-top" alt="...">
        <div class="card-body text-center">
          <h5 class="card-title mb-0">Team Member</h5>
          <div class="card-text text-black-50">Web Developer</div>
        </div>
      </div>
    </div>
    <!-- Team Member 4 -->
    <div class="col-xl-3 col-md-6 mb-4">
      <div class="card border-0 shadow">
        <img src="https://source.unsplash.com/ZI6p3i9SbVU/500x350" class="card-img-top" alt="...">
        <div class="card-body text-center">
          <h5 class="card-title mb-0">Team Member</h5>
          <div class="card-text text-black-50">Web Developer</div>
        </div>
      </div>
    </div>
  </div>
  <!-- /.row -->

</div>
`,
    });

    Vvveb.Blocks.add("bootstrap4/pricing-1", {
      name: "Pricing table",
      image:
        "https://d2d3qesrx8xj6s.cloudfront.net/img/screenshots/e92f797807bb4cd880bc3f161d9f9869854b6991.jpeg",
      html: `
<div id="plans">
  <div class="container">
	<div class="row">

		<!-- item -->
		<div class="col-md-4 text-center">
			<div class="panel panel-danger panel-pricing">
				<div class="panel-heading">
					<i class="fa fa-desktop"></i>
					<h3>Plan 1</h3>
				</div>
				<div class="panel-body text-center">
					<p><strong>$100 / Month</strong></p>
				</div>
				<ul class="list-group text-center">
					<li class="list-group-item"><i class="fa fa-check"></i> Personal use</li>
					<li class="list-group-item"><i class="fa fa-check"></i> Unlimited projects</li>
					<li class="list-group-item"><i class="fa fa-check"></i> 27/7 support</li>
				</ul>
				<div class="panel-footer">
					<a class="btn btn-lg w-100 btn-danger" href="#">BUY NOW!</a>
				</div>
			</div>
		</div>
		<!-- /item -->

		<!-- item -->
		<div class="col-md-4 text-center">
			<div class="panel panel-warning panel-pricing">
				<div class="panel-heading">
					<i class="fa fa-desktop"></i>
					<h3>Plan 2</h3>
				</div>
				<div class="panel-body text-center">
					<p><strong>$200 / Month</strong></p>
				</div>
				<ul class="list-group text-center">
					<li class="list-group-item"><i class="fa fa-check"></i> Personal use</li>
					<li class="list-group-item"><i class="fa fa-check"></i> Unlimited projects</li>
					<li class="list-group-item"><i class="fa fa-check"></i> 27/7 support</li>
				</ul>
				<div class="panel-footer">
					<a class="btn btn-lg w-100 btn-warning" href="#">BUY NOW!</a>
				</div>
			</div>
		</div>
		<!-- /item -->

		<!-- item -->
		<div class="col-md-4 text-center">
			<div class="panel panel-success panel-pricing">
				<div class="panel-heading">
					<i class="fa fa-desktop"></i>
					<h3>Plan 3</h3>
				</div>
				<div class="panel-body text-center">
					<p><strong>$300 / Month</strong></p>
				</div>
				<ul class="list-group text-center">
					<li class="list-group-item"><i class="fa fa-check"></i> Personal use</li>
					<li class="list-group-item"><i class="fa fa-check"></i> Unlimited projects</li>
					<li class="list-group-item"><i class="fa fa-check"></i> 27/7 support</li>
				</ul>
				<div class="panel-footer">
					<a class="btn btn-lg w-100 btn-success" href="#">BUY NOW!</a>
				</div>
			</div>
		</div>
		<!-- /item -->

		</div>
	</div>
<style>
@import url("http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css");

.panel-pricing {
  -moz-transition: all .3s ease;
  -o-transition: all .3s ease;
  -webkit-transition: all .3s ease;
}
.panel-pricing:hover {
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.2);
}
.panel-pricing .panel-heading {
  padding: 20px 10px;
}
.panel-pricing .panel-heading .fa {
  margin-top: 10px;
  font-size: 58px;
}
.panel-pricing .list-group-item {
  color: #777777;
  border-bottom: 1px solid rgba(250, 250, 250, 0.5);
}
.panel-pricing .list-group-item:last-child {
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
}
.panel-pricing .list-group-item:first-child {
  border-top-right-radius: 0px;
  border-top-left-radius: 0px;
}
.panel-pricing .panel-body {
  background-color: #f0f0f0;
  font-size: 40px;
  color: #777777;
  padding: 20px;
  margin: 0px;
}
</style>
</div>
`,
    });

    Vvveb.Blocks.add("bootstrap4/loading-circle", {
      name: "Loading circle",
      image:
        "https://d2d3qesrx8xj6s.cloudfront.net/img/screenshots/39f0571b9a377cb7ac9c0c11d2346b07dabe1c66.png",
      html: `
<div class="loading-circle">
  <div class="loader">
    <div class="loader">
        <div class="loader">
           <div class="loader">

           </div>
        </div>
    </div>
  </div>
<style>  

.loading-circle {
	width: 150px;
    height: 150px;	
}

.loader {
    width: calc(100% - 0px);
	height: calc(100% - 0px);
	border: 8px solid #162534;
	border-top: 8px solid #09f;
	border-radius: 50%;
	animation: rotate 5s linear infinite;
}

@keyframes rotate {
100% {transform: rotate(360deg);}
} 
</style>  
</div> 
`,
    });

    Vvveb.Blocks.add("bootstrap4/block-quote", {
      name: "Block quote",
      image:
        "https://d2d3qesrx8xj6s.cloudfront.net/img/screenshots/d9f382e143b77d5a630dd79a2a3860611a8a953c.jpg",
      html: `
<div class="container">
    <blockquote class="quote-box">
      <p class="quotation-mark">
        “
      </p>
      <p class="quote-text">
        Don't believe anything that you read on the internet, it may be fake. 
      </p>
      <hr>
      <div class="blog-post-actions">
        <p class="blog-post-bottom pull-left">
          Abraham Lincoln
        </p>
        <p class="blog-post-bottom pull-right">
          <span class="badge quote-badge">896</span>  ❤
        </p>
      </div>
    </blockquote>
<style>
blockquote{
    border-left:none
}

.quote-badge{
    background-color: rgba(0, 0, 0, 0.2);   
}

.quote-box{
    
    overflow: hidden;
    margin-top: -50px;
    padding-top: -100px;
    border-radius: 17px;
    background-color: #4ADFCC;
    margin-top: 25px;
    color:white;
    width: 325px;
    box-shadow: 2px 2px 2px 2px #E0E0E0;
    
}

.quotation-mark{
    
    margin-top: -10px;
    font-weight: bold;
    font-size:100px;
    color:white;
    font-family: "Times New Roman", Georgia, Serif;
    
}

.quote-text{
    
    font-size: 19px;
    margin-top: -65px;
}
</style>
</div>
`,
    });

    Vvveb.Blocks.add("bootstrap4/subscribe-newsletter", {
      name: "Subscribe newsletter",
      image:
        "https://d2d3qesrx8xj6s.cloudfront.net/img/screenshots/4f610196b7cb9596555c9c8c475d93ab4ef084f6.jpg",
      html: `
<div class="subscribe-area pb-50 pt-70">
<div class="container">
	<div class="row">

					<div class="col-md-4">
						<div class="subscribe-text mb-15">
							<span>JOIN OUR NEWSLETTER</span>
							<h2>subscribe newsletter</h2>
						</div>
					</div>
					<div class="col-md-8">
						<div class="subscribe-wrapper subscribe2-wrapper mb-15">
							<div class="subscribe-form">
								<form action="#">
									<input placeholder="enter your email address" type="email">
									<button>subscribe <i class="fas fa-long-arrow-alt-right"></i></button>
								</form>
							</div>
						</div>
					</div>
				</div>

</div>
<style>
.subscribe-area {
background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
}

.pb-50 {
    padding-bottom: 50px;
}
.pt-70 {
    padding-top: 70px;
}

.mb-15 {
    margin-bottom: 15px;
}

.subscribe-text span {
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 5px;
}
.subscribe-text h2 {
    color: #fff;
    font-size: 36px;
    font-weight: 300;
    margin-bottom: 0;
    margin-top: 6px;
}
.subscribe-wrapper {
    overflow: hidden;
}
.mb-15 {
    margin-bottom: 15px;
}
.subscribe-form {
}
.subscribe2-wrapper .subscribe-form input {
    background: none;
    border: 1px solid #fff;
    border-radius: 30px;
    color: #fff;
    display: inline-block;
    font-size: 15px;
    font-weight: 300;
    height: 57px;
    margin-right: 17px;
    padding-left: 35px;
    width: 70%;
    cursor: pointer;
}
 
.subscribe2-wrapper .subscribe-form button {
    background: #ffff;
    border: none;
    border-radius: 30px;
    color: #4b5d73;
    display: inline-block;
    font-size: 18px;
    font-weight: 400;
    line-height: 1;
    padding: 18px 46px;
    transition: all 0.3s ease 0s;
}
.subscribe2-wrapper .subscribe-form button i {
    font-size: 18px;
    padding-left: 5px;
}
</style>
</div>
`,
    });
  }
}

class Bootstrap5Plugin extends Plugin {
	constructor(config) {
		super();
		this.config = config || {};
	}

	initialize() {
		if ((this.config.components || true)) {
			this.builder.config.components.push(new Bootstrap5Components());
		}
		if ((this.config.sections || true)) {
			this.builder.config.sections.push(new Bootstrap5Sections());
		}
		if ((this.config.blocks || true)) {
			this.builder.config.blocks.push(new Bootstrap5Blocks());
		}
		if ((this.config.colorinput || true)) {
			window.ColorInput = BootstrapColorInput;
		}
    this.builder.once("gui.init", () => {
      this.builder.Gui.pageProperties.install(new Bootstrap5ConfigComponent())
    });
	}
}

