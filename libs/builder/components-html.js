
class HTMLDivComponent extends Component {
  name = "Div";
  image = "icons/container.svg";
  nodes = ["div"];
  html = dom.div("Nev Div");

  get properties() {
    return [...super.properties];
  }
}

class HTMLHeaderComponent extends Component {
  name = "Heading";
  image = "icons/heading.svg";
  nodes = ["h1", "h2", "h3", "h4", "h5", "h6"];
  html = dom.h1("Heading");

  get properties() {
    return [
      new Property(
        "Size",
        new SelectInput({
          key: "size",
          options: [
            {
              value: "1",
              text: "Heading 1",
            },
            {
              value: "2",
              text: "Heading 2",
            },
            {
              value: "3",
              text: "Heading 3",
            },
            {
              value: "4",
              text: "Heading 4",
            },
            {
              value: "5",
              text: "Heading 5",
            },
            {
              value: "6",
              text: "Heading 6",
            },
          ],
        }),
        {
          onChange(node, value) {
            return changeNodeName(node, "h" + value);
          },

          init(node) {
            var regex;
            regex = /H(\d)/.exec(node.nodeName);
            if (regex && regex[1]) {
              return regex[1];
            }
            return 1;
          },
        }
      ),
      ...super.properties,
    ];
  }
}

class HTMLLinkComponent extends Component {
  name = "Link";
  image = "icons/link.svg";
  nodes = ["a"];
  html = dom.a({ href: "#", rel: "noopener" }, "Link Text");

  get properties() {
    return [
      new Property(
        "Text",
        new TextInput({ key: "text", htmlAttr: "innerText" })
      ),
      new Property("Url", new LinkInput({ key: "href", htmlAttr: "href" })),
      new Property("Rel", new LinkInput({ key: "rel", htmlAttr: "rel" })),
      new Property(
        "Target",
        new SelectInput({
          key: "target",
          htmlAttr: "target",
          options: [
            {
              value: "",
              text: "",
            },
            {
              value: "_blank",
              text: "Blank",
            },
            {
              value: "_parent",
              text: "Parent",
            },
            {
              value: "_self",
              text: "Self",
            },
            {
              value: "_top",
              text: "Top",
            },
          ],
        })
      ),
      new Property(
        "Download",
        new CheckboxInput({ key: "download", htmlAttr: "download" })
      ),
      ...super.properties,
    ];
  }
}

class HTMLImageComponent extends Component {
  name = "Image";
  nodes = ["img"];
  image = "icons/image.svg";

  get html() {
    return dom.img({
      src: `${this.builder.baseUrl}icons/image.svg`,
      class: "mw-100 align-center",
    });
  }

  get properties() {
    return [
      new Property("Image", new ImageInput({ key: "src", htmlAttr: "src" })),
      new Property("Width", new TextInput({ key: "width", htmlAttr: "width" })),
      new Property(
        "Height",
        new TextInput({ key: "height", htmlAttr: "height" })
      ),
      new Property("Alt", new TextInput({ key: "alt", htmlAttr: "alt" })),
      new Property(
        "Align",
        new RadioButtonInput({
          key: "align",
          htmlAttr: "class",
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
              value: "align-left",
              //text: "Left",
              title: "text-start",
              icon: "la la-align-left",
              checked: false,
            },
            {
              value: "align-center",
              //text: "Center",
              title: "Center",
              icon: "la la-align-center",
              checked: false,
            },
            {
              value: "align-right",
              //text: "Right",
              title: "Right",
              icon: "la la-align-right",
              checked: false,
            },
          ],
        }),
        { col: 12 }
      ),
      new PropertyGroup(
        "Link",
        {
          init(node) {
            let group = $('.mb-3[data-group="link"]');
            if (node.parentNode.tagName.toLowerCase() == "a") {
              group.attr("style", "");
            } else {
              group.attr("style", "display:none !important");
            }

            return node;
          },
        },
        [
          new Property(
            "Enable",
            new CheckboxInput({ key: "enable_link", className: "form-switch" }),
            {
              setGroup(value) {
                let group = $('.mb-3[data-group="link"]');
                if (value) {
                  group.attr("style", "");
                } else {
                  group.attr("style", "display:none !important");
                }
              },
              onChange(node, value, input) {
                this.config.setGroup(value);
                if (value) {
                  $(node).wrap('<a href="#"></a>');
                } else {
                  $(node).unwrap("a");
                }
                return node;
              },
              init(node) {
                let value = node.parentNode.tagName.toLowerCase() == "a";
                this.config.setGroup(value);
                return value;
              },
            }
          ),
        ]
      ),
      ...super.properties
    ];
  }
}

