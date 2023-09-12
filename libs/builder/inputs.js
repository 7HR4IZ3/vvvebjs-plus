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

class Input {
  constructor(data) {
    this.data = data || {};
    if (this.data.options) {
      this.data.validValues = [];
      for (let item of this.data.options) {
        this.data.validValues.push(item.value);
      }
    }
  }

  onChange(event, node) {
    if (event.data && event.data.element) {
      event.data.element.trigger("propertyChange", [this.value, this]);
    }
  }

  input(event) {
    this.onChange(event);
  }

  renderTemplate(name, data) {
    return tmpl("vvveb-input-" + name, data);
  }

  setValue(value) {
    $("input", this.element).val(value);
  }

  render(name, data) {
    this.element = $(this.renderTemplate(name, data));

    //bind events
    for (let i of this.events || []) {
      let ev = i[0];
      let fun = this[i[1]];
      let el = i[2];

      this.element.on(ev, el, { element: this.element, input: this }, fun);
    }

    return this.element;
  }

  get html() {
    return this.render("input", this.data);
  }
}

class MultiInput {
  constructor(inputs, defaults) {
    this.data = {
      htmlAttr: "",
      key: "",
      defaultValue: defaults || {}
    };
    this.inputs = inputs;
    this.value = {};
    this.div = $("<div></div>");

    for (let key in this.inputs) {
      this.value[key] = null;

      let input = this.inputs[key];

      input.data.key = (input.data.key || key).replace(/"/g, '"');
      input.data.htmlAttr = input.data.htmlAttr || "";

      let element = $(input.html);
      // console.log(element)

      element.on("propertyChange", (ev, val, inp) =>
        this.callOnChange(ev, val, inp, key)
      );

      this.div.append(
        element.prepend(
          $(
            `<label class="col-12 form-label">${key
              .slice(0, 1)
              .toUpperCase()}${key.slice(1).toLowerCase()}</label>`
          )
        )
      );
    }
  }

  callOnChange(event, value, input, caller) {
    for (let key in this.inputs) {
      if (key === caller) {
        this.value[key] = value;
      }
    }
    this.div.trigger("propertyChange", [this.value, this, caller, input]);
  }

  setValue(value) {
    for (let key in this.inputs) {
      this.inputs[key].setValue(value[key]);
      this.value[key] = value[key];
    }
  }

  get html() {
    return this.div;
  }

  init(node) {
      for (let i in this.inputs) {
          this.inputs[i].init && this.inputs[i].init(node);
      }
  }
}

class DOMNodeInput extends MultiInput {
  constructor(doc, target, attributes = ["innerText"]) {
    let inputs = {};
    let defaults = {};

    doc.querySelectorAll(target).forEach((item, i) => {
      inputs[i] = new TextInput({ key: `${target}_${i}` });
      item = $(item);
      let node = item.get(0);

      for (let attr of attributes) {
        if (!defaults[i]) {
          if (attr == "innerText" || attr == "innerHTML") {
            inputs[i] = new CodeInput({ key: `${target}_${i}` });
            defaults[i] = (
                attr == "innerText" ? node.innerText : node.innerHTML
            ).trim()
          } else {
            defaults[i] = item.attr(attr);
          }
        //   inputs[i].setValue(defaults[i])
        //   console.log(attr, node, inputs[i], defaults[i])
        }
      }

      // if (item.hasAttribute("href")) {
      // 	defaults[i] = item.getAttribute("href")
      // } else if (item.hasAttribute("src")) {
      // 	defaults[i] = item.getAttribute("src")
      // } else {
      // 	inputs[i] = new (window.CodeInput ? CodeInput : TextareaInput)({ key: `${target}_${i}` });
      // 	defaults[i] = item.innerText;
      // }
    });

    super(inputs, defaults);
  }
}

class TextInput extends Input {
  events = [
    //event, listener, child element
    ["blur", "onChange", "input"],
    ["input", "onChange", "input"],
  ];

  get html() {
    let data = this.data;
    return this.render("textinput", data);
  }
}

class TextareaInput extends Input {
  events = [["keyup", "onChange", "textarea"]];

