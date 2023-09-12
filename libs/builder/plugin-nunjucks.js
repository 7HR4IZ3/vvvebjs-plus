
let _ = (str) => dom.template(str, { nunjucks: true })

class NjckVariableComponent extends Component {
    name = "Variable"
    html = dom.njks({ type: "variable", filters: "" }, "MyVariable")
    nodes = [item => (item.tagName == "NJKS" && item.getAttribute("type") == "variable")]

    get properties() {
        return [
            new Property("Name",
                new TextInput({ key: "name", htmlAttr: "innerHTML" })
            ),
            new Property("Filters",
                new TextInput({ key: "filters", htmlAttr: "filters" })
            )
        ]
    }
}

// class TagComponent extends Component {
//     name = "Tag"
//     html = dom.njks({ type: "tag", name: "block", hasEnd: true }, ("Block Content"))
//     nodes = [item => (item.tagName == "NJKS" && item.getAttribute("type") == "tag")]

//     get properties() {
//         return [
//             new Property("Name",
//                 new TextInput({ key: "name", htmlAttr: "name" })
//             )
//         ]
//     }
// }

class NjckBlockComponent extends Component {
    name = "Block"
    html = dom.njks({ type: "tag", name: "block", value: "myBlock", hasEnd: true, appendValue: true },  ("Block Content"))
    nodes = [item => (item.tagName == "NJKS" && item.getAttribute("name") == "block")]

    get properties() {
        return [
            new Property("Name",
                new TextInput({ key: "name", htmlAttr: "name" })
            )
        ]
    }
}

class NjckSetComponent extends Component {
    name = "Set"
    html = dom.njks({ type: "tag", name: "set", value: "myBlock", hasEnd: false },  ("Set Content"))
    nodes = [item => (item.tagName == "NJKS" && item.getAttribute("name") == "set")]

    get properties() {
        return [
            new Property("Value",
                new TextInput({ key: "value", htmlAttr: "value" }),
                {onChange(element, value) {
                    if (value && (value.indexOf("=") != -1)) {element.attr("hasEnd", false)}
                    else {element.attr("hasEnd", true)}
                    return element
                }}
            ),
            new Property("Content",
                new TextareaInput({ key: "content", htmlAttr: "innerHTML" })
            )
        ]
    }
}

class NjckIfComponent extends Component {
    name = "If"
    html = dom.njks({ type: "tag", name: "if", value: "myBlock", hasEnd: true },  ("If Content"))
    nodes = [item => (item.tagName == "NJKS" && item.getAttribute("name") == "if")]

    get properties() {
        return [
            new Property("Value",
                new TextInput({ key: "value", htmlAttr: "value" })
            ),
            new Property("Content",
                new TextareaInput({ key: "content", htmlAttr: "innerHTML" })
            )
        ]
    }
}

class NjckElseComponent extends Component {
    name = "Else"
    html = dom.njks({ type: "tag", name: "else", value: "", hasEnd: false },  ("Else Content"))
    nodes = [item => (item.tagName == "NJKS" && item.getAttribute("name") == "else")]

    get properties() {
        return [
            new Property("Content",
                new TextareaInput({ key: "content", htmlAttr: "innerHTML" })
            )
        ]
    }
}

class NjckElifComponent extends Component {
    name = "Elif"
    html = dom.njks({ type: "tag", name: "elif", value: "", hasEnd: false },  ("Else Content"))
    nodes = [item => (item.tagName == "NJKS" && item.getAttribute("name") == "elif")]

    get properties() {
        return [
            new Property("Content",
                new TextareaInput({ key: "content", htmlAttr: "innerHTML" })
            )
        ]
    }
}

class NjckForComponent extends Component {
    name = "For"
    html = dom.njks({ type: "tag", name: "for", value: "item in names", hasEnd: true },  ("item.name"))
    nodes = [item => (item.tagName == "NJKS" && item.getAttribute("name") == "for")]

    get properties() {
        return [
            new Property("Value",
                new TextInput({ key: "value", htmlAttr: "value" })
            ),
            new Property("Content",
                new TextareaInput({ key: "content", htmlAttr: "innerHTML" })
            )
        ]
    }
}

class NjckAsyncEachComponent extends Component {
    name = "AsyncEach"
    html = dom.njks({ type: "tag", name: "asyncEach", value: "myBlock", hasEnd: true },  ("AsyncEach Content"))
    nodes = [item => (item.tagName == "NJKS" && item.getAttribute("name") == "asyncEach")]

    get properties() {
        return [
            new Property("Value",
                new TextInput({ key: "value", htmlAttr: "value" })
            ),
            new Property("Content",
                new TextareaInput({ key: "content", htmlAttr: "innerHTML" })
            )
        ]
    }
}

class NjckAsyncAllComponent extends Component {
    name = "AsyncAll"
    html = dom.njks({ type: "tag", name: "asyncAll", value: "myBlock", hasEnd: true },  ("AsyncAll Content"))
    nodes = [item => (item.tagName == "NJKS" && item.getAttribute("name") == "asyncAll")]

    get properties() {
        return [
            new Property("Value",
                new TextInput({ key: "value", htmlAttr: "value" })
            ),
            new Property("Content",
                new TextareaInput({ key: "content", htmlAttr: "innerHTML" })
            )
        ]
    }
}