class HTMLLabelComponent extends Component {
  name = "Label";
  nodes = ["label"];
  html = dom.label({ for: "" }, "Label");
}

class HTMLHrComponent extends Component {
  name = "Horizontal Rule";
  nodes = ["hr"];
  image = "icons/hr.svg";
  html = dom.hr();
}

class HTMLBrComponent extends Component {
  name = "Line Break";
  nodes = ["br"];
  image = "icons/br.svg";
  html = dom.br();
}

class HTMLInputComponent extends Component {
  name = "Input";
  nodes = ["input"];
  image = "icons/text_input.svg";
  html = dom.div(
    { class: "mb-3" },
    dom.label("Input Label"),
    dom.input({ type: "text", class: "form-control" })
  );

  get properties() {
    return [
      new Property("Name", new TextInput({ key: "name", htmlAttr: "name" })),
      new Property("Value", new TextInput({ key: "value", htmlAttr: "value" })),
      new Property(
        "Type",
        new SelectInput({
          key: "type",
          htmlAttr: "type",
          options: [
            {
              value: "text",
              text: "text",
            },
            {
              value: "button",
              text: "button",
            },
            {
              value: "checkbox",
              text: "checkbox",
            },
            {
              value: "color",
              text: "color",
            },
            {
              value: "date",
              text: "date",
            },
            {
              value: "datetime-local",
              text: "datetime-local",
            },
            {
              value: "email",
              text: "email",
            },
            {
              value: "file",
              text: "file",
            },
            {
              value: "hidden",
              text: "hidden",
            },
            {
              value: "image",
              text: "image",
            },
            {
              value: "month",
              text: "month",
            },
            {
              value: "number",
              text: "number",
            },
            {
              value: "password",
              text: "password",
            },
            {
              value: "radio",
              text: "radio",
            },
            {
              value: "range",
              text: "range",
            },
            {
              value: "reset",
              text: "reset",
            },
            {
              value: "search",
              text: "search",
            },
            {
              value: "submit",
              text: "submit",
            },
            {
              value: "tel",
              text: "tel",
            },
            {
              value: "text",
              text: "text",
            },
            {
              value: "time",
              text: "time",
            },
            {
              value: "url",
              text: "url",
            },
            {
              value: "week",
              text: "week",
            },
          ],
        })
      ),
      new Property(
        "Placeholder",
        new TextInput({ key: "placeholder", htmlAttr: "placeholder" })
      ),
      new Property(
        "Disabled",
        new CheckboxInput({ key: "disabled", htmlAttr: "disabled" })
      ),
      new Property(
        "Auto Focus",
        new CheckboxInput({ key: "autofocus", htmlAttr: "autofocus" })
      ),
      new Property(
        "Required",
        new CheckboxInput({ key: "required", htmlAttr: "required" })
      ),
      new Property(
        "Multiple",
        new CheckboxInput({ key: "multiple", htmlAttr: "multiple" })
      ),
      ...super.properties,
    ];
  }
}

class HTMLSelectInputComponent extends HTMLInputComponent {
  name = "Select Input";
  nodes = ["select"];
  image = "icons/select_input.svg";
  html = dom.div(
    { class: "mb-3" },
    dom.label("Choose an option"),
    dom.select(
      { class: "form-control" },
      dom.option("Option 1", { value: "value1" }),
      dom.option("Option 2", { value: "value2" }),
      dom.option("Option 3", { value: "value3" })
    )
  );
  get properties() {
    let builder = this.builder;
    return [
      new Property("Option", new TextValueInput({ key: "option1" })),
      new Property("Option", new TextValueInput({ key: "option2" })),
      new Property(
        "",
        new ButtonInput({
          key: "addOption",
          text: "Add Option",
          icon: "la-plus",
        }),
        {
          onChange(node) {
            $(node).append('<option value="value">Text</option>');

            //render component properties again to include the new column inputs
            this.builder.Components.render("html/selectinput");

            return node;
          },
        }
      ),
      ...super.properties,
    ];
  }