  setValue(value) {
    $("textarea", this.element).val(value);
  }
  
  init() {}

  get html() {
    let data = this.data;
    return this.render("textareainput", data);
  }
}

class CheckboxInput extends Input {
  onChange(event, node) {
    if (event.data && event.data.element) {
      event.data.element.trigger("propertyChange", [this.checked, this]);
    }
  }

  events = [["change", "onChange", "input"]];

  setValue(value) {
    if (value) {
      $("input", this.element).attr("checked", true);
    } else {
      $("input", this.element).attr("checked", false);
    }
  }

  get html() {
    let data = this.data;
    return this.render("checkboxinput", data);
  }
}

class SelectInput extends Input {
  events = [["change", "onChange", "select"]];

  setValue(value) {
    $("select", this.element).val(value);
  }

  get html() {
    let data = this.data;
    return this.render("select", data);
  }
}

class IconSelectInput extends Input {
  events = [["change", "onChange", "select"]];

  setValue(value) {
    $("select", this.element).val(value);
  }

  get html() {
    let data = this.data;
    return this.render("icon-select", data);
  }
}

class HtmlListSelectInput extends Input {
  data = {};
  cache = {};

  events = [
    //["click", "onChange", "li"],
    ["change", "onListChange", "select"],
    ["keyup", "searchElement", "input.search"],
    ["click", "clearSearch", "button.clear-backspace"],
  ];

  clearSearch(event) {
    let element = event.data.element;
    $("input.search", element).val("").keyup();
  }

  searchElement(event) {
    let element = event.data.element;
    searchText = this.value;

    delay(() => {
      $("li", element)
        .hide()
        .each(function () {
          $this = $(this);
          if (this.title.indexOf(searchText) > -1) $this.show();
        });
    }, 500);
  }

  onElementClick(event) {
    let data = event.data.input.data;
    let svg = $(data.insertElement, this);
    let value = svg.get(0).outerHTML;
    event.data.element.trigger("propertyChange", [value, this]);
  }

  onListChange(event) {
    let input = event.data.input;
    let element = event.data.element;
    let url = input.data.url.replace("{value}", this.value);

    $(".elements", element)
      .html(`<div class="p-4"><div class="spinner-border spinner-border-sm" role="status">
		  <span class="visually-hidden">Loading...</span>
		</div> Loading...</div>`);
    //cache ajax requests
    if (input.cache[url] != undefined) {
      $(".elements", element).html(input.cache[url]);
    } else {
      //$(".elements", element).load(url);
      $.ajax({
        url: url,
        cache: true,
        dataType: "html",
        success(data) {
          input.cache[url] = data;
          $(".elements", element).html(data);
        },
      });
    }
  }

  setValue(value) {
    $("select", this.element).val(value);
  }

  get html() {
    let data = this.data;
    this.data = data;
    this.events.push(["click", "onElementClick", data.clickElement]);
    let template = this.render("html-list-select", data);
    //load first set
    $("select", template).change();
    return template;
  }
}

class LinkInput extends TextInput {
  events = [["change", "onChange", "input"]];
  /*
	setValue(value) {
		//value = value.replace(/(?<!\/)www\./, 'https://www.');
		$('input', this.element).val(value);
	}
	*/
  get html() {
    let data = this.data;
    return this.render("textinput", data);
  }
}

class DateInput extends TextInput {
  events = [["change", "onChange", "input"]];

  get html() {
    let data = this.data;
    return this.render("dateinput", data);
  }
}

class RangeInput extends Input {
  events = [["change", "onChange", "input"]];

  onChange(event, node) {
    if (event.data && event.data.element) {
      $("[data-input-value]", this.parentNode).val(this.value);
      event.data.element.trigger("propertyChange", [this.value, this]);
    }
  }

  setValue(value) {
    //$('[data-input-value]', this.element).text(value);
    return $("input", this.element).val(value);
  }