class NjckMacroComponent extends Component {
    name = "Macro"
    html = dom.njks({ type: "tag", name: "macro", value: "myBlock", hasEnd: true },  ("Macro Content"))
    nodes = [item => (item.tagName == "NJKS" && item.getAttribute("name") == "macro")]

    get properties() {
        return [
            new Property("Value",
                new TextInput({ key: "value", htmlAttr: "value" })
            ),
            new Property("Content",
                new TextareaInput({ key: "content", htmlAttr: "innerHTML" })
            )
        ]
    }
}

class NjckExtendsComponent extends Component {
    name = "Extends"
    html = dom.njks({ type: "tag", name: "extends", hasEnd: false },  ("Extends"))
    nodes = [item => (item.tagName == "NJKS" && item.getAttribute("name") == "extends")]

    get properties() {
        return [
            new Property("Value",
                new TextInput({ key: "value", htmlAttr: "innerHTML" })
            )
        ]
    }
}

class NjckIncludeComponent extends Component {
    name = "Include"
    html = dom.njks({ type: "tag", name: "include", hasEnd: false },  ("Include"))
    nodes = [item => (item.tagName == "NJKS" && item.getAttribute("name") == "include")]

    get properties() {
        return [
            new Property("Value",
                new TextInput({ key: "value", htmlAttr: "innerHTML" })
            ),
            new Property("Ignore Missing",
                new CheckBoxInput({ key: "ignore", on: "true", off: "false" }),
                {onChange(element, value) {
                    if (value == "true") {element.attr("filters", "ignore missing")}
                    else {element.removeAttr("filters")}
                    return element
                }}
            )
        ]
    }
}

class NunjucksComponents extends ComponentGroup {
    name = "Nunjucks"
    prefix = "njks"

    variable = new NjckVariableComponent;
    block = new NjckBlockComponent;
    set = new NjckSetComponent;
    if = new NjckIfComponent;
    else = new NjckElseComponent;
    elif = new NjckElifComponent;
    for = new NjckForComponent;
    asyncEach = new NjckAsyncEachComponent;
    asyncAll = new NjckAsyncAllComponent;
    macro = new NjckMacroComponent;
    extends = new NjckExtendsComponent;
    include = new NjckIncludeComponent;
}

class NunjucksConfig extends Plugin {
    name = "Nunjucks Config"

    constructor(config) {
        super();
        this.config = config;
    }

    get properties() {
        return [
            new Property("Context",
                new CodeInput({ key: "context", config: {
                    mode: "application/json",
                    lineNumbers: false,
                    matchBrackets: true,
                    autoCloseBrackets: true,
                }, defaultValue: JSON.stringify(this.config.context || {}) }),
                { col: 12, onChange(element, value) {
                    try {this.config.context = JSON.parse(value || "null")}
                    catch (err) {}
                }}
            )
        ]
    }
}

class NunjucksPlugin extends Plugin {
    constructor(config) {
        super()
        this.config = (config || {});
    }

    initialize() {
        nunjucks.configure({ autoescape: true, ...this.config });
        this.builder.once("gui.init", () => {
            this.builder.Gui.pageProperties.install(new NunjucksConfig(this.config))
            this.builder.Gui.addPreviewManager("nunjucks", this.prepareHtml());
            // this.builder.Gui.setPreviewHandler([".njks"], "nunjucks");
            this.builder.Gui.setPreviewManager("nunjucks");
        });
        this.builder.config.components.push(new NunjucksComponents);
    }

    prepareHtml() {
        let _this = this;
        return (data, compile=true) => {
            this.compile(data)
            console.log(data.outerHTML)
            if (compile) {
                return nunjucks.renderString(data.outerHTML, _this.getContext());
            } else {
                let script = data.appendChild(document.createElement("script"));
                script.innerText = `let context = ${JSON.stringify(_this.getContext())};\nnunjucks.renderString(document.querySelector('body'), context)`
                return data.outerHTML
            }
        }
    }

    compile(data) {
        let _this = this;
        [...data.querySelectorAll("njks")].reverse().forEach(item => {
            console.log(item)
            _this.buildElement(item);
            _this.compile(item);
        })
    }

    getContext() {
        return this.config.context || { name: "Thraize", names: [
            { name: "Ian" }, { name: "Thraize" }
        ] }
    }

    buildElement(element) {
        element = $(element);
        let parent = element.parent();
        let type = element.attr("type")
        if (type === "variable") {
            let inner = `${element.html()}`
            let filters = element.attr("filters");
            if (filters) { inner = inner + ` ${filters}` }
            element.before($(document.createTextNode("{{ ")))
            element.before($(document.createTextNode(inner)))
            element.before($(document.createTextNode(" }}")))
        } else if (type === "tag") {
            let html;
            let name = element.attr("name");
            let value = element.attr("value") || element.attr("innerHTML");
            let hasEnd = element.attr("hasEnd");
            let appendValue = element.attr("appendValue") || false;
            let filters = element.attr("filters") || "";

            element.before(
                $(document.createTextNode(
                    `{% ${name} ${value} ${' '+filters ? filters : ''} %}`
                ))
            );

            if (hasEnd && hasEnd !== "false") {
                if ((html = element.html())) {
                    element.before($(html))
                }
                element.before(
                    $(document.createTextNode(
                        ` {% end${name} ${appendValue ? value : ''} %}`
                    ))
                );
            }
        }
        element.remove();
    }
}