  beforeInit(node) {
    let properties = [];
    let i = 0;
    let _builder = this.builder;

    $(node)
      .find("option")
      .each(function (e) {
        data = { value: this.value, text: this.text };
        i++;

        let prop = new Property(
          "Option " + i,
          new TextValueInput({ key: "option " + i, ...data }),
          {
            optionNode: this,
            inline: true,
            onChange: function (node, value, input) {
              option = $(this.optionNode);

              //if remove button is clicked remove option and render row properties
              if (input.nodeName == "BUTTON") {
                option.remove();
                _builder.Components.render("html/selectinput");
                return node;
              }

              if (input.name == "value") option.attr("value", value);
              else if (input.name == "text") option.text(value);

              return node;
            },
          }
        );
        properties.push(prop);
      });

    //remove all option properties
    this.properties = this.properties.filter(function (item) {
      return item.input.data.key.indexOf("option") === -1;
    });

    //add remaining properties to generated column properties
    properties.push(this.properties[0]);

    this.properties = properties;
    return node;
  }
}

class HTMLTextareaComponent extends HTMLInputComponent {
  name = "Text Area";
  nodes = ["textarea"];
  image = "icons/text_area.svg";
  html = dom.div(
    { class: "mb-3" },
    dom.label("Label: "),
    dom.textarea({ class: "form-control" }, "Value")
  );

  get properties() {
    return [
      new Property("Col", new NumberInput({ key: "col", htmlAttr: "col" })),
      new Property("Row", new NumberInput({ key: "row", htmlAttr: "row" })),
      ...super.properties,
    ];
  }
}

class HTMLCheckboxComponent extends HTMLInputComponent {
  name = "Checkbox";
  nodes = [(node) => $(node).attr("type") === "checkbox"];
  // attributes = { type: "checkbox" }
  image = "icons/checkbox.svg";
  html = dom.div(
    { class: "form-check" },
    dom.label(
      { class: "form-check-label" },
      dom.input({ class: "form-check-input", type: "checkbox" }),
      "Check Me"
    )
  );

  get properties() {
    return [
      new Property(
        "Checked",
        new CheckboxInput({ key: "checked", htmlAttr: "Checked" })
      ),
      ...super.properties,
    ];
  }
}

class HTMLRadioButton extends HTMLCheckboxComponent {
  name = "Radio Button";
  nodes = [(node) => $(node).attr("type") === "radio"];
  // attributes = { type: "radio" }
  image = "icons/radio.svg";
  html = dom.div(
    { class: "form-check" },
    dom.label(
      { class: "form-check-label" },
      dom.input({ class: "form-check-input", type: "radio" }),
      "Option 1"
    ),
    dom.label(
      { class: "form-check-label" },
      dom.input({ class: "form-check-input", type: "radio" }),
      "Option 2"
    ),
    dom.label(
      { class: "form-check-label" },
      dom.input({ class: "form-check-input", type: "radio" }),
      "Option 3"
    )
  );
}

class HTMLVideoComponent extends Component {
  name = "Video";
  nodes = ["video"];
  image = "icons/video.svg";
  resizable = true;
  html = dom.video({
    width: "320",
    height: "240",
    playsinline: true,
    loop: true,
    autoplay: true,
    src: "/media/Sky Clouds Royalty Free HD Video Footage [CC0] [fmngCpy1O2E].webm",
  });

  get dragHtml() {
    return dom.img({
      width: "320",
      height: "240",
      src: `${this.builder.config.baseUrl}icons/video.svg`,
    });
  }