  get html() {
    let data = this.data;
    return this.render("rangeinput", data);
  }
}

class NumberInput extends Input {
  events = [["change", "onChange", "input"]];

  get html() {
    let data = this.data;
    return this.render("numberinput", data);
  }
}

class CssUnitInput extends Input {
  number = 0;
  unit = "px";

  events = [
    ["change", "onChange", "select"],
    ["change keyup", "onChange", "input"],
  ];

  onChange(event) {
    if (event.data && event.data.element) {
      let number = $("input", event.data.element).val();
      let unit = $("select", event.data.element).val();
      let input = event.data.input;
      if (this.value != "") input[this.name] = this.value; // this.name = unit or number
      if (unit == "") unit = "px"; //if unit is not set use default px

      let value = "";
      if (unit == "auto") {
        $(event.data.element).addClass("auto");
        value = unit;
      } else {
        $(event.data.element).removeClass("auto");
        value = number + (unit ? unit : "");
      }

      event.data.element.trigger("propertyChange", [value, this]);
    }
  }

  setValue(value) {
    this.number = parseFloat(value);
    this.unit = value.replace(this.number, "").trim();

    if (this.unit == "auto") $(this.element).addClass("auto");

    $("input", this.element).val(this.number);
    $("select", this.element).val(this.unit);
  }

  get html() {
    let data = this.data;
    return this.render("cssunitinput", data);
  }
}

class ColorInput extends Input {
  //html5 color input only supports setting values as hex colors even if the picker returns only rgb
  rgb2hex(value) {
    if (value) {
      let rgb;
      value = value.trim();

      if (
        (rgb = value.match(
          /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
        ))
      ) {
        return rgb && rgb.length === 4
          ? "#" +
              ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
              ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
              ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2)
          : rgb;
      }
    }

    return value;
  }

  events = [["change", "onChange", "input"]];

  setValue(value) {
    $("input", this.element).val(this.rgb2hex(value));
  }

  get html() {
    let data = this.data;
    return this.render("colorinput", data);
  }
}

class ImageInput extends Input {
  events = [
    ["blur", "onChange", "input[type=text]"],
    ["change", "onUpload", "input[type=file]"],
  ];

  setValue(value) {
    //don't set blob value to avoid slowing down the page
    if (value?.indexOf("data:image") == -1) {
      $('input[type="text"]', this.element).val(value);
    }
  }

  onUpload(event, node) {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = imageIsLoaded;
      reader.readAsDataURL(this.files[0]);
      //reader.readAsBinaryString(this.files[0]);
      let file = this.files[0];
    }

    function imageIsLoaded(e) {
      let image = e.target.result;

      event.data.element.trigger("propertyChange", [image, this]);

      //return;//remove this line to enable php upload

      var formData = new FormData();
      formData.append("file", file);

      $.ajax({
        type: "POST",
        url: "upload.php", //set your server side upload script url
        data: formData,
        processData: false,
        contentType: false,
        success(data) {
          console.log("File uploaded at: ", data);

          //if image is succesfully uploaded set image url
          event.data.element.trigger("propertyChange", [data, this]);

          //update src input
          $('input[type="text"]', event.data.element).val(data);
        },
        error(data) {
          alert(data.responseText);
        },
      });
    }
  }

  get html() {
    let data = this.data;
    return this.render("imageinput", data);
  }
}

class FileUploadInput extends TextInput {
  events = [["blur", "onChange", "input"]];

  get html() {
    let data = this.data;
    return this.render("textinput", data);
  }
}

class RadioInput extends Input {
  events = [["change", "onChange", "input"]];

  setValue(value) {
    if (value && value != "") {
      $("input", this.element).removeAttr("checked");

      var input = $(`input[value="${value}"]`, this.element);
      input.attr("checked", "true").prop("checked", true);
    }
  }

  get html() {
    let data = this.data;
    return this.render("radioinput", data);
  }
}

class RadioButtonInput extends RadioInput {
  get html() {
    let data = this.data;
    return this.render("radiobuttoninput", data);
  }
}

