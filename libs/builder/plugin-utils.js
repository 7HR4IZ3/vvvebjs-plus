class ClipboardPlugin extends Plugin {
    constructor() {
        super();
        this.copiedEl = null;
        this.action = "copy";
    }

    initialize() {
        let self = this;
        let builder = this.builder.Builder;
        // let node = this.builder.Gui.previewPanel.selectBox.node;
        let topPanel = this.builder.Gui.topPanel.node;
        let node = dom.div({ class: "btn-group me-3", role: "group" }).node;
        topPanel.children().get(-2).before(node);

        this.builder.once("gui:node.select", () => {
            $("#copy-button").removeAttr("disabled");
            $("#cut-button").removeAttr("disabled");
        })

        function copyEl(cut = false) {
            let elem = builder.selectedEl || builder.highlighEl;
            self.copiedEl = elem;
            self.action = cut ? "cut" : "copy";
            $("#paste-button").removeAttr("disabled");
        }

        function pasteEl() {
            if (self.copiedEl) {
                let elem = builder.selectedEl || builder.highlighEl;
                let target = (
                    self.action == "cut" ? self.copiedEl : self.copiedEl.clone()
                );
                elem.after(target);

                let node = elem.get(0);
                self.builder.Undo.addMutation({
                    type: "childList",
                    target: node.parentNode,
                    addedNodes: [target.get(0)],
                    removedNodes: self.action == "cut" ? [node] : [],
                    nextSibling: node.nextSibling,
                });
            }
        }

        node.append(
            dom.button(
                {
                    id: "copy-button",
                    href: "#",
                    title: "Copy Element",
                    class: "btn btn-light",
                    ariaPressed: "false",
                    disabled: true,
                    onclick: () => copyEl(),
                },
                dom.i({ class: "la la-copy" })
            ).node
        );

        node.append(
            dom.button(
                {
                    id: "cut-button",
                    href: "#",
                    title: "Cut Element",
                    class: "btn btn-light",
                    ariaPressed: "false",
                    disabled: true,
                    onclick: () => copyEl(true),
                },
                dom.i({ class: "la la-cut" })
            ).node
        );

        node.append(
            dom.button(
                {
                    id: "paste-button",
                    href: "#",
                    title: "Paste Element",
                    class: "btn btn-light",
                    ariaPressed: "false",
                    disabled: true,
                    onclick: pasteEl
                },
                dom.i({ class: "la la-clipboard" })
            ).node
        );


        let Menu = this.builder.Gui.contextMenu;
        let menuItem = new SubMenu("Clipboard", [
            new MenuItem("Copy", { icon: "la la-copy", action: () => copyEl() }),
            new MenuItem("Cut", { icon: "la la-cut", action: () => copyEl(true) }),
            new MenuItem("Paste", { icon: "la la-clipboard", action: () => pasteEl() })
        ])
        Menu.children.push(menuItem)
    }
}

class SearchBarPlugin extends Plugin {
    initialize() {
        let self = this;
        let builder = this.builder.Builder;
        let topPanel = this.builder.Gui.topPanel.node;
        let node = dom.div({ class: "btn-group py-2 col-12 col-md-4", role: "group" }).node;
        topPanel.children().get(3).after(node);

        node.append(
            dom.div({ class: "col" },
                dom.input({
                    class: "form-control hover-fill me-2",
                    type: "search",
                    placeholder: "Search for element (QuerySelector or XPath)",
                    "aria-label": "Search",
                    oninput() {
                        let element;
                        let doc = builder.pages.get(builder.currentPageName).iframe.get(0).contentDocument

                        if (!this.value.startsWith("//")) {

                            try {
                                element = doc.querySelector(this.value);
                            } catch {}

                        } else {
                            try {
                                let res = document.evaluate(
                                    this.value, doc, null,
                                    XPathResult.FIRST_ORDERED_NODE_TYPE
                                );
                                element = res.singleNodeValue;
                            } catch {}
                        }

                        if (element) {
                            builder.selectNode(element);
                            builder.loadNodeComponent(element);
                        }
                    },
                })
            ).node
        );
    }
}