  get properties() {
    return [
      new Property("Src", new LinkInput({ key: "src", htmlAttr: "src" })),
      new Property("Width", new TextInput({ key: "width", htmlAttr: "width" })),
      new Property(
        "Height",
        new TextInput({ key: "height", htmlAttr: "height" })
      ),
      new Property(
        "Poster",
        new ImageInput({ key: "poster", htmlAttr: "poster" })
      ),
      new PropertyGroup("Options", [
        new Property(
          "Auto Play",
          new CheckboxInput({
            key: "autoplay",
            htmlAttr: "autoplay",
            on: "true",
            off: "false",
          }),
          { inline: true, col: 4 }
        ),
        new Property(
          "Controls",
          new CheckboxInput({
            key: "controls",
            htmlAttr: "controls",
            on: "true",
            off: "false",
          }),
          { inline: true, col: 4 }
        ),
        new Property(
          "Loop",
          new CheckboxInput({
            key: "loop",
            htmlAttr: "loop",
            on: "true",
            off: "false",
          }),
          { inline: true, col: 4 }
        ),
        new Property(
          "Play Inline",
          new CheckboxInput({
            key: "inline",
            htmlAttr: "inline",
            on: "true",
            off: "false",
          }),
          { inline: true, col: 4 }
        ),
        new Property(
          "Muted",
          new CheckboxInput({
            key: "muted",
            htmlAttr: "muted",
            on: "true",
            off: "false",
          }),
          { inline: true, col: 4 }
        ),
      ]),
      ...super.properties,
    ];
  }
}

class HTMLButtonComponent extends Component {
  name = "Button";
  nodes = ["button"];
  image = "icons/button.svg";
  html = dom.button("Button");

  get properties() {
    return [
      new Property(
        "Text",
        new TextInput({ key: "text", htmlAttr: "innerHTML" })
      ),
      new Property("Name", new TextInput({ key: "name", htmlAttr: "name" })),
      new Property(
        "Type",
        new SelectInput({
          key: "type",
          htmlAttr: "type",
          options: [
            {
              value: "button",
              text: "button",
            },
            {
              value: "reset",
              text: "reset",
            },
            {
              value: "submit",
              text: "submit",
            },
          ],
        })
      ),
      new Property(
        "AutoFocus",
        new CheckboxInput({ key: "autofocus", htmlAttr: "autofocus" }),
        { inline: true }
      ),
      new Property(
        "Disabled",
        new CheckboxInput({ key: "disabled", htmlAttr: "disabled" }),
        { inline: true }
      ),
      ...super.properties,
    ];
  }
}

class HTMLParagraphComponent extends Component {
  name = "Paragraph";
  nodes = ["p"];
  image = "icons/paragraph.svg";
  html = dom.p("Lorem ipsum dolor");

  get properties() {
    return [
      new Property(
        "Text Align",
        new RadioButtonInput({
          key: "text-align",
          htmlAttr: "class",
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
              value: "text-start",
              //text: "Left",
              title: "text-start",
              icon: "la la-align-left",
              checked: false,
            },
            {
              value: "text-center",
              //text: "Center",
              title: "Center",
              icon: "la la-align-center",
              checked: false,
            },
            {
              value: "text-end",
              //text: "Right",
              title: "Right",
              icon: "la la-align-right",
              checked: false,
            },
          ],
          validValues: ["", "text-start", "text-center", "text-end"],
        }), { col: 12 }
      ),
      ...super.properties,
    ];
  }
}

class HTMLBlockquoteComponent extends Component {
  name = "Blockquote";
  nodes = ["blockquote"];
  image = "icons/blockquote.svg";
  html = dom.blockquote(
    "Today I shall be meeting with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness all of them due to the offenders' ignorance of what is good or evil.."
  );
}

class HTMLListComponent extends Component {
  name = "List";
  nodes = ["ol", "ul"];
  image = "icons/list.svg";
  html = dom.ul(dom.li("Item 1"), dom.li("Item 2"), dom.li("Item 3"));
}

class HTMLPreformattedComponent extends Component {
  name = "Preformatted";
  nodes = ["pre"];
  image = "icons/paragraph.svg";
  html = dom.pre(
    "Today I shall be meeting with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness all of them due to the offenders' ignorance of what is good or evil.."
  );

  get properties() {
    return [
      new Property(
        "Text",
        new TextareaInput({ key: "text", htmlAttr: "innerHTML", rows: 20 })
      ),
      ...super.properties
    ];
  }
}

class HTMLFormComoponent extends Component {
  name = "Form";
  nodes = ["form"];
  image = "icons/form.svg";
  html = dom.form(
    dom.div(
      { class: "mb-3" },
      dom.label({ for: "input1", class: "form-label" }, "Label1"),
      dom.input({
        type: "text",
        name: "input1",
        class: "form-control",
        id: "example",
        placeholder: "Input1",
      }),
      dom.span({ id: "helpText1", class: "form-text" }, "Help text1")
    ),
    dom.div(
      { class: "mb-3" },
      dom.label({ for: "input2", class: "form-label" }, "Label2"),
      dom.input({
        type: "text",
        name: "input2",
        class: "form-control",
        id: "example",
        placeholder: "Input2",
      }),
      dom.span({ id: "helpText2", class: "form-text" }, "Help text2")
    ),
    dom.button({ type: "submit", class: "btn btn-primary" }, "Submit")
  );