class ToggleInput extends TextInput {
  onChange(event, node) {
    if (event.data && event.data.element) {
      event.data.element.trigger("propertyChange", [
        this.checked
          ? this.getAttribute("data-value-on")
          : this.getAttribute("data-value-off"),
        this,
      ]);
    }
  }

  setValue(value) {
    if (value == $("input", this.element).attr("data-value-on")) {
      $("input", this.element).attr("checked", true);
    } else {
      $("input", this.element).attr("checked", false);
    }
  }

  events = [["change", "onChange", "input"]];

  get html() {
    let data = this.data;
    return this.render("toggle", data);
  }
}

class ValueTextInput extends TextInput {
  events = [["blur", "onChange", "input"]];

  get html() {
    let data = this.data;
    return this.render("textinput", data);
  }
}

class GridLayoutInput extends TextInput {
  events = [["blur", "onChange", "input"]];

  get html() {
    let data = this.data;
    return this.render("textinput", data);
  }
}

class ProductsInput extends TextInput {
  events = [["blur", "onChange", "input"]];

  get html() {
    let data = this.data;
    return this.render("textinput", data);
  }
}

class GridInput extends Input {
  events = [
    ["change", "onChange", "select" /*'select'*/],
    ["click", "onChange", "button" /*'select'*/],
  ];

  setValue(value) {
    $("select", this.element).val(value);
  }

  get html() {
    let data = this.data;
    return this.render("grid", data);
  }
}

class TextValueInput extends Input {
  events = [
    ["blur", "onChange", "input"],
    ["click", "onChange", "button" /*'select'*/],
  ];

  setValue(value) {
    return false;
  }

  get html() {
    let data = this.data;
    return this.render("textvalue", data);
  }
}

class ButtonInput extends Input {
  events = [["click", "onChange", "button" /*'select'*/]];

  setValue(value) {
    $("button", this.element).val(value);
  }

  get html() {
    let data = this.data;
    return this.render("button", data);
  }
}

class SectionInput extends Input {
  events = [["click", "onChange", "button" /*'select'*/]];

  setValue(value) {
    return false;
  }

  get html() {
    let data = this.data;
    return this.render("sectioninput", data);
  }
}

class ListInput extends Input {
  events = [["change", "onChange", "select"]];

  setValue(value) {
    $("select", this.element).val(value);
  }

  get html() {
    let data = this.data;
    return this.render("listinput", data);
  }
}

class AutocompleteInput extends Input {
  events = [["autocomplete.change", "onAutocompleteChange", "input"]];

  onAutocompleteChange(event, value, text) {
    if (event.data && event.data.element) {
      event.data.element.trigger("propertyChange", [value, this]);
    }
  }

  get html() {
    let data = this.data;

    this.element = this.render("textinput", data);

    $("input", this.element).autocomplete(data.url); //using default parameters

    return this.element;
  }
}

class AutocompleteList extends Input {
  events = [["autocompletelist.change", "onAutocompleteChange", "input"]];

  onAutocompleteChange(event, value, text) {
    if (event.data && event.data.element) {
      event.data.element.trigger("propertyChange", [value, this]);
    }
  }

  setValue(value) {
    $("input", this.element).data("autocompleteList").setValue(value);
  }

  get html() {
    let data = this.data;

    this.element = this.render("textinput", data);

    $("input", this.element).autocompleteList(data); //using default parameters

    return this.element;
  }
}

class TagsInput extends Input {
  events = [["tagsinput.change", "onTagsInputChange", "input"]];

  onTagsInputChange(event, value, text) {
    if (event.data && event.data.element) {
      event.data.element.trigger("propertyChange", [value, this]);
    }
  }

  setValue(value) {
    $("input", this.element).data("tagsInput").setValue(value);
  }

  get html() {
    let data = this.data;

    this.element = this.render("tagsinput", data);

    $("input", this.element).tagsInput(data); //using default parameters

    return this.element;
  }
}

class NoticeInput extends Input {
  events = [];

  get html() {
    let data = this.data;
    return this.render("noticeinput", data);
  }
}

window.CodeInput = TextareaInput;
