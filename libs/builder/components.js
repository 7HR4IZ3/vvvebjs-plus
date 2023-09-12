let ATTRSMAP = {
  src: ImageInput,
};

bgcolorClasses = [
  "bg-primary",
  "bg-secondary",
  "bg-success",
  "bg-danger",
  "bg-warning",
  "bg-info",
  "bg-body-secondary",
  "bg-dark",
  "bg-white",
];

bgcolorSelectOptions = [
  {
    value: "Default",
    text: "",
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
    value: "bg-danger",
    text: "Danger",
  },
  {
    value: "bg-warning",
    text: "Warning",
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
  {
    value: "bg-white",
    text: "White",
  },
];

function changeNodeName(node, newNodeName) {
  var newNode;
  newNode = document.createElement(newNodeName);
  attributes = node.get(0).attributes;

  for (i = 0, len = attributes.length; i < len; i++) {
    newNode.setAttribute(attributes[i].nodeName, attributes[i].nodeValue);
  }

  $(newNode).append($(node).contents());
  $(node).replaceWith(newNode);

  return newNode;
}

var base_sort = 100; //start sorting for base component from 100 to allow extended properties to be first
var style_section = "style";
var advanced_section = "advanced";


class CommonComponents extends ComponentGroup {
  initialize() {
    let builder = this.builder;

    builder.Components.add("_base", {
      name: "Element",
      properties: [
        function (node) {
          let ret = [];
          for (let attr of node.attributes) {
            let inputtype = ATTRSMAP[attr.name]
            if (inputtype) {
              inputtype = new inputtype(builder);
            } else {
              inputtype = new TextInput();
            }

            ret.push({
              name: attr.name[0].toUpperCase() + attr.name.slice(1),
              key: attr.name,
              htmlAttr: attr.name,
              inputtype: inputtype,
            });
          }
          return ret;
        },
        {
          key: "element_header",
          inputtype: new SectionInput(),
          name: false,
          sort: base_sort++,
          data: { header: "General" },
        },
        {
          name: "Id",
          key: "id",
          htmlAttr: "id",
          sort: base_sort++,
          inline: false,
          col: 6,
          inputtype: new TextInput(),
        },
        {
          name: "Class",
          key: "class",
          htmlAttr: "class",
          sort: base_sort++,
          inline: false,
          col: 6,
          inputtype: new TextInput(),
        },
      ],
    });

    //display
    builder.Components.extend("_base", "_base", {
      properties: [
        {
          key: "display_header",
          inputtype: new SectionInput(),
          name: false,
          sort: base_sort++,
          section: style_section,
          data: { header: "Display" },
        },
        {
          //linked styles notice message
          name: "",
          key: "linked_styles_check",
          sort: base_sort++,
          section: style_section,
          inline: false,
          col: 12,
          inputtype: new NoticeInput({
            type: "warning",
            title: "Linked styles",
            text: 'This element shares styles with other <a class="linked-elements-hover" href="#"><b class="elements-count">4</b> elements</a>, to apply styles <b>only for this element</b> enter a <b>unique id</b> eg: <i>marketing-heading</i> in in <br/><a class="id-input" href="#content-tab" role="tab" aria-controls="components" aria-selected="false" href="#content-tab">Content > General > Id</a>.<br/><span class="text-muted small"></span>',
          }),
          afterInit: function (node, inputElement) {
            var selector = builder.StyleManager.getSelectorForElement(node);
            var elements = $(selector, window.FrameDocument);

            if (elements.length <= 1) {
              inputElement.hide();
            } else {
              $(".elements-count", inputElement).html(elements.length);
              $(".text-muted", inputElement).html(selector);

              $(".id-input", inputElement).click(function () {
                $(".content-tab a").each(function () {
                  this.click();
                });

                setTimeout(function () {
                  $("[name=id]").trigger("focus");
                }, 700);
              });

              $(".linked-elements-hover", inputElement)
                .on("mouseenter", function () {
                  elements.css("outline", "2px dotted blue");
                })
                .on("mouseleave", function () {
                  elements.css("outline", "");
                });
            }
          },
        },
        {
          name: "Display",
          key: "display",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new SelectInput(),
          validValues: ["block", "inline", "inline-block", "none"],
          data: {
            options: [
              {
                value: "block",
                text: "Block",
              },
              {
                value: "inline",
                text: "Inline",
              },
              {
                value: "inline-block",
                text: "Inline Block",
              },
              {
                value: "inline-block",
                text: "Inline Block",
              },
              {
                value: "flex",
                text: "Flex",
              },
              {
                value: "inline-flex",
                text: "Inline Flex",
              },
              {
                value: "grid",
                text: "Grid",
              },
              {
                value: "inline-grid",
                text: "Inline grid",
              },
              {
                value: "table",
                text: "Table",
              },
              {
                value: "table-row",
                text: "Table Row",
              },
              {
                value: "list-item",
                text: "List Item",
              },
              {
                value: "inherit",
                text: "Inherit",
              },
              {
                value: "initial",
                text: "Initial",
              },
              {
                value: "none",
                text: "none",
              },
            ],
          },
        },
        {
          name: "Position",
          key: "position",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new SelectInput(),
          validValues: ["static", "fixed", "relative", "absolute"],
          data: {
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
          },
        },
        {
          name: "Top",
          key: "top",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          parent: "",
          inputtype: new CssUnitInput(),
        },
        {
          name: "Left",
          key: "left",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          parent: "",
          inputtype: new CssUnitInput(),
        },
        {
          name: "Bottom",
          key: "bottom",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          parent: "",
          inputtype: new CssUnitInput(),
        },
        {
          name: "Right",
          key: "right",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          parent: "",
          inputtype: new CssUnitInput(),
        },
        {
          name: "Float",
          key: "float",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 12,
          inline: false,
          inputtype: new RadioButtonInput(),
          data: {
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
          },
        },
        {
          name: "Opacity",
          key: "opacity",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 12,
          inline: false,
          parent: "",
          inputtype: new RangeInput(),
          data: {
            max: 1, //max zoom level
            min: 0,
            step: 0.1,
          },
        },
        {
          name: "Background Color",
          key: "background-color",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: true,
          htmlAttr: "style",
          inputtype: new ColorInput(),
        },
        {
          name: "Text Color",
          key: "color",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: true,
          htmlAttr: "style",
          inputtype: new ColorInput(),
        },
      ],
    });

    //Typography
    var ComponentBaseTypography = {
      properties: [
        {
          key: "typography_header",
          inputtype: new SectionInput(),
          name: false,
          sort: base_sort++,
          section: style_section,
          data: { header: "Typography" },
        },
        {
          name: "Font size",
          key: "font-size",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Font weight",
          key: "font-weight",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new SelectInput(),
          data: {
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
          },
        },
        {
          name: "Font family",
          key: "font-family",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 12,
          inline: false,
          inputtype: new SelectInput(),
          data: {
            options: fontList,
          },
        },
        {
          name: "Text align",
          key: "text-align",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 12,
          inline: false,
          inputtype: new RadioButtonInput(),
          data: {
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
          },
        },
        {
          name: "Line height",
          key: "line-height",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Letter spacing",
          key: "letter-spacing",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Text decoration",
          key: "text-decoration-line",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 12,
          inline: false,
          inputtype: new RadioButtonInput(),
          data: {
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
          },
        },
        {
          name: "Decoration Color",
          key: "text-decoration-color",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: true,
          htmlAttr: "style",
          inputtype: new ColorInput(),
        },
        {
          name: "Decoration style",
          key: "text-decoration-style",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: true,
          inputtype: new SelectInput(),
          data: {
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
          },
        },
      ],
    };

    builder.Components.extend("_base", "_base", ComponentBaseTypography);

    //Size
    var ComponentBaseSize = {
      properties: [
        {
          key: "size_header",
          inputtype: new SectionInput(),
          name: false,
          sort: base_sort++,
          section: style_section,
          data: { header: "Size", expanded: false },
        },
        {
          name: "Width",
          key: "width",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Height",
          key: "height",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Min Width",
          key: "min-width",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Min Height",
          key: "min-height",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Max Width",
          key: "max-width",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Max Height",
          key: "max-height",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
      ],
    };

    builder.Components.extend("_base", "_base", ComponentBaseSize);

    //Margin
    var ComponentBaseMargin = {
      properties: [
        {
          key: "margins_header",
          inputtype: new SectionInput(),
          name: false,
          sort: base_sort++,
          section: style_section,
          data: { header: "Margin", expanded: false },
        },
        {
          name: "Top",
          key: "margin-top",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Right",
          key: "margin-right",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Bottom",
          key: "margin-bottom",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Left",
          key: "margin-left",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
      ],
    };

    builder.Components.extend("_base", "_base", ComponentBaseMargin);

    //Padding
    var ComponentBasePadding = {
      properties: [
        {
          key: "paddings_header",
          inputtype: new SectionInput(),
          name: false,
          sort: base_sort++,
          section: style_section,
          data: { header: "Padding", expanded: false },
        },
        {
          name: "Top",
          key: "padding-top",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Right",
          key: "padding-right",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Bottom",
          key: "padding-bottom",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Left",
          key: "padding-left",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
      ],
    };

    builder.Components.extend("_base", "_base", ComponentBasePadding);

    //Border
    builder.Components.extend("_base", "_base", {
      properties: [
        {
          key: "border_header",
          inputtype: new SectionInput(),
          name: false,
          sort: base_sort++,
          section: style_section,
          data: { header: "Border", expanded: false },
        },
        {
          name: "Style",
          key: "border-style",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 12,
          inline: false,
          inputtype: new SelectInput(),
          data: {
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
            ],
          },
        },
        {
          name: "Width",
          key: "border-width",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Color",
          key: "border-color",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          htmlAttr: "style",
          inputtype: new ColorInput(),
        },
      ],
    });

    //Border radius
    builder.Components.extend("_base", "_base", {
      properties: [
        {
          key: "border_radius_header",
          inputtype: new SectionInput(),
          name: false,
          sort: base_sort++,
          section: style_section,
          data: { header: "Border radius", expanded: false },
        },
        {
          name: "Top Left",
          key: "border-top-left-radius",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Top Right",
          key: "border-top-right-radius",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Bottom Left",
          key: "border-bottom-left-radius",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Bottom Right",
          key: "border-bottom-right-radius",
          htmlAttr: "style",
          sort: base_sort++,
          section: style_section,
          col: 6,
          inline: false,
          inputtype: new CssUnitInput(),
        },
      ],
    });

    //Background image
    builder.Components.extend("_base", "_base", {
      properties: [
        {
          key: "background_image_header",
          inputtype: new SectionInput(),
          name: false,
          sort: base_sort++,
          section: style_section,
          data: { header: "Background Image", expanded: false },
        },
        {
          name: "Image",
          key: "Image",
          sort: base_sort++,
          section: style_section,
          //htmlAttr: "style",
          inputtype: new ImageInput(),

          init: function (node) {
            var image = $(node)
              .css("background-image")
              .replace(/url\(['"]?([^"\)$]+?)['"]?\).*/, "$1");
            return image;
          },

          onChange: function (node, value) {
            $(node).css("background-image", "url(" + value + ")");

            return node;
          },
        },
        {
          name: "Repeat",
          key: "background-repeat",
          sort: base_sort++,
          section: style_section,
          htmlAttr: "style",
          inputtype: new SelectInput(),
          data: {
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
            ],
          },
        },
        {
          name: "Size",
          key: "background-size",
          sort: base_sort++,
          section: style_section,
          htmlAttr: "style",
          inputtype: new SelectInput(),
          data: {
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
            ],
          },
        },
        {
          name: "Position x",
          key: "background-position-x",
          sort: base_sort++,
          section: style_section,
          htmlAttr: "style",
          col: 6,
          inline: true,
          inputtype: new SelectInput(),
          data: {
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
            ],
          },
        },
        {
          name: "Position y",
          key: "background-position-y",
          sort: base_sort++,
          section: style_section,
          htmlAttr: "style",
          col: 6,
          inline: true,
          inputtype: new SelectInput(),
          data: {
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
                value: "top",
                text: "top",
              },
              {
                value: "bottom",
                text: "bottom",
              },
            ],
          },
        },
      ],
    });

    //Device visibility
    var ComponentDeviceVisibility = {
      properties: [
        {
          key: "visibility_header",
          inputtype: new SectionInput(),
          name: false,
          sort: base_sort++,
          section: advanced_section,
          data: { header: "Hide based on device screen width" },
        },
        {
          name: "Extra small devices",
          key: "hidexs",
          col: 6,
          inline: true,
          sort: base_sort++,
          section: advanced_section,
          htmlAttr: "class",
          validValues: ["d-xs-none"],
          inputtype: new ToggleInput(),
          data: {
            on: "d-xs-none",
            off: "",
          },
        },
        {
          name: "Small devices",
          key: "hidesm",
          col: 6,
          inline: true,
          sort: base_sort++,
          section: advanced_section,
          htmlAttr: "class",
          validValues: ["d-sm-none"],
          inputtype: new ToggleInput(),
          data: {
            on: "d-sm-none",
            off: "",
          },
        },
        {
          name: "Medium devices",
          key: "hidemd",
          col: 6,
          inline: true,
          sort: base_sort++,
          section: advanced_section,
          htmlAttr: "class",
          validValues: ["d-md-none"],
          inputtype: new ToggleInput(),
          data: {
            on: "d-md-none",
            off: "",
          },
        },
        {
          name: "Large devices",
          key: "hidelg",
          col: 6,
          inline: true,
          sort: base_sort++,
          section: advanced_section,
          htmlAttr: "class",
          validValues: ["d-lg-none"],
          inputtype: new ToggleInput(),
          data: {
            on: "d-lg-none",
            off: "",
          },
        },
        {
          name: "Xl devices",
          key: "hidexl",
          col: 6,
          inline: true,
          sort: base_sort++,
          section: advanced_section,
          htmlAttr: "class",
          validValues: ["d-xl-none"],
          inputtype: new ToggleInput(),
          data: {
            on: "d-xl-none",
            off: "",
          },
        },
        {
          name: "Xxl devices",
          key: "hidexxl",
          col: 6,
          inline: true,
          sort: base_sort++,
          section: advanced_section,
          htmlAttr: "class",
          validValues: ["d-xxl-none"],
          inputtype: new ToggleInput(),
          data: {
            on: "d-xxl-none",
            off: "",
          },
        },
      ],
    };

    builder.Components.extend("_base", "_base", ComponentDeviceVisibility);

    builder.Components.add("config/bootstrap", {
      name: "Bootstrap Variables",
      beforeInit: function (node) {
        let properties = [];
        var i = 0;
        var j = 0;

        let cssVars = builder.ColorPaletteManager.getAllCSSVariableNames(
          window.FrameDocument.styleSheets /*, ":root"*/
        );

        for (let type in cssVars) {
          properties.push({
            key: "cssVars" + type,
            inputtype: new SectionInput(),
            name: type,
            sort: base_sort++,
            data: { header: type[0].toUpperCase() + type.slice(1) },
          });

          for (let selector in cssVars[type]) {
            let friendlyName = selector
              .replaceAll(/--bs-/g, "")
              .replaceAll("-", " ")
              .trim();
            friendlyName =
              friendlyName[0].toUpperCase() + friendlyName.slice(1);

            let value = cssVars[type][selector];
            let input;

            let data = { selector, type: value.type, step: "any" };

            if (value.type == "color") {
              input = new ColorInput();
            } else if (value.type == "font") {
              input = new SelectInput();
              data.options = fontList;
            } else if (value.type == "dimensions") {
              input = new CssUnitInput();
            }

            i++;
            properties.push({
              name: friendlyName,
              key: "cssvar" + i,
              defaultValue: value.value,
              //index: i - 1,
              columnNode: this,
              col: value.type == "font" || value.type == "dimensions" ? 12 : 4,
              inline: true,
              section: advanced_section,
              inputtype: input,
              data: data,
              onChange: function (node, value, input) {
                if (this.data.type == "font") {
                  let option = input.options[input.selectedIndex];
                  builder.FontsManager.addFont(
                    option.dataset.provider,
                    value,
                    node[0]
                  );
                }

                builder.StyleManager.setStyle(":root", this.data.selector, value);

                return node;
              },
            });
          }
        }

        this.properties = properties;
        return node;
      },
      properties: [],
    });
  }
}

class HTMLComponents extends ComponentGroup {
  initialize() {
    let Vvveb = this.builder;

    Vvveb.ComponentsGroup["Base"] = [
      "html/div",
      "html/heading",
      "html/image",
      "html/hr",
      "html/form",
      "html/textinput",
      "html/textareainput",
      "html/selectinput",
      "html/fileinput",
      "html/checkbox",
      "html/radiobutton",
      "html/link",
      "html/video",
      "html/button",
      "html/paragraph",
      "html/blockquote",
      "html/list",
      "html/table",
      "html/preformatted",
      "html/audio",
      "html/video",
    ];

    Vvveb.Components.extend("_base", "html/div", {
      image: "icons/container.svg",
      name: "Div",
      nodes: ["div"],
      html: "<div>New Div</div>",
      properties: [],
    });

    Vvveb.Components.extend("_base", "html/heading", {
      image: "icons/heading.svg",
      name: "Heading",
      nodes: ["h1", "h2", "h3", "h4", "h5", "h6"],
      html: "<h1>Heading</h1>",

      properties: [
        {
          name: "Size",
          key: "size",
          inputtype: new SelectInput(),

          onChange: function (node, value) {
            return changeNodeName(node, "h" + value);
          },

          init: function (node) {
            var regex;
            regex = /H(\d)/.exec(node.nodeName);
            if (regex && regex[1]) {
              return regex[1];
            }
            return 1;
          },

          data: {
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
          },
        },
      ],
    });

    let linkComponentProperties = [
      {
        name: "Text",
        key: "text",
        sort: 1,
        htmlAttr: "innerText",
        inputtype: new TextInput(),
      },
      {
        name: "Url",
        key: "href",
        sort: 2,
        htmlAttr: "href",
        inputtype: new LinkInput(),
      },
      {
        name: "Rel",
        key: "rel",
        sort: 3,
        htmlAttr: "rel",
        inputtype: new LinkInput(),
      },
      {
        name: "Target",
        key: "target",
        sort: 4,
        htmlAttr: "target",
        inputtype: new SelectInput(),
        data: {
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
        },
      },
      {
        name: "Download",
        sort: 5,
        key: "download",
        htmlAttr: "download",
        inputtype: new CheckboxInput(),
      },
    ];

    Vvveb.Components.extend("_base", "html/link", {
      nodes: ["a"],
      name: "Link",
      html: '<a href="#" rel="noopener">Link Text</a>',
      image: "icons/link.svg",
      properties: linkComponentProperties,
    });

    Vvveb.Components.extend("_base", "html/image", {
      nodes: ["img"],
      name: "Image",
      html:
        '<img src="' +
        Vvveb.baseUrl +
        'icons/image.svg" class="mw-100 align-center">',
      image: "icons/image.svg",
      resizable: true, //show select box resize handlers

      properties: [
        {
          name: "Image",
          key: "src",
          htmlAttr: "src",
          inputtype: new ImageInput(),
        },
        {
          name: "Width",
          key: "width",
          htmlAttr: "width",
          inputtype: new TextInput(),
        },
        {
          name: "Height",
          key: "height",
          htmlAttr: "height",
          inputtype: new TextInput(),
        },
        {
          name: "Alt",
          key: "alt",
          htmlAttr: "alt",
          inputtype: new TextInput(),
        },
        {
          name: "Align",
          key: "align",
          htmlAttr: "class",
          inline: false,
          validValues: ["", "align-left", "align-center", "align-right"],
          inputtype: new RadioButtonInput(),
          data: {
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
          },
        },
        {
          key: "link_options",
          inputtype: new SectionInput(),
          name: false,
          data: { header: "Link" },
        },
        {
          name: "Enable link",
          key: "enable_link",
          inputtype: new CheckboxInput(),
          data: {
            className: "form-switch",
          },
          setGroup: (value) => {
            let group = $('.mb-3[data-group="link"]');
            if (value) {
              group.attr("style", "");
            } else {
              group.attr("style", "display:none !important");
            }
          },
          onChange: function (node, value, input) {
            this.setGroup(value);
            if (value) {
              $(node).wrap('<a href="#"></a>');
            } else {
              $(node).unwrap("a");
            }
            return node;
          },
          init: function (node) {
            let value = node.parentNode.tagName.toLowerCase() == "a";
            this.setGroup(value);
            return value;
          },
        },
      ].concat(
        //add link properties after setting parent to <a> element
        linkComponentProperties.map((el) => {
          let a = Object.assign({}, el);
          a["parent"] = "a";
          a["group"] = "link";
          return a;
        })
      ),

      init(node) {
        let group = $('.mb-3[data-group="link"]');
        if (node.parentNode.tagName.toLowerCase() == "a") {
          group.attr("style", "");
        } else {
          group.attr("style", "display:none !important");
        }

        return node;
      },
    });

    Vvveb.Components.extend("_base", "html/hr", {
      image: "icons/hr.svg",
      nodes: ["hr"],
      name: "Horizontal Rule",
      html: "<hr>",
    });

    Vvveb.Components.extend("_base", "html/label", {
      name: "Label",
      nodes: ["label"],
      html: '<label for="">Label</label>',
      properties: [
        {
          name: "For id",
          htmlAttr: "for",
          key: "for",
          inputtype: new TextInput(),
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/textinput", {
      name: "Input",
      nodes: ["input"],
      //attributes: {"type":"text"},
      image: "icons/text_input.svg",
      html: '<div class="mb-3"><label>Text</label><input type="text" class="form-control"></div></div>',
      properties: [
        {
          name: "Value",
          key: "value",
          htmlAttr: "value",
          inputtype: new TextInput(),
        },
        {
          name: "Type",
          key: "type",
          htmlAttr: "type",
          inputtype: new SelectInput(),
          data: {
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
          },
        },
        {
          name: "Placeholder",
          key: "placeholder",
          htmlAttr: "placeholder",
          inputtype: new TextInput(),
        },
        {
          name: "Disabled",
          key: "disabled",
          htmlAttr: "disabled",
          col: 6,
          inputtype: new CheckboxInput(),
        },
        {
          name: "Required",
          key: "required",
          htmlAttr: "required",
          col: 6,
          inputtype: new CheckboxInput(),
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/selectinput", {
      nodes: ["select"],
      name: "Select Input",
      image: "icons/select_input.svg",
      html: '<div class="mb-3"><label>Choose an option </label><select class="form-control"><option value="value1">Text 1</option><option value="value2">Text 2</option><option value="value3">Text 3</option></select></div>',

      beforeInit: function (node) {
        console.log(node);
        properties = [];
        var i = 0;

        $(node)
          .find("option")
          .each(function (e) {
            data = { value: this.value, text: this.text };
            i++;
            properties.push({
              name: "Option " + i,
              key: "option" + i,
              //index: i - 1,
              optionNode: this,
              inline: true,
              inputtype: new TextValueInput(),
              data: data,
              onChange: function (node, value, input) {
                option = $(this.optionNode);

                //if remove button is clicked remove option and render row properties
                if (input.nodeName == "BUTTON") {
                  option.remove();
                  Vvveb.Components.render("html/selectinput");
                  return node;
                }

                if (input.name == "value") option.attr("value", value);
                else if (input.name == "text") option.text(value);

                return node;
              },
            });
          });

        //remove all option properties
        this.properties = this.properties.filter(function (item) {
          return item.key.indexOf("option") === -1;
        });

        //add remaining properties to generated column properties
        properties.push(this.properties[0]);

        this.properties = properties;
        return node;
      },

      properties: [
        {
          name: "Option",
          key: "option1",
          inputtype: new TextValueInput(),
        },
        {
          name: "Option",
          key: "option2",
          inputtype: new TextValueInput(),
        },
        {
          name: "",
          key: "addChild",
          inputtype: new ButtonInput(),
          data: { text: "Add option", icon: "la-plus" },
          onChange: function (node) {
            $(node).append('<option value="value">Text</option>');

            //render component properties again to include the new column inputs
            Vvveb.Components.render("html/selectinput");

            return node;
          },
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/textareainput", {
      name: "Text Area",
      image: "icons/text_area.svg",
      html: '<div class="mb-3"><label>Your response:</label><textarea class="form-control"></textarea></div>',
    });
    Vvveb.Components.extend("_base", "html/radiobutton", {
      name: "Radio Button",
      attributes: { type: "radio" },
      image: "icons/radio.svg",
      html: `<div class="form-check">
                      <label class="form-check-label">
                        <input class="form-check-input" type="radio" name="radiobutton"> Option 1
                      </label>
                    </div>
                    <div class="form-check">
                      <label class="form-check-label">
                        <input class="form-check-input" type="radio" name="radiobutton" checked> Option 2
                      </label>
                    </div>
                    <div class="form-check">
                      <label class="form-check-label">
                        <input class="form-check-input" type="radio" name="radiobutton"> Option 3
                      </label>
                    </div>`,
      properties: [
        {
          name: "Name",
          key: "name",
          htmlAttr: "name",
          inputtype: new TextInput(),
          //inline:true,
          //col:6
        },
        {
          name: "Value",
          key: "value",
          htmlAttr: "value",
          inputtype: new TextInput(),
          //inline:true,
          //col:6
        },
        {
          name: "Checked",
          key: "checked",
          htmlAttr: "Checked",
          inputtype: new CheckboxInput(),
          //inline:true,
          //col:6
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/checkbox", {
      name: "Checkbox",
      attributes: { type: "checkbox" },
      image: "icons/checkbox.svg",
      html: `<div class="form-check">
                      <label class="form-check-label">
                        <input class="form-check-input" type="checkbox" value=""> Default checkbox
                      </label>
                    </div>`,
      properties: [
        {
          name: "Name",
          key: "name",
          htmlAttr: "name",
          inputtype: new TextInput(),
          //inline:true,
          //col:6
        },
        {
          name: "Value",
          key: "value",
          htmlAttr: "value",
          inputtype: new TextInput(),
          //inline:true,
          //col:6
        },
        {
          name: "Checked",
          key: "checked",
          htmlAttr: "Checked",
          inputtype: new CheckboxInput(),
          //inline:true,
          //col:6
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/fileinput", {
      name: "Input group",
      attributes: { type: "file" },
      image: "icons/text_input.svg",
      html: '<div class="mb-3">\
                      <input type="file" class="form-control">\
                    </div>',
    });

    Vvveb.Components.extend("_base", "html/video", {
      nodes: ["video"],
      name: "Video",
      html: '<video width="320" height="240" playsinline loop autoplay><source src="https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4"><video>',
      dragHtml:
        '<img  width="320" height="240" src="' +
        Vvveb.baseUrl +
        'icons/video.svg">',
      image: "icons/video.svg",
      resizable: true, //show select box resize handlers
      properties: [
        {
          name: "Src",
          child: "source",
          key: "src",
          htmlAttr: "src",
          inputtype: new LinkInput(),
        },
        {
          name: "Width",
          key: "width",
          htmlAttr: "width",
          inputtype: new TextInput(),
        },
        {
          name: "Height",
          key: "height",
          htmlAttr: "height",
          inputtype: new TextInput(),
        },
        {
          name: "Muted",
          key: "muted",
          htmlAttr: "muted",
          inputtype: new CheckboxInput(),
        },
        {
          name: "Loop",
          key: "loop",
          htmlAttr: "loop",
          inputtype: new CheckboxInput(),
        },
        {
          name: "Autoplay",
          key: "autoplay",
          htmlAttr: "autoplay",
          inputtype: new CheckboxInput(),
        },
        {
          name: "Plays inline",
          key: "playsinline",
          htmlAttr: "playsinline",
          inputtype: new CheckboxInput(),
        },
        {
          name: "Controls",
          key: "controls",
          htmlAttr: "controls",
          inputtype: new CheckboxInput(),
        },
        {
          name: "",
          key: "autoplay_warning",
          inline: false,
          col: 12,
          inputtype: new NoticeInput(),
          data: {
            type: "warning",
            title: "Autoplay",
            text: "Most browsers allow autoplay only if video is muted and plays inline",
          },
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/button", {
      nodes: ["button"],
      name: "Html Button",
      image: "icons/button.svg",
      html: "<button>Button</button>",
      properties: [
        {
          name: "Text",
          key: "text",
          htmlAttr: "innerHTML",
          inputtype: new TextInput(),
        },
        {
          name: "Name",
          key: "name",
          htmlAttr: "name",
          inputtype: new TextInput(),
        },
        {
          name: "Type",
          key: "type",
          htmlAttr: "type",
          inputtype: new SelectInput(),
          data: {
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
          },
        },
        {
          name: "Autofocus",
          key: "autofocus",
          htmlAttr: "autofocus",
          inputtype: new CheckboxInput(),
          inline: true,
          col: 6,
        },
        {
          name: "Disabled",
          key: "disabled",
          htmlAttr: "disabled",
          inline: true,
          col: 6,
          inputtype: new CheckboxInput(),
          inline: true,
          col: 6,
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/paragraph", {
      nodes: ["p"],
      name: "Paragraph",
      image: "icons/paragraph.svg",
      html: "<p>Lorem ipsum</p>",
      properties: [
        {
          name: "Text align",
          key: "text-align",
          htmlAttr: "class",
          inline: false,
          validValues: ["", "text-start", "text-center", "text-end"],
          inputtype: new RadioButtonInput(),
          data: {
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
          },
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/blockquote", {
      nodes: ["blockquote"],
      name: "Blockquote",
      image: "icons/blockquote.svg",
      html: `<blockquote>
                        Today I shall be meeting with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness all of them due to the offenders' ignorance of what is good or evil..
                    </blockquote>`,
    });

    Vvveb.Components.extend("_base", "html/list", {
      nodes: ["ul", "ol"],
      name: "List",
      image: "icons/list.svg",
      html: `<ul>
                        <li>Today I shall be meeting with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness all of them due to the offenders' ignorance of what is good or evil..</li>
                        <li>Today I shall be meeting with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness all of them due to the offenders' ignorance of what is good or evil..</li>
                        <li>Today I shall be meeting with interference, ingratitude, insolence, disloyalty, ill-will, and selfishness all of them due to the offenders' ignorance of what is good or evil..</li>
                    </ul>`,
    });

    Vvveb.Components.extend("_base", "html/preformatted", {
      nodes: ["pre"],
      name: "Preformatted",
      image: "icons/paragraph.svg",
      html: `<pre>Today I shall be meeting with interference, 
        ingratitude, insolence, disloyalty, ill-will, and
        selfishness all of them due to the offenders'
        ignorance of what is good or evil..</pre>`,
      properties: [
        {
          name: "Text",
          key: "text",
          inline: false,
          htmlAttr: "innerHTML",
          inputtype: new TextareaInput(),
          data: {
            rows: 20,
          },
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/form", {
      nodes: ["form"],
      image: "icons/form.svg",
      name: "Form",
      html: `<form action="" method="POST">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1">
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Check me out</label>
              </div>
              <button type="submit" class="btn btn-primary">Submit</button>
            </form>`,
      properties: [
        /*{
                name: "Style",
                key: "style",
                htmlAttr: "class",
                validValues: ["", "form-search", "form-inline", "form-horizontal"],
                inputtype: new SelectInput(),
                data: {
                    options: [{
                        value: "",
                        text: "Default"
                    }, {
                        value: "form-search",
                        text: "Search"
                    }, {
                        value: "form-inline",
                        text: "Inline"
                    }, {
                        value: "form-horizontal",
                        text: "Horizontal"
                    }]
                }
            }, */ {
          name: "Action",
          key: "action",
          htmlAttr: "action",
          inputtype: new TextInput(),
        },
        {
          name: "Method",
          key: "method",
          htmlAttr: "method",
          inputtype: new SelectInput(),
          data: {
            options: [
              {
                value: "post",
                text: "Post",
              },
              {
                value: "get",
                text: "Get",
              },
            ],
          },
        },
        {
          name: "Encoding type",
          key: "enctype",
          htmlAttr: "enctype",
          inputtype: new SelectInput(),
          data: {
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
          },
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/tablerow", {
      nodes: ["tr"],
      name: "Table Row",
      html: "<tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>",
      properties: [
        {
          name: "Type",
          key: "type",
          htmlAttr: "class",
          inputtype: new SelectInput(),
          validValues: ["", "success", "danger", "warning", "active"],
          data: {
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
          },
        },
      ],
    });
    Vvveb.Components.extend("_base", "html/tablecell", {
      nodes: ["td"],
      name: "Table Cell",
      html: "<td>Cell</td>",
    });

    Vvveb.Components.extend("_base", "html/tableheadercell", {
      nodes: ["th"],
      name: "Table Header Cell",
      html: "<th>Head</th>",
    });

    Vvveb.Components.extend("_base", "html/tablehead", {
      nodes: ["thead"],
      name: "Table Head",
      html: "<thead><tr><th>Head 1</th><th>Head 2</th><th>Head 3</th></tr></thead>",
      properties: [
        {
          name: "Type",
          key: "type",
          htmlAttr: "class",
          inputtype: new SelectInput(),
          validValues: ["", "success", "danger", "warning", "info"],
          data: {
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
                value: "anger",
                text: "Error",
              },
              {
                value: "warning",
                text: "Warning",
              },
              {
                value: "info",
                text: "Info",
              },
            ],
          },
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/table", {
      nodes: ["table"],
      classes: ["table"],
      image: "icons/table.svg",
      name: "Table",
      html: `<table class="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">First</th>
                          <th scope="col">Last</th>
                          <th scope="col">Handle</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <th scope="row">2</th>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                        </tr>
                        <tr>
                          <th scope="row">3</th>
                          <td colspan="2">Larry the Bird</td>
                          <td>@twitter</td>
                        </tr>
                      </tbody>
                    </table>`,
      properties: [
        {
          name: "Type",
          key: "type",
          htmlAttr: "class",
          validValues: [
            "table-primary",
            "table-secondary",
            "table-success",
            "table-danger",
            "table-warning",
            "table-info",
            "table-light",
            "table-dark",
            "table-white",
          ],
          inputtype: new SelectInput(),
          data: {
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
          },
        },
        {
          name: "Responsive",
          key: "responsive",
          htmlAttr: "class",
          validValues: ["table-responsive"],
          inputtype: new ToggleInput(),
          data: {
            on: "table-responsive",
            off: "",
          },
        },
        {
          name: "Small",
          key: "small",
          htmlAttr: "class",
          validValues: ["table-sm"],
          inputtype: new ToggleInput(),
          data: {
            on: "table-sm",
            off: "",
          },
        },
        {
          name: "Hover",
          key: "hover",
          htmlAttr: "class",
          validValues: ["table-hover"],
          inputtype: new ToggleInput(),
          data: {
            on: "table-hover",
            off: "",
          },
        },
        {
          name: "Bordered",
          key: "bordered",
          htmlAttr: "class",
          validValues: ["table-bordered"],
          inputtype: new ToggleInput(),
          data: {
            on: "table-bordered",
            off: "",
          },
        },
        {
          name: "Striped",
          key: "striped",
          htmlAttr: "class",
          validValues: ["table-striped"],
          inputtype: new ToggleInput(),
          data: {
            on: "table-striped",
            off: "",
          },
        },
        {
          name: "Inverse",
          key: "inverse",
          htmlAttr: "class",
          validValues: ["table-inverse"],
          inputtype: new ToggleInput(),
          data: {
            on: "table-inverse",
            off: "",
          },
        },
        {
          name: "Head options",
          key: "head",
          htmlAttr: "class",
          child: "thead",
          inputtype: new SelectInput(),
          validValues: ["", "thead-dark", "thead-light"],
          data: {
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
          },
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/audio", {
      nodes: ["audio"],
      attributes: ["data-component-audio"],
      name: "Audio",
      image: "icons/audio.svg",
      html: `<figure data-component-audio><audio controls src="#"></audio></figure>`,
      properties: [
        {
          name: "Src",
          key: "src",
          child: "audio",
          htmlAttr: "src",
          inputtype: new LinkInput(),
        },
        {
          key: "audio_options",
          inputtype: new SectionInput(),
          name: false,
          data: { header: "Options" },
        },
        {
          name: "Autoplay",
          key: "autoplay",
          htmlAttr: "autoplay",
          child: "audio",
          inputtype: new CheckboxInput(),
          inline: true,
          col: 4,
          /*    }, {
                name: "Controls",
                key: "controls",
                htmlAttr: "controls",
                inputtype: new CheckboxInput(),
                child:"audio",
                inline:true,
                col:4,
        */
        },
        {
          name: "Loop",
          key: "loop",
          htmlAttr: "loop",
          inputtype: new CheckboxInput(),
          child: "audio",
          inline: true,
          col: 4,
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/video", {
      nodes: ["video"],
      name: "Video",
      image: "icons/video.svg",
      html: `<video controls playsinline src="/media/Sky Clouds Royalty Free HD Video Footage [CC0] [fmngCpy1O2E].webm" poster="/media/Sky Clouds Royalty Free HD Video Footage [CC0] [fmngCpy1O2E].webp"></video>`,
      properties: [
        {
          name: "Poster",
          key: "poster",
          htmlAttr: "poster",
          inputtype: new ImageInput(),
        },
        {
          name: "Src",
          key: "src",
          htmlAttr: "src",
          inputtype: new LinkInput(),
        },
        {
          key: "video_options",
          inputtype: new SectionInput(),
          name: false,
          data: { header: "Options" },
        },
        {
          name: "Auto play",
          key: "autoplay",
          htmlAttr: "autoplay",
          inputtype: new CheckboxInput(),
          data: {
            on: "true",
            off: "false",
          },
          inline: true,
          col: 4,
        },
        {
          name: "Controls",
          key: "controls",
          htmlAttr: "controls",
          inputtype: new CheckboxInput(),
          data: {
            on: "true",
            off: "false",
          },
          inline: true,
          col: 4,
        },
        {
          name: "Loop",
          key: "loop",
          htmlAttr: "loop",
          inputtype: new CheckboxInput(),
          data: {
            on: "true",
            off: "false",
          },
          inline: true,
          col: 4,
        },
        {
          name: "Play inline",
          key: "playsinline",
          htmlAttr: "playsinline",
          inputtype: new CheckboxInput(),
          data: {
            on: "true",
            off: "false",
          },
          inline: true,
          col: 4,
        },
        {
          name: "Muted",
          key: "muted",
          htmlAttr: "muted",
          inputtype: new CheckboxInput(),
          data: {
            on: "true",
            off: "false",
          },
          inline: true,
          col: 4,
        },
        {
          name: "",
          key: "autoplay_warning",
          inline: false,
          col: 12,
          inputtype: new NoticeInput(),
          data: {
            type: "warning",
            title: "Autoplay",
            text: "Most browsers allow auto play only if video is muted and plays inline",
          },
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/pdf", {
      attributes: ["data-component-pdf"],
      image: "icons/pdf.svg",
      name: "Pdf embed",
      html: `<object data="" type="application/pdf" data-component-pdf></object>`,
      properties: [
        {
          name: "Data",
          key: "data",
          htmlAttr: "data",
          inputtype: new TextInput(),
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/embed", {
      attributes: ["data-component-embed"],
      image: "icons/embed.svg",
      name: "Embed",
      html: `<object data="" type="application/pdf" data-component-pdf></object>`,
      properties: [
        {
          name: "Data",
          key: "data",
          htmlAttr: "data",
          inputtype: new TextInput(),
        },
      ],
    });

    Vvveb.Components.extend("_base", "html/html", {
      nodes: ["html"],
      name: "Html Page",
      image: "icons/posts.svg",
      html: `<html><body></body></html>`,
      properties: [
        {
          name: "Title",
          key: "title",
          htmlAttr: "innerHTML",
          inputtype: new TextInput(),
          child: "title",
        },
        {
          name: "Meta description",
          key: "description",
          htmlAttr: "content",
          inputtype: new TextInput(),
          child: "meta[name=description]",
        },
        {
          name: "Meta keywords",
          key: "keywords",
          htmlAttr: "content",
          inputtype: new TextInput(),
          child: "meta[name=keywords]",
        },
      ],
    });
  }
}

class ElementsComponents extends ComponentGroup {
  initialize() {
    let Vvveb = this.builder;
    Vvveb.ComponentsGroup["Elements"] = [
      /*sections */
      "elements/section",
      "elements/footer",
      "elements/header",
      "elements/svg-icon",
      "elements/gallery",
    ];

    Vvveb.Components.extend("_base", "elements/svg-icon", {
      nodes: ["svg"],
      name: "Svg Icon",
      image: "icons/star.svg",
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64">
            <path d="M 30.335938 12.546875 L 20.164063 11.472656 L 16 2.132813 L 11.835938 11.472656 L 1.664063 12.546875 L 9.261719 19.394531 L 7.140625 29.398438 L 16 24.289063 L 24.859375 29.398438 L 22.738281 19.394531 Z"/>
        </svg>`,
      properties: [
        {
          name: "Icon",
          key: "icon",
          inline: true,
          inputtype: new HtmlListSelectInput(),
          onChange: function (element, value, input, component) {
            var newElement = $(value);
            let attributes = element.prop("attributes");

            //keep old svg size and colors
            $.each(attributes, function () {
              if (this.name == "viewBox") return;
              newElement.attr(this.name, this.value);
            });

            element.replaceWith(newElement);
            return newElement;
          },
          data: {
            url: Vvveb.baseUrl + "../../resources/svg/icons/{value}/index.html",
            clickElement: "li",
            insertElement: "svg",
            elements: "Loading ...",
            options: [
              {
                value: "eva-icons",
                text: "Eva icons",
              },
              {
                value: "ionicons",
                text: "IonIcons",
              },
              {
                value: "linea",
                text: "Linea",
              },
              {
                value: "remix-icon",
                text: "RemixIcon",
              },
              {
                value: "unicons",
                text: "Unicons",
              },
              {
                value: "clarity-icons",
                text: "Clarity icons",
              },
              {
                value: "jam-icons",
                text: "Jam icons",
              },
              {
                value: "ant-design-icons",
                text: "Ant design icons",
              },
              {
                value: "themify",
                text: "Themify",
              },
              {
                value: "css.gg",
                text: "Css.gg",
              },
              {
                value: "olicons",
                text: "Olicons",
              },
              {
                value: "open-iconic",
                text: "Open iconic",
              },
              {
                value: "boxicons",
                text: "Box icons",
              },
              {
                value: "elegant-font",
                text: "Elegant font",
              },
              {
                value: "dripicons",
                text: "Dripicons",
              },
              {
                value: "feather",
                text: "Feather",
              },
              {
                value: "coreui-icons",
                text: "Coreui icons",
              },
              {
                value: "heroicons",
                text: "Heroicons",
              },
              {
                value: "iconoir",
                text: "Iconoir",
              },
              {
                value: "iconsax",
                text: "Iconsax",
              },
              {
                value: "ikonate",
                text: "Ikonate",
              },
              {
                value: "tabler-icons",
                text: "Tabler icons",
              },
              {
                value: "octicons",
                text: "Octicons",
              },
              {
                value: "system-uicons",
                text: "System-uicons",
              },
              {
                value: "font-awesome",
                text: "FontAwesome",
              },
              {
                value: "pe-icon-7-stroke",
                text: "Pixeden icon 7 stroke",
              },
              {
                value: "77_essential_icons",
                text: "77 essential icons",
              },
              {
                value: "150-outlined-icons",
                text: "150 outlined icons",
              },
              {
                value: "material-design",
                text: "Material Design",
              },
            ],
          },
        },
        {
          name: "Width",
          key: "width",
          htmlAttr: "width",
          inputtype: new RangeInput(),
          data: {
            max: 640,
            min: 6,
            step: 1,
          },
        },
        {
          name: "Height",
          key: "height",
          htmlAttr: "height",
          inputtype: new RangeInput(),
          data: {
            max: 640,
            min: 6,
            step: 1,
          },
        },
        {
          name: "Stroke width",
          key: "stroke-width",
          htmlAttr: "stroke-width",
          inputtype: new RangeInput(),
          data: {
            max: 512,
            min: 1,
            step: 1,
          },
        },
        {
          key: "svg_style_header",
          inputtype: new SectionInput(),
          name: false,
          //sort: base_sort++,
          section: style_section,
          data: { header: "Svg colors" },
        },
        {
          name: "Fill Color",
          key: "fill",
          //sort: base_sort++,
          col: 4,
          inline: true,
          section: style_section,
          htmlAttr: "fill",
          inputtype: new ColorInput(),
        },
        {
          name: "Color",
          key: "color",
          //sort: base_sort++,
          col: 4,
          inline: true,
          section: style_section,
          htmlAttr: "color",
          inputtype: new ColorInput(),
        },
        {
          name: "Stroke",
          key: "Stroke",
          //sort: base_sort++,
          col: 4,
          inline: true,
          section: style_section,
          htmlAttr: "color",
          inputtype: new ColorInput(),
        },
      ],
    });

    Vvveb.Components.extend("_base", "elements/svg-element", {
      nodes: [
        "path",
        "line",
        "polyline",
        "polygon",
        "rect",
        "circle",
        "ellipse",
        "g",
      ],
      name: "Svg element",
      image: "icons/star.svg",
      html: ``,
      properties: [
        {
          name: "Fill Color",
          key: "fill",
          //sort: base_sort++,
          col: 4,
          inline: true,
          section: style_section,
          htmlAttr: "fill",
          inputtype: new ColorInput(),
        },
        {
          name: "Color",
          key: "color",
          //sort: base_sort++,
          col: 4,
          inline: true,
          section: style_section,
          htmlAttr: "color",
          inputtype: new ColorInput(),
        },
        {
          name: "Stroke",
          key: "Stroke",
          //sort: base_sort++,
          col: 4,
          inline: true,
          section: style_section,
          htmlAttr: "color",
          inputtype: new ColorInput(),
        },
        {
          name: "Stroke width",
          key: "stroke-width",
          htmlAttr: "stroke-width",
          inputtype: new RangeInput(),
          data: {
            max: 512,
            min: 1,
            step: 1,
          },
        },
      ],
    });

    //Gallery
    Vvveb.Components.extend("_base", "elements/gallery", {
      attributes: ["data-component-gallery"],
      name: "Gallery",
      image: "icons/images.svg",
      html: `
                <div class="gallery masonry has-shadow" data-component-gallery>
                    <div class="item">
                        <a>
                            <img src="/media/7.jpg">
                        </a>
                    </div>
                    <div class="item">
                        <a>
                            <img src="/media/2.jpg">
                        </a>
                    </div>
                    <div class="item">
                        <a>
                            <img src="/media/15.jpg">
                        </a>
                    </div>
                    <div class="item">
                        <a>
                            <img src="/media/4.jpg">
                        </a>
                    </div>
                    <div class="item">
                        <a>
                            <img src="/media/5.jpg">
                        </a>
                    </div>
                    <div class="item">
                        <a>
                            <img src="/media/6.jpg">
                        </a>
                    </div>
                    <div class="item">
                        <a>
                            <img src="/media/7.jpg">
                        </a>
                    </div>
                </div>
                `,
      properties: [
        {
          name: "Masonry layout",
          key: "masonry",
          htmlAttr: "class",
          validValues: ["masonry", "flex"],
          inputtype: new ToggleInput(),
          data: {
            on: "masonry",
            off: "flex",
          },
          setGroup: (group) => {
            $(".mb-3[data-group]").attr("style", "display:none !important");
            $('.mb-3[data-group="' + group + '"]').attr("style", "");
          },
          onChange: function (node, value, input) {
            this.setGroup(value);
            return node;
          },
          init: function (node) {
            if ($(node).hasClass("masonry")) {
              return "masonry";
            } else {
              return "flex";
            }
          },
        },
        {
          name: "Image shadow",
          key: "shadow",
          htmlAttr: "class",
          validValues: ["", "has-shadow"],
          inputtype: new ToggleInput(),
          data: {
            on: "has-shadow",
            off: "",
          },
        },
        {
          name: "Horizontal gap",
          key: "column-gap",
          htmlAttr: "style",
          inputtype: new CssUnitInput(),
          data: {
            max: 100,
            min: 0,
            step: 1,
          },
        },
        {
          name: "Vertical gap",
          key: "margin-bottom",
          htmlAttr: "style",
          child: ".item",
          inputtype: new CssUnitInput(),
          data: {
            max: 100,
            min: 0,
            step: 1,
          },
        },
        {
          name: "Images per row masonry",
          key: "column-count",
          group: "masonry",
          htmlAttr: "style",
          inputtype: new RangeInput(),
          data: {
            max: 12,
            min: 1,
            step: 1,
          },
        },
        {
          name: "Images per row flex",
          group: "flex",
          key: "flex-basis",
          child: ".item",
          htmlAttr: "style",
          inputtype: new RangeInput(),
          data: {
            max: 12,
            min: 1,
            step: 1,
          },
          onChange: function (node, value, input, component, inputElement) {
            if (value) {
              value = 100 / value;
              value += "%";
            }

            return value;
          },
        },
        {
          name: "",
          key: "addChild",
          inputtype: new ButtonInput(),
          data: { text: "Add image", icon: "la la-plus" },
          onChange: function (node) {
            $(node).append(
              '<div class="item"><a><img src="/media/15.jpg"></a></div>'
            );

            //render component properties again to include the new image
            //Vvveb.Components.render("ellements/gallery");

            return node;
          },
        },
      ],
      init(node) {
        $(".mb-3[data-group]").attr("style", "display:none !important");

        let source = "flex";
        if ($(node).hasClass("masonry")) {
          source = "masonry";
        } else {
          source = "flex";
        }

        $('.mb-3[data-group="' + source + '"]').attr("style", "");
      },
    });

    /* Section */
    let ComponentSectionContent = [
      {
        name: "Title",
        key: "title",
        htmlAttr: "title",
        inputtype: new TextInput(),
      },
      {
        name: "Container width",
        key: "container-width",
        child: "> .container, > .container-fluid",
        htmlAttr: "class",
        validValues: ["container", "container-fluid"],
        inputtype: new RadioButtonInput(),
        data: {
          extraclass: "btn-group-sm btn-group-fullwidth",
          options: [
            {
              value: "container",
              icon: "la la-box",
              text: "Boxed",
              title: "Boxed",
            },
            {
              value: "container-fluid",
              icon: "la la-arrows-alt-h",
              title: "Full",
              text: "Full",
            },
          ],
        },
      },
      {
        name: "Container height",
        key: "container-height",
        child: "> .container:first-child, > .container-fluid:first-child",
        htmlAttr: "class",
        validValues: ["", "vh-100"],
        inputtype: new RadioButtonInput(),
        data: {
          extraclass: "btn-group-sm btn-group-fullwidth",
          options: [
            {
              value: "container",
              icon: "la la-expand",
              text: "Auto",
              title: "Auto",
              checked: true,
            },
            {
              value: "vh-100",
              icon: "la la-arrows-alt-v",
              title: "Full",
              text: "Full",
            },
          ],
        },
      },
      {
        key: "section_separators",
        inputtype: new SectionInput(),
        name: false,
        sort: base_sort++,
        //section: style_section,
        data: { header: "Separators" },
      },
      {
        name: false,
        key: "type",
        inputtype: new RadioButtonInput(),
        htmlAttr: "data-separators",
        data: {
          inline: true,
          extraclass: "btn-group-sm btn-group-fullwidth",
          options: [
            {
              value: "top",
              text: "Top Separator",
              title: "Top Separator",
              icon: "la la-arrow-up",
            },
            {
              value: "bottom",
              text: "Bottom Separator",
              title: "Bottom Separator",
              icon: "la la-arrow-down",
            },
          ],
        },
        onChange: function (element, value, input) {
          $(".mb-3[data-group]").hide();
          $('.mb-3[data-group="' + input.value + '"]').show();

          return element;
        },
        init: function (node) {
          return node.dataset.type;
        },
      },
      {
        key: "section_background_header",
        inputtype: new SectionInput(),
        name: false,
        sort: base_sort++,
        //section: style_section,
        data: { header: "Background" },
      },
      {
        name: false,
        key: "type",
        inputtype: new RadioButtonInput(),
        htmlAttr: "data-type",
        data: {
          inline: true,
          extraclass: "btn-group-sm btn-group-fullwidth",
          options: [
            {
              value: "none",
              text: "None",
              title: "None",
              checked: true,
            },
            {
              value: "image",
              icon: "la la-image",
              text: "Image",
              title: "Image",
            },
            {
              value: "gradient",
              icon: "la la-palette",
              text: "Gradient",
              title: "Gradient",
            },
            {
              value: "video",
              icon: "la la-video",
              text: "Video",
              title: "Video",
            },
            {
              value: "slideshow",
              icon: "la la-arrows-alt-h",
              text: "Slider",
              title: "Slider",
            },
          ],
        },
        onChange: function (element, value, input) {
          $(".mb-3[data-group]").hide();
          $('.mb-3[data-group="' + input.value + '"]').show();

          return element;
        },
        init: function (node) {
          return node.dataset.type;
        },
      },
    ];

    let ComponentSectionStyle = [
      {
        key: "Section Style",
        inputtype: new SectionInput(),
        name: false,
        section: style_section,
        data: { header: "Style" },
      },
    ];

    let ComponentSectionAdvanced = [
      {
        key: "Section Advanced",
        inputtype: new SectionInput(),
        name: false,
        section: advanced_section,
        data: { header: "Advanced" },
      },
    ];

    Vvveb.Components.extend("_base", "elements/section", {
      nodes: ["section"],
      name: "Section",
      image: "icons/stream-solid.svg",
      init: function (node) {
        $(".mb-3[data-group]").hide();
        if (node.dataset.type != undefined) {
          $('.mb-3[data-group="' + node.dataset.type + '"]').show();
        } else {
          $(".mb-3[data-group]:first").show();
        }
      },
      html: `<section>
                    <div class="container">
                        <h1>Section</h1>
                    </div>
                </section>`,
      properties: [
        ...ComponentSectionContent,
        ...ComponentSectionStyle,
        ...ComponentSectionAdvanced,
      ],
    });

    Vvveb.Components.extend("_base", "elements/header", {
      nodes: ["header"],
      name: "Header",
      image: "icons/stream-solid.svg",
      html: `<header>
                    <div class="container">
                        <h1>Section</h1>
                    </div>
                </header>`,
      properties: [
        ...ComponentSectionContent,
        ...ComponentSectionStyle,
        ...ComponentSectionAdvanced,
      ],
    });

    Vvveb.Components.extend("_base", "elements/footer", {
      nodes: ["footer"],
      name: "Footer",
      image: "icons/stream-solid.svg",
      html: `<footer>
                    <div class="container">
                        <h1>Section</h1>
                    </div>
                </footer>`,
      properties: [
        ...ComponentSectionContent,
        ...ComponentSectionStyle,
        ...ComponentSectionAdvanced,
      ],
    });
  }
}

class WidgetsComponents extends ComponentGroup {
  initialize() {
    let Vvveb = this.builder;

    Vvveb.ComponentsGroup["Widgets"] = [
      "widgets/googlemaps",
      "widgets/embed-video",
      "widgets/chartjs",
      /* "widgets/facebookpage", */ "widgets/paypal",
      /*"widgets/instagram",*/ "widgets/twitter",
      "widgets/openstreetmap" /*, "widgets/facebookcomments"*/,
    ];

    Vvveb.Components.extend("_base", "widgets/googlemaps", {
      name: "Google Maps",
      attributes: ["data-component-maps"],
      image: "icons/map.svg",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/maps.png">',
      html: '<div data-component-maps><iframe frameborder="0" src="https://maps.google.com/maps?q=Bucharest&z=15&t=q&key=&output=embed" width="100%" height="100%" style="width:100%;height:100%;left:0px"></iframe></div>',
      resizable: true, //show select box resize handlers
      resizeMode: "css",

      //url parameters
      z: 3, //zoom
      q: "Paris", //location
      t: "q", //map type q = roadmap, w = satellite
      key: "",

      init: function (node) {
        let iframe = jQuery("iframe", node);
        let url = new URL(iframe.attr("src"));
        let params = new URLSearchParams(url.search);

        this.z = params.get("z");
        this.q = params.get("q");
        this.t = params.get("t");
        this.key = params.get("key");

        $(".component-properties input[name=z]").val(this.z);
        $(".component-properties input[name=q]").val(this.q);
        $(".component-properties select[name=t]").val(this.t);
        $(".component-properties input[name=key]").val(this.key);
      },

      onChange: function (node, property, value) {
        map_iframe = jQuery("iframe", node);

        this[property.key] = value;

        mapurl =
          "https://maps.google.com/maps?q=" +
          this.q +
          "&z=" +
          this.z +
          "&t=" +
          this.t +
          "&output=embed";

        map_iframe.attr("src", mapurl);

        return node;
      },

      properties: [
        {
          name: "Address",
          key: "q",
          inputtype: new TextInput(),
        },
        {
          name: "Map type",
          key: "t",
          inputtype: new SelectInput(),
          data: {
            options: [
              {
                value: "q",
                text: "Roadmap",
              },
              {
                value: "w",
                text: "Satellite",
              },
            ],
          },
        },
        {
          name: "Zoom",
          key: "z",
          inputtype: new RangeInput(),
          data: {
            max: 20, //max zoom level
            min: 1,
            step: 1,
          },
        },
        {
          name: "Key",
          key: "key",
          inputtype: new TextInput(),
        },
      ],
    });

    Vvveb.Components.extend("_base", "widgets/openstreetmap", {
      name: "Open Street Map",
      attributes: ["data-component-openstreetmap"],
      image: "icons/map.svg",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/maps.png">',
      html: `<div data-component-openstreetmap><iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=-62.04673002474011%2C16.95487694424327%2C-61.60521696321666%2C17.196751341562923&layer=mapnik"></iframe></div>`,
      resizable: true, //show select box resize handlers
      resizeMode: "css",

      //url parameters
      bbox: "", //location
      layer: "mapnik", //map type

      init: function (node) {
        let iframe = jQuery("iframe", node);
        let url = new URL(iframe.attr("src"));
        let params = new URLSearchParams(url.search);

        this.bbox = params.get("bbox");
        this.layer = params.get("layer");

        $(".component-properties input[name=bbox]").val(this.bbox);
        $(".component-properties input[name=layer]").val(this.layer);
      },

      onChange: function (node, property, value) {
        map_iframe = jQuery("iframe", node);

        this[property.key] = value;

        mapurl =
          "https://www.openstreetmap.org/export/embed.html?bbox=" +
          this.bbox +
          "&layer=" +
          this.layer;

        map_iframe.attr("src", mapurl);

        return node;
      },

      properties: [
        {
          name: "Map",
          key: "bbox",
          inputtype: new TextInput(),
          /*    }, {
        name: "Layer",
        key: "layer",
        inputtype: new SelectInput(),
        data:{
			options: [{
                value: "",
                text: "Default"
            }, {
                value: "Y",
                text: "CyclOSM"
            }, {
                value: "C",
                text: "Cycle Map"
            }, {
                value: "T",
                text: "Transport Map"
            }]
       }*/
        },
      ],
    });

    Vvveb.Components.extend("_base", "widgets/embed-video", {
      name: "Embed Video",
      attributes: ["data-component-video"],
      image: "icons/youtube.svg",
      dragHtml:
        '<img src="' +
        Vvveb.baseUrl +
        'icons/youtube.svg" width="100" height="100">', //use image for drag and swap with iframe on drop for drag performance
      html: '<div data-component-video style="width:640px;height:480px;"><iframe frameborder="0" src="https://player.vimeo.com/video/24253126?autoplay=false&controls=false&loop=false&playsinline=true&muted=false" width="100%" height="100%"></iframe></div>',

      //url parameters set with onChange
      t: "y", //video type
      video_id: "", //video id
      url: "", //html5 video src
      autoplay: false,
      controls: false,
      loop: false,
      playsinline: true,
      muted: false,
      resizable: true, //show select box resize handlers
      resizeMode: "css", //div unlike img/iframe etc does not have width,height attributes need to use css
      youtubeRegex:
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]+)/i,
      vimeoRegex: /(?:vimeo\.com(?:[^\d]+))(\d+)/i,

      init: function (node) {
        iframe = jQuery("iframe", node);
        video = jQuery("video", node);

        $(".component-properties [data-key=url]").hide();
        $(".component-properties [data-key=poster]").hide();

        //check if html5
        if (video.length) {
          this.url = video.src;
        } else if (iframe.length) {
          //vimeo or youtube
          let src = iframe.attr("src");
          let match;

          if (
            src &&
            src.indexOf("youtube") &&
            (match = src.match(this.youtubeRegex))
          ) {
            //youtube
            this.video_id = match[1];
            this.t = "y";
          } else if (
            src &&
            src.indexOf("vimeo") &&
            (match = src.match(this.vimeoRegex))
          ) {
            //vimeo
            this.video_id = match[1];
            this.t = "v";
          } else {
            this.t = "h";
          }
        }

        $(".component-properties input[name=video_id]").val(this.video_id);
        $(".component-properties input[name=url]").val(this.url);
        $(".component-properties select[name=t]").val(this.t);
      },

      onChange: function (node, property, value) {
        this[property.key] = value;
        //if (property.key == "t")
        {
          switch (this.t) {
            case "y":
              $(".component-properties [data-key=video_id]").show();
              $(".component-properties [data-key=url]").hide();
              $(".component-properties [data-key=poster]").hide();
              newnode =
                $(`<iframe width="100%" height="100%" allowfullscreen="true" frameborder="0" allow="autoplay" 
										src="https://www.youtube.com/embed/${this.video_id}?autoplay=${this.autoplay}&controls=${this.controls}&loop=${this.loop}&playsinline=${this.playsinline}&muted=${this.muted}">
								</iframe>`);
              break;
            case "v":
              $(".component-properties [data-key=video_id]").show();
              $(".component-properties [data-key=url]").hide();
              $(".component-properties [data-key=poster]").hide();
              newnode =
                $(`<iframe width="100%" height="100%" allowfullscreen="true" frameborder="0" allow="autoplay" 
										src="https://player.vimeo.com/video/${this.video_id}?autoplay=${this.autoplay}&controls=${this.controls}&loop=${this.loop}&playsinline=${this.playsinline}&muted=${this.muted}">
								</iframe>`);
              break;
            case "h":
              $(".component-properties [data-key=video_id]").hide();
              $(".component-properties [data-key=url]").show();
              $(".component-properties [data-key=poster]").show();
              newnode = $(
                '<video poster="' +
                  this.poster +
                  '" src="' +
                  this.url +
                  '" ' +
                  (this.autoplay ? " autoplay " : "") +
                  (this.controls ? " controls " : "") +
                  (this.loop ? " loop " : "") +
                  (this.playsinline ? " playsinline " : "") +
                  (this.muted ? " muted " : "") +
                  ' style="height: 100%; width: 100%;"></video>'
              );
              break;
          }

          $("> iframe, > video", node).replaceWith(newnode);
          return node;
        }

        return node;
      },

      properties: [
        {
          name: "Provider",
          key: "t",
          inputtype: new SelectInput(),
          data: {
            options: [
              {
                text: "Youtube",
                value: "y",
              },
              {
                text: "Vimeo",
                value: "v",
              },
              {
                text: "HTML5",
                value: "h",
              },
            ],
          },
        },
        {
          name: "Video",
          key: "video_id",
          inputtype: new TextInput(),
          onChange: function (node, value, input, component) {
            let youtube =
              /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]+)/i;
            let vimeo = /(?:vimeo\.com(?:[^\d]+))(\d+)/i;
            let id = false;
            let t = false;

            if (
              ((id = value.match(youtube)) && (t = "y")) ||
              ((id = value.match(vimeo)) && (t = "v"))
            ) {
              $(".component-properties select[name=t]").val(t);
              $(".component-properties select[name=video_id]").val(id[1]);

              component.t = t;
              component.video_id = id[1];

              return id[1];
            }

            return node;
          },
        },
        {
          name: "Poster",
          key: "poster",
          htmlAttr: "poster",
          inputtype: new ImageInput(),
        },
        {
          name: "Url",
          key: "url",
          inputtype: new TextInput(),
        },
        {
          name: "Width",
          key: "width",
          htmlAttr: "style",
          inline: false,
          col: 6,
          inputtype: new CssUnitInput(),
        },
        {
          name: "Height",
          key: "height",
          htmlAttr: "style",
          inline: false,
          col: 6,
          inputtype: new CssUnitInput(),
        },
        {
          key: "video_options",
          inputtype: new SectionInput(),
          name: false,
          data: { header: "Options" },
        },
        {
          name: "Auto play",
          key: "autoplay",
          htmlAttr: "autoplay",
          inline: true,
          col: 4,
          inputtype: new CheckboxInput(),
        },
        {
          name: "Plays inline",
          key: "playsinline",
          htmlAttr: "playsinline",
          inline: true,
          col: 4,
          inputtype: new CheckboxInput(),
        },
        {
          name: "Controls",
          key: "controls",
          htmlAttr: "controls",
          inline: true,
          col: 4,
          inputtype: new CheckboxInput(),
        },
        {
          name: "Loop",
          key: "loop",
          htmlAttr: "loop",
          inline: true,
          col: 4,
          inputtype: new CheckboxInput(),
        },
        {
          name: "Muted",
          key: "muted",
          htmlAttr: "muted",
          inline: true,
          col: 4,
          inputtype: new CheckboxInput(),
        },
        {
          name: "",
          key: "autoplay_warning",
          inline: false,
          col: 12,
          inputtype: new NoticeInput(),
          data: {
            type: "warning",
            title: "Autoplay",
            text: "Most browsers allow auto play only if video is muted and plays inline",
          },
        },
      ],
    });

    Vvveb.Components.extend("_base", "widgets/facebookcomments", {
      name: "Facebook Comments",
      attributes: ["data-component-facebookcomments"],
      image: "icons/facebook.svg",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/facebook.svg">',
      html:
        '<div  data-component-facebookcomments><script>(function(d, s, id) {\
			  var js, fjs = d.getElementsByTagName(s)[0];\
			  if (d.getElementById(id)) return;\
			  js = d.createElement(s); js.id = id;\
			  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6&appId=";\
			  fjs.parentNode.insertBefore(js, fjs);\
			}(document, \'script\', \'facebook-jssdk\'));</script>\
			<div class="fb-comments" \
			data-href="' +
        window.location.href +
        '" \
			data-numposts="5" \
			data-colorscheme="light" \
			data-mobile="" \
			data-order-by="social" \
			data-width="100%" \
			></div></div>',
      properties: [
        {
          name: "Href",
          key: "business",
          htmlAttr: "data-href",
          child: ".fb-comments",
          inputtype: new TextInput(),
        },
        {
          name: "Item name",
          key: "item_name",
          htmlAttr: "data-numposts",
          child: ".fb-comments",
          inputtype: new TextInput(),
        },
        {
          name: "Color scheme",
          key: "colorscheme",
          htmlAttr: "data-colorscheme",
          child: ".fb-comments",
          inputtype: new TextInput(),
        },
        {
          name: "Order by",
          key: "order-by",
          htmlAttr: "data-order-by",
          child: ".fb-comments",
          inputtype: new TextInput(),
        },
        {
          name: "Currency code",
          key: "width",
          htmlAttr: "data-width",
          child: ".fb-comments",
          inputtype: new TextInput(),
        },
      ],
    });
    
    Vvveb.Components.extend("_base", "widgets/instagram", {
        name: "Instagram",
        attributes: ["data-component-instagram"],
        image: "icons/instagram.svg",
        drophtml: '<img src="' + Vvveb.baseUrl + 'icons/instagram.png">',
        html: '<div align=center data-component-instagram>\
                <blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/tsxp1hhQTG/" data-instgrm-version="8" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURczMzPf399fX1+bm5mzY9AMAAADiSURBVDjLvZXbEsMgCES5/P8/t9FuRVCRmU73JWlzosgSIIZURCjo/ad+EQJJB4Hv8BFt+IDpQoCx1wjOSBFhh2XssxEIYn3ulI/6MNReE07UIWJEv8UEOWDS88LY97kqyTliJKKtuYBbruAyVh5wOHiXmpi5we58Ek028czwyuQdLKPG1Bkb4NnM+VeAnfHqn1k4+GPT6uGQcvu2h2OVuIf/gWUFyy8OWEpdyZSa3aVCqpVoVvzZZ2VTnn2wU8qzVjDDetO90GSy9mVLqtgYSy231MxrY6I2gGqjrTY0L8fxCxfCBbhWrsYYAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/tsxp1hhQTG/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">Text</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A post shared by <a href="https://www.instagram.com/instagram/" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank"> Instagram</a> (@instagram) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="-">-</time></p></div></blockquote>\
                <script async defer src="//www.instagram.com/embed.js"></script>\
            </div>',
        properties: [{
            name: "Widget id",
            key: "instgrm-permalink",
            htmlAttr: "data-instgrm-permalink",
            child: ".instagram-media",
            inputtype: TextInput
        }],
    });

    Vvveb.Components.extend("_base", "widgets/twitter", {
      name: "Twitter",
      attributes: ["data-component-twitter"],
      image: "icons/twitter.svg",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/twitter.svg">',
      html: '<div data-component-twitter><iframe width="100%" height="100%"src="https://platform.twitter.com/embed/Tweet.html?embedId=twitter-widget-0&frame=false&hideCard=false&hideThread=false&id=943901463998169088"></iframe></div>',
      resizable: true, //show select box resize handlers
      resizeMode: "css",
      twitterRegex: /(?:twitter\.com(?:[^\d]+))(\d+)/i,

      tweet: "", //location
      init: function (node) {
        let iframe = jQuery("iframe", node);
        let src = iframe.attr("src");
        let url = new URL(src);
        let params = new URLSearchParams(url.search);

        this.tweet = params.get("id");

        if (!this.tweet) {
          if ((match = src.match(this.twitterRegex))) {
            this.tweet = match[1];
          }
        }

        $(".component-properties input[name=tweet]").val(this.tweet);
      },

      onChange: function (node, property, value) {
        tweet_iframe = jQuery("iframe", node);

        if (property.key == "tweet") {
          this[property.key] = value;

          tweeturl =
            "https://platform.twitter.com/embed/Tweet.html?embedId=twitter-widget-0&frame=false&hideCard=false&hideThread=false&id=" +
            this.tweet;

          tweet_iframe.attr("src", tweeturl);
        }

        return node;
      },

      properties: [
        {
          name: "Tweet",
          key: "tweet",
          inputtype: new TextInput(),
          onChange: function (node, value, input, component) {
            let twitterRegex = /(?:twitter\.com(?:[^\d]+))(\d+)/i;
            let id = false;

            if ((id = value.match(twitterRegex))) {
              $(".component-properties input[name=tweet]").val(id[1]);

              component.tweet = id[1];
              return id[1];
            }

            return node;
          },
        },
      ],
    });

    Vvveb.Components.extend("_base", "widgets/paypal", {
      name: "Paypal",
      attributes: ["data-component-paypal"],
      image: "icons/paypal.svg",
      html: '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" data-component-paypal>\
\
				<!-- Identify your business so that you can collect the payments. -->\
				<input type="hidden" name="business"\
					value="givanz@yahoo.com">\
\
				<!-- Specify a Donate button. -->\
				<input type="hidden" name="cmd" value="_donations">\
\
				<!-- Specify details about the contribution -->\
				<input type="hidden" name="item_name" value="VvvebJs">\
				<input type="hidden" name="item_number" value="Support">\
				<input type="hidden" name="currency_code" value="USD">\
\
				<!-- Display the payment button. -->\
				<input type="image" name="submit"\
				src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"\
				alt="Donate">\
				<img alt="" width="1" height="1"\
				src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" >\
\
			</form>',
      properties: [
        {
          name: "Email",
          key: "business",
          htmlAttr: "value",
          child: "input[name='business']",
          inputtype: new TextInput(),
        },
        {
          name: "Item name",
          key: "item_name",
          htmlAttr: "value",
          child: "input[name='item_name']",
          inputtype: new TextInput(),
        },
        {
          name: "Item number",
          key: "item_number",
          htmlAttr: "value",
          child: "input[name='item_number']",
          inputtype: new TextInput(),
        },
        {
          name: "Currency code",
          key: "currency_code",
          htmlAttr: "value",
          child: "input[name='currency_code']",
          inputtype: new TextInput(),
        },
      ],
    });

    Vvveb.Components.extend("_base", "widgets/facebookpage", {
      name: "Facebook Page Plugin",
      attributes: ["data-component-facebookpage"],
      image: "icons/facebook.svg",
      dropHtml: '<img src="' + Vvveb.baseUrl + 'icons/facebook.png">',
      html: `<div data-component-facebookpage><div class="fb-page" 
			 data-href="https://www.facebook.com/facebook" 
			 data-tabs="timeline"
			 data-width="" 
			 data-height="" 
			 data-small-header="true" 
			 data-adapt-container-width="true" 
			 data-hide-cover="false" 
			 data-show-facepile="true">
			 
				<blockquote cite="https://www.facebook.com/facebook" class="fb-xfbml-parse-ignore">
					<a href="https://www.facebook.com/facebook">Facebook</a>
				</blockquote>

			</div>

			<div id="fb-root"></div>
			<script async defer crossorigin="anonymous" src="https://connect.facebook.net/ro_RO/sdk.js#xfbml=1&version=v15.0" nonce="o7Y7zPjy"></script>
		</div>`,

      properties: [
        {
          name: "Small header",
          key: "small-header",
          htmlAttr: "data-small-header",
          child: ".fb-page",
          inputtype: new TextInput(),
        },
        {
          name: "Adapt container width",
          key: "adapt-container-width",
          htmlAttr: "data-adapt-container-width",
          child: ".fb-page",
          inputtype: new TextInput(),
        },
        {
          name: "Hide cover",
          key: "hide-cover",
          htmlAttr: "data-hide-cover",
          child: ".fb-page",
          inputtype: new TextInput(),
        },
        {
          name: "Show facepile",
          key: "show-facepile",
          htmlAttr: "data-show-facepile",
          child: ".fb-page",
          inputtype: new TextInput(),
        },
        {
          name: "App Id",
          key: "appid",
          htmlAttr: "data-appId",
          child: ".fb-page",
          inputtype: new TextInput(),
        },
      ],
      onChange: function (node, input, value, component) {
        var newElement = $(this.html);
        newElement.find(".fb-page").attr(input.htmlAttr, value);

        $("[data-fbcssmodules]", Vvveb.Builder.frameHead).remove();
        $("[data-fbcssmodules]", Vvveb.Builder.frameBody).remove();
        $(
          "script[src^='https://connect.facebook.net']",
          Vvveb.Builder.frameHead
        ).remove();

        node.parent().html(newElement.html());
        return newElement;
      },
    });

    Vvveb.Components.extend("_base", "widgets/chartjs", {
      name: "Chart.js",
      attributes: ["data-component-chartjs"],
      image: "icons/chart.svg",
      dragHtml: '<img src="' + Vvveb.baseUrl + 'icons/chart.svg">',
      html: '<div data-component-chartjs class="chartjs" data-chart=\'{\
			"type": "line",\
			"data": {\
				"labels": ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],\
				"datasets": [{\
					"data": [12, 19, 3, 5, 2, 3],\
					"fill": false,\
					"borderColor":"rgba(255, 99, 132, 0.2)"\
				}, {\
					"fill": false,\
					"data": [3, 15, 7, 4, 19, 12],\
					"borderColor": "rgba(54, 162, 235, 0.2)"\
				}]\
			}}\' style="min-height:240px;min-width:240px;width:100%;height:100%;position:relative">\
			  <canvas></canvas>\
			</div>',
      chartjs: null,
      ctx: null,
      node: null,

      config: {
        /*
			type: 'line',
			data: {
				labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
				datasets: [{
					data: [12, 19, 3, 5, 2, 3],
					fill: false,
					borderColor:'rgba(255, 99, 132, 0.2)',
				}, {
					fill: false,
					data: [3, 15, 7, 4, 19, 12],
					borderColor: 'rgba(54, 162, 235, 0.2)',
				}]
			},*/
      },

      dragStart: function (node) {
        //check if chartjs is included and if not add it when drag starts to allow the script to load
        body = Vvveb.Builder.frameBody;

        if ($("#chartjs-script", body).length == 0) {
          $(body).append(
            '<script id="chartjs-script" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js"></script>'
          );
          $(body).append(
            '<script>\
				$(document).ready(function() {\
					$(".chartjs").each(function () {\
						ctx = $("canvas", this).get(0).getContext("2d");\
						config = JSON.parse(this.dataset.chart);\
						chartjs = new Chart(ctx, config);\
					});\
				});\
			  </script>'
          );
        }

        return node;
      },

      drawChart: function () {
        if (this.chartjs != null) this.chartjs.destroy();
        this.node.dataset.chart = JSON.stringify(this.config);

        config = Object.assign({}, this.config); //avoid passing by reference to avoid chartjs to fill the object
        this.chartjs = new Chart(this.ctx, config);
      },

      init: function (node) {
        this.node = node;
        this.ctx = $("canvas", node).get(0).getContext("2d");
        this.config = JSON.parse(node.dataset.chart);
        this.drawChart();

        return node;
      },

      beforeInit: function (node) {
        return node;
      },

      properties: [
        {
          name: "Type",
          key: "type",
          inputtype: new SelectInput(),
          data: {
            options: [
              {
                text: "Line",
                value: "line",
              },
              {
                text: "Bar",
                value: "bar",
              },
              {
                text: "Pie",
                value: "pie",
              },
              {
                text: "Doughnut",
                value: "doughnut",
              },
              {
                text: "Polar Area",
                value: "polarArea",
              },
              {
                text: "Bubble",
                value: "bubble",
              },
              {
                text: "Scatter",
                value: "scatter",
              },
              {
                text: "Radar",
                value: "radar",
              },
            ],
          },
          init: function (node) {
            return JSON.parse(node.dataset.chart).type;
          },
          onChange: function (node, value, input, component) {
            component.config.type = value;
            component.drawChart();

            return node;
          },
        },
      ],
    });
  }
}