  get properties() {
    return [
      new Property(
        "Action",
        new TextInput({ key: "action", htmlAttr: "action" })
      ),
      new Property(
        "Method",
        new SelectInput({
          key: "method",
          htmlAttr: "method",
          options: [
            { value: "get", text: "GET" },
            { value: "post", text: "POST" },
            { value: "put", text: "PUT" },
            { value: "delete", text: "DELETE" },
            { value: "patch", text: "PATCH" },
          ],
        })
      ),
      new Property(
        "Encoding Type",
        new SelectInput({
          key: "enctype",
          htmlAttr: "enctype",
          options: [
            {
              value: "",
              text: "",
            },
            {
              value: "application/x-www-form-urlencoded",
              text: "Url encoded (default)",
            },
            {
              value: "multipart/form-data",
              text: "Multipart (for file upload)",
            },
            {
              value: "text/plain",
              text: "Text plain",
            },
          ],
        })
      ),
      ...super.properties
    ];
  }
}

class HTMLTableRowComponent extends Component {
  name = "Table Row";
  nodes = ["tr"];
  html = dom.tr(dom.td("Cell 1"), dom.td("cell 2"));

  get properties() {
    return [
      new Property(
        "Type",
        new SelectInput({
          key: "type",
          htmlAttr: "class",
          validValues: ["", "success", "danger", "warning", "active"],
          options: [
            {
              value: "",
              text: "Default",
            },
            {
              value: "success",
              text: "Success",
            },
            {
              value: "error",
              text: "Error",
            },
            {
              value: "warning",
              text: "Warning",
            },
            {
              value: "active",
              text: "Active",
            },
          ],
        })
      ),
      ...super.properties
    ];
  }
}

class HTMLTableCellComponent extends Component {
  name = "Table Cell";
  nodes = ["td"];
  html = dom.td("Cell");
}

class HTMLTableHeaderCellComponent extends HTMLTableCellComponent {
  name = "Table Header Cell";
  nodes = ["th"];
  html = dom.th("Header");
}

class HTMLTableHeadComponent extends HTMLTableRowComponent {
  name = "Table Head";
  nodes = ["thead"];
  html = dom.thead(dom.tr(dom.th("Cell 1"), dom.th("cell 2")));
}

class HTMLTableBodyComponent extends Component {
  name = "Table Body";
  nodes = ["tbody"];
  html = dom.tbody(dom.tr(dom.td("Cell 1"), dom.td("cell 2")));
}

class HTMLTableComponent extends Component {
  name = "Table";
  nodes = ["table"];
  classes = ["table"];
  image = "icons/table.svg";
  html = dom.table(
    dom.thead(
      dom.tr(
        dom.th({ scope: "col" }, "#"),
        dom.th({ scope: "col" }, "First"),
        dom.th({ scope: "col" }, "Last"),
        dom.th({ scope: "col" }, "Handle")
      )
    ),
    dom.tbody(
      dom.tr(
        dom.th({ scope: "row" }, 1),
        dom.td("Mark"),
        dom.td("Otto"),
        dom.td("#mdo")
      )
    )
  );

  get properties() {
    return [
      new Property(
        "Type",
        new SelectInput({
          key: "type",
          htmlAttr: "class",
          options: [
            {
              value: "Default",
              text: "",
            },
            {
              value: "table-primary",
              text: "Primary",
            },
            {
              value: "table-secondary",
              text: "Secondary",
            },
            {
              value: "table-success",
              text: "Success",
            },
            {
              value: "table-danger",
              text: "Danger",
            },
            {
              value: "table-warning",
              text: "Warning",
            },
            {
              value: "table-info",
              text: "Info",
            },
            {
              value: "table-light",
              text: "Light",
            },
            {
              value: "table-dark",
              text: "Dark",
            },
            {
              value: "table-white",
              text: "White",
            },
          ],
        })
      ),
      new Property(
        "Small",
        new ToggleInput({
          key: "small",
          htmlAttr: "class",
          on: "table-small",
          off: "",
        })
      ),
      new Property(
        "Hover",
        new ToggleInput({
          key: "hover",
          htmlAttr: "class",
          on: "table-hover",
          off: "",
        })
      ),
      new Property(
        "Bordered",
        new ToggleInput({
          key: "bordered",
          htmlAttr: "class",
          on: "table-bordered",
          off: "",
        })
      ),
      new Property(
        "Stripped",
        new ToggleInput({
          key: "stripped",
          htmlAttr: "class",
          on: "table-stripped",
          off: "",
        })
      ),
      new Property(
        "Inverse",
        new ToggleInput({
          key: "inverse",
          htmlAttr: "class",
          on: "table-inverse",
          off: "",
        })
      ),
      new Property(
        "Head Options",
        new SelectInput({
          key: "head",
          htmlAttr: "class",
          options: [
            {
              value: "",
              text: "None",
            },
            {
              value: "thead-default",
              text: "Default",
            },
            {
              value: "thead-inverse",
              text: "Inverse",
            },
          ],
        }),
        { child: "thead" }
      ),
      ...super.properties
    ];
  }
}

class HTMLAudioComponent extends Component {
  name = "Audio";
  nodes = ["audio"];
  attributes = ["data-component-audio"];
  image = "icons/audio.svg";
  html = dom.figure(
    { "data-component-audio": true },
    dom.audio({ controls: true, src: "#" })
  );

  get properties() {
    return [
      new Property("Src", new LinkInput({ key: "src", htmlAttr: "src" })),
      new PropertyGroup("Options", [
        new Property(
          "Auto Play",
          new CheckboxInput({ key: "autoplay", htmlAttr: "autoplay" }),
          { child: "audio", inline: true, col: 4 }
        ),
        new Property(
          "Loop",
          new CheckboxInput({ key: "loop", htmlAttr: "loop" }),
          { inline: true, child: "audio", col: 4 }
        ),
      ]),
      ...super.properties
    ];
  }
}

class HTMLBodyComponent extends Component {
  name = "Body";
  nodes = ["body"];
  image = "icons/container.svg";
  html = dom.body();

  // get properties() {
  //   return [
  //     ...super.properties,
  //   ];
  // }
}

class HTMLHtmlComponent extends Component {
  name = "HTML";
  nodes = ["html"];
  image = "icons/posts.svg";
  html = dom.html(dom.body());

  get properties() {
    return [
      new Property(
        "Title",
        new TextInput({ key: "title", htmlAttr: "innerHTML" }),
        { child: "title" }
      ),
      new PropertyGroup("Meta", [
        new Property(
          "Description",
          new TextInput({ key: "description", htmlAttr: "content" }),
          { child: "meta[name=description]" }
        ),
        new Property(
          "Keywords",
          new TextInput({ key: "keywords", htmlAttr: "content" }),
          { child: "meta[name=keywords]" }
        ),
      ]),
      ...super.properties
    ];
  }
}

class HTMLComponents extends ComponentGroup {
  prefix = "html";
  name = "Base";

  body = new HTMLBodyComponent();

  div = new HTMLDivComponent();
  heading = new HTMLHeaderComponent();
  paragraph = new HTMLParagraphComponent();
  button = new HTMLButtonComponent();
  link = new HTMLLinkComponent();
  image = new HTMLImageComponent();
  video = new HTMLVideoComponent();
  audio = new HTMLAudioComponent();
  hr = new HTMLHrComponent();
  br = new HTMLBrComponent();
  label = new HTMLLabelComponent();
  input = new HTMLInputComponent();
  select = new HTMLSelectInputComponent();
  textarea = new HTMLTextareaComponent();
  checkbox = new HTMLCheckboxComponent();
  radiobutton = new HTMLRadioButton();
  blockquote = new HTMLBlockquoteComponent();
  list = new HTMLLinkComponent();
  pre = new HTMLPreformattedComponent();
  form = new HTMLFormComoponent();
  table = new HTMLTableComponent();
  table_head = new HTMLTableHeadComponent();
  table_body = new HTMLTableBodyComponent();
  table_head_cell = new HTMLTableHeaderCellComponent();
  table_body_cell = new HTMLTableCellComponent();
  table_row = new HTMLTableRowComponent();
}
