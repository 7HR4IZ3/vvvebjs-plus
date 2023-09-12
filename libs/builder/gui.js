const BuilderUI = (ui_id = null) =>
  dom.main(
    dom.section(
      dom.div(
        dom.img({
          src: "img/logo.png",
          alt: "Vvveb",
          class: "float-start",
          id: "logo",
        }),
        dom.div(
          dom.button(
            dom.img({
              src: "libs/builder/icons/left-column-layout.svg",
              width: "20px",
              height: "20px",
            }),
            {
              class: "btn btn-light",
              title: "Toggle left column",
              id: "toggle-left-column-btn",
              "data-vvveb-action": "toggleLeftColumn",
              "data-bs-toggle": "offcanvas",
              "data-bs-target": "#left-sidebar",
              "aria-pressed": "false",
            }
          ),
          { class: "btn-group float-start", role: "group" }
        ),
        dom.div(
          dom.button(dom.i({ class: "la la-undo" }), {
            class: "btn btn-light",
            title: "Undo (Ctrl/Cmd + Z)",
            id: "undo-btn",
            "data-vvveb-action": "undo",
            "data-vvveb-shortcut": "ctrl+z",
          }),
          dom.button(dom.i({ class: "la la-undo la-flip-horizontal" }), {
            class: "btn btn-light",
            title: "Redo (Ctrl/Cmd + Shift + Z)",
            id: "redo-btn",
            "data-vvveb-action": "redo",
            "data-vvveb-shortcut": "ctrl+shift+z",
          }),
          { class: "btn-group me-3", role: "group" }
        ),
        dom.div(
          dom.button(dom.i({ class: "la la-hand-rock" }), {
            class: "btn btn-light",
            title: "Designer Mode (Free component dragging)",
            id: "designer-mode-btn",
            "data-bs-toggle": "button",
            "aria-pressed": "false",
            "data-vvveb-action": "setDesignerMode",
          }),
          dom.button(dom.i({ class: "la la-eye" }), {
            class: "btn btn-light",
            title: "Preview",
            id: "preview-btn",
            type: "button",
            "data-bs-toggle": "button",
            "aria-pressed": "false",
            "data-vvveb-action": "preview",
          }),
          dom.button(dom.i({ class: "la la-expand" }), {
            id: "toggle-resize-btn",
            class: "btn btn-light",
            "data-bs-toggle": "button",
            "aria-pressed": "false",
            title: "Allow resizable elements",
          }),
          dom.button(dom.i({ class: "la la-expand-arrows-alt" }), {
            class: "btn btn-light",
            title: "Fullscreen (F11)",
            id: "fullscreen-btn",
            "data-bs-toggle": "button",
            "aria-pressed": "false",
            "data-vvveb-action": "fullscreen",
          }),
          dom.button(dom.i({ class: "la la-download" }), {
            class: "btn btn-light",
            title: "Download",
            id: "download-btn",
            "data-vvveb-action": "download",
            "data-v-download": "index.html",
          }),
          { class: "btn-group me-3", role: "group" }
        ),
        dom.div(
          dom.button(
            dom.span(
              dom.i({ class: "la la-save" }),
              dom.span({
                class: "spinner-border spinner-border-sm align-middle",
                role: "status",
                "aria-hidden": "true",
              }),
              dom.span("Saving"),
              "...",
              { class: "loading d-none" }
            ),
            dom.span(dom.i({ class: "la la-save" }), { class: "button-text" }),
            {
              class: "btn btn-primary btn-icon mb-1",
              title: "Export (Ctrl + E)",
              id: "save-btn",
              "data-vvveb-action": "saveAjax",
              "data-vvveb-url": "save.php",
              "data-v-vvveb-shortcut": "ctrl+e",
            }
          ),
          { class: "btn-group me-3 float-end", role: "group" }
        ),
        dom.div(
          dom.button(dom.i({ class: "la la-sun la-lg" }), {
            class: "btn btn-light border-0 btn-sm btn-dark-mode",
            "data-vvveb-action": "toggleMode",
          }),
          dom.a(dom.i({ class: "la la-external-link-alt la-lg" }), {
            href: "#",
            class: "btn btn-outline-primary border-0 btn-sm btn-preview-url",
            target: "blank",
            title: "View page",
          }),
          dom.div(
            dom.button(dom.i({ class: "la la-tv" }), {
              class: "btn dropdown-toggle",
              type: "button",
              "data-bs-toggle": "dropdown",
              "aria-expanded": "false",
              title: "Viewport",
            }),
            dom.ul(
              dom.li(
                dom.button(dom.i({ class: "la la-desktop" }), "Auto", {
                  id: "auto-view",
                  "data-view": "auto",
                  class: "dropdown-item btn btn-light",
                  title: "Default view",
                  "data-vvveb-action": "viewport",
                })
              ),
              dom.li(
                dom.button(dom.i({ class: "la la-mobile" }), "Mobile", {
                  id: "mobile-view",
                  "data-view": "mobile",
                  class: "dropdown-item btn btn-light",
                  title: "Mobile view",
                  "data-vvveb-action": "viewport",
                })
              ),
              dom.li(
                dom.button(dom.i({ class: "la la-tablet" }), "Tablet", {
                  id: "tablet-view",
                  "data-view": "tablet",
                  class: "dropdown-item btn btn-light",
                  title: "Tablet view",
                  "data-vvveb-action": "viewport",
                })
              ),
              dom.li(
                dom.button(dom.i({ class: "la la-laptop" }), "Desktop", {
                  id: "desktop-view",
                  "data-view": "",
                  class: "dropdown-item btn btn-light",
                  title: "Desktop view",
                  "data-vvveb-action": "viewport",
                })
              ),
              { class: "dropdown-menu" }
            ),
            { class: "dropdown btn-group" }
          ),
          { class: "float-end me-3 my-auto" }
        ),
        {
          id: "top-panel",
          class: "d-flex flex-row justify-content-between col-sm-12 flex-wrap",
        }
      ),
      { id: "vvveb-head-section" }
    ),
    dom.section(
      dom.div(
        dom.div(
          dom.div(
            dom.div(
              dom.div(
                dom.ul(
                  dom.li(
                    dom.a(dom.i({ class: "la la-folder" }), {
                      class: "nav-link active",
                      id: "files-tab",
                      "data-bs-toggle": "tab",
                      href: "#files",
                      role: "tab",
                      "aria-controls": "files",
                      "aria-selected": "true",
                      title: "Files",
                    }),
                    { class: "nav-item d-flex align-items-center files-tab" }
                  ),
                  dom.li(
                    dom.a(dom.i({ class: "la la-stream" }), {
                      class: "nav-link",
                      id: "sections-tab",
                      "data-bs-toggle": "tab",
                      href: "#sections",
                      role: "tab",
                      "aria-controls": "sections",
                      "aria-selected": "true",
                      title: "Sections",
                    }),
                    { class: "nav-item d-flex align-items-center sections-tab" }
                  ),
                  dom.li(
                    dom.a(dom.i({ class: "la la-box" }), {
                      class: "nav-link",
                      id: "components-tab",
                      "data-bs-toggle": "tab",
                      href: "#components-tabs",
                      role: "tab",
                      "aria-controls": "components",
                      "aria-selected": "false",
                      title: "Components",
                    }),
                    {
                      class: "nav-item d-flex align-items-center component-tab",
                    }
                  ),
                  dom.li(
                    dom.a(dom.i({ class: "la la-cog" }), {
                      class: "nav-link",
                      id: "properties-tab",
                      "data-bs-toggle": "tab",
                      href: "#properties",
                      role: "tab",
                      "aria-controls": "properties",
                      "aria-selected": "false",
                      title: "Properties",
                    }),
                    {
                      class:
                        "nav-item d-flex align-items-center component-properties-tab",
                      style: "display: none",
                    }
                  ),
                  dom.li(
                    dom.a(dom.i({ class: "la la-tools" }), {
                      class: "nav-link",
                      id: "configuration-tab",
                      "data-bs-toggle": "tab",
                      href: "#configuration",
                      role: "tab",
                      "aria-controls": "configuration",
                      "aria-selected": "false",
                      title: "Configuration",
                    }),
                    {
                      class:
                        "nav-item d-flex align-items-center component-configuration-tab",
                    }
                  ),
                  {
                    class: "nav nav-tabs justify-content-center",
                    id: "elements-tabs",
                    role: "tablist",
                  }
                ),
                dom.div(
                  dom.div(
                    dom.div(
                      dom.div(
                        dom.span(
                          dom.i({ class: "la la-file la-lg" }),
                          "Editors",
                          { class: "text-secondary" }
                        ),
                        { class: "header d-flex justify-content-between align-items-center pt-2" }
                      ),
                      dom.div(dom.ol(), { class: "tree" }),
                      {
                        id: "editormanager",
                        class: "filemanager d-flex flex-column",
                      }
                    ),
                    dom.div(
                      dom.div(
                        dom.span(
                          dom.i({ class: "la la-file la-lg" }),
                          "Pages",
                          {
                            class: "text-secondary",
                          }
                        ),
                        dom.div(
                          dom.button(
                            dom.span("New page"),
                            dom.i({ class: "la la-plus" }),
                            {
                              class: "btn btn-outline-primary btn-sm border-0",
                              title: "New file",
                              id: "new-file-btn",
                              "data-vvveb-action": "newPage",
                              "data-vvveb-shortcut": "",
                            }
                          ),
                          {
                            class: "btn-group responsive-btns me-1 float-end",
                            role: "group",
                          }
                        ),
                        { class: "header d-flex justify-content-between align-items-center pt-2" }
                      ),
                      dom.div(dom.ol(), { class: "tree" }),
                      {
                        id: "filemanager",
                        class: "filemanager d-flex flex-column",
                      }
                    ),
                    {
                      class: "tab-pane show active files",
                      id: "files",
                      role: "tabpanel",
                      "aria-labelledby": "files-tab",
                    }
                  ),
                  dom.div(
                    dom.ul(
                      dom.li(
                        dom.a(
                          dom.i({ class: "la la-plus" }),
                          dom.div(dom.span("Add section")),
                          {
                            class: "nav-link active",
                            "data-bs-toggle": "tab",
                            href: "#sections-new-tab",
                            role: "tab",
                            "aria-controls": "components",
                            "aria-selected": "false",
                          }
                        ),
                        { class: "nav-item content-tab" }
                      ),
                      dom.li(
                        dom.a(
                          dom.i({ class: "la la-th-list" }),
                          dom.div(dom.span("Page Sections")),
                          {
                            class: "nav-link",
                            "data-bs-toggle": "tab",
                            href: "#sections-list",
                            role: "tab",
                            "aria-controls": "sections",
                            "aria-selected": "true",
                          }
                        ),
                        { class: "nav-item style-tab" }
                      ),
                      {
                        class: "nav nav-tabs nav-fill sections-tabs",
                        id: "properties-tabs",
                        role: "tablist",
                      }
                    ),
                    dom.div(
                      dom.div(
                        dom.div(
                          dom.div(
                            dom.div(
                              dom.div(
                                dom.div(
                                  dom.div({ class: "handle" }),
                                  dom.div(
                                    dom.div(dom.div({ class: "type" }), {
                                      class: "name",
                                    }),
                                    { class: "info" }
                                  ),
                                  { class: "controls" }
                                ),
                                { class: "section-item", draggable: "true" }
                              ),
                              dom.div(
                                dom.div(
                                  dom.div({ class: "handle" }),
                                  dom.div(
                                    dom.div(dom.div({ class: "type" }), {
                                      class: "name",
                                    }),
                                    { class: "info" }
                                  ),
                                  { class: "controls" }
                                ),
                                { class: "section-item", draggable: "true" }
                              ),
                              dom.div(
                                dom.div(
                                  dom.div({ class: "handle" }),
                                  dom.div(
                                    dom.div(dom.div({ class: "type" }), {
                                      class: "name",
                                    }),
                                    { class: "info" }
                                  ),
                                  { class: "controls" }
                                ),
                                { class: "section-item", draggable: "true" }
                              ),
                              { class: "sections-container p-4" }
                            )
                          ),
                          { class: "drag-elements-sidepane sidepane" }
                        ),
                        {
                          class: "tab-pane",
                          id: "sections-list",
                          "data-section": "style",
                          role: "tabpanel",
                          "aria-labelledby": "style-tab",
                        }
                      ),
                      dom.div(
                        dom.div(
                          dom.div(
                            dom.button(dom.i({ class: "la la-plus" }), {
                              class: "text-sm",
                              title: "Expand All",
                              "data-vvveb-action": "expand",
                            }),
                            dom.button(dom.i({ class: "la la-minus" }), {
                              title: "Collapse all",
                              "data-vvveb-action": "collapse",
                            }),
                            { class: "expand" }
                          ),
                          dom.input({
                            class: "form-control section-search",
                            placeholder: "Search sections",
                            type: "text",
                            "data-vvveb-action": "search",
                            "data-vvveb-on": "keyup",
                          }),
                          dom.button(dom.i({ class: "la la-times" }), {
                            class: "clear-backspace",
                            "data-vvveb-action": "clearSearch",
                            title: "Clear search",
                          }),
                          { class: "search" }
                        ),
                        dom.div(
                          dom.div(
                            dom.img({ src: "", style: "display: none" }),
                            {
                              class: "block-preview",
                            }
                          ),
                          dom.div(
                            dom.ul({
                              class: "sections-list clearfix",
                              "data-type": "leftpanel",
                            })
                          ),
                          { class: "drag-elements-sidepane sidepane" }
                        ),
                        {
                          class: "tab-pane show active",
                          id: "sections-new-tab",
                          "data-section": "content",
                          role: "tabpanel",
                          "aria-labelledby": "content-tab",
                        }
                      ),
                      { class: "tab-content" }
                    ),
                    {
                      class: "tab-pane show sections",
                      id: "sections",
                      role: "tabpanel",
                      "aria-labelledby": "sections-tab",
                    }
                  ),
                  dom.div(
                    dom.ul(
                      dom.li(
                        dom.a(
                          dom.i({ class: "la la-box" }),
                          dom.div(dom.span("Components")),
                          {
                            class: "nav-link active",
                            "data-bs-toggle": "tab",
                            href: "#components",
                            role: "tab",
                            "aria-controls": "components",
                            "aria-selected": "true",
                          }
                        ),
                        { class: "nav-item components-tab" }
                      ),
                      dom.li(
                        dom.a(
                          dom.i({ class: "la la-copy" }),
                          dom.div(dom.span("Blocks")),
                          {
                            class: "nav-link",
                            "data-bs-toggle": "tab",
                            href: "#blocks",
                            role: "tab",
                            "aria-controls": "components",
                            "aria-selected": "false",
                          }
                        ),
                        { class: "nav-item blocks-tab" }
                      ),
                      {
                        class: "nav nav-tabs nav-fill sections-tabs",
                        role: "tablist",
                      }
                    ),
                    dom.div(
                      dom.div(
                        dom.div(
                          dom.div(
                            dom.button(dom.i({ class: "la la-plus" }), {
                              class: "text-sm",
                              title: "Expand All",
                              "data-vvveb-action": "expand",
                            }),
                            dom.button(dom.i({ class: "la la-minus" }), {
                              title: "Collapse all",
                              "data-vvveb-action": "collapse",
                            }),
                            { class: "expand" }
                          ),
                          dom.input({
                            class: "form-control component-search",
                            placeholder: "Search components",
                            type: "text",
                            "data-vvveb-action": "search",
                            "data-vvveb-on": "keyup",
                          }),
                          dom.button(dom.i({ class: "la la-times" }), {
                            class: "clear-backspace",
                            "data-vvveb-action": "clearSearch",
                          }),
                          { class: "search" }
                        ),
                        dom.div(
                          dom.div(
                            dom.ul({
                              class: "components-list clearfix",
                              "data-type": "leftpanel",
                            })
                          ),
                          { class: "drag-elements-sidepane sidepane" }
                        ),
                        {
                          class: "tab-pane show active components",
                          id: "components",
                          "data-section": "components",
                          role: "tabpanel",
                          "aria-labelledby": "components-tab",
                        }
                      ),
                      dom.div(
                        dom.div(
                          dom.div(
                            dom.button(dom.i({ class: "la la-plus" }), {
                              class: "text-sm",
                              title: "Expand All",
                              "data-vvveb-action": "expand",
                            }),
                            dom.button(dom.i({ class: "la la-minus" }), {
                              title: "Collapse all",
                              "data-vvveb-action": "collapse",
                            }),
                            { class: "expand" }
                          ),
                          dom.input({
                            class: "form-control block-search",
                            placeholder: "Search blocks",
                            type: "text",
                            "data-vvveb-action": "search",
                            "data-vvveb-on": "keyup",
                          }),
                          dom.button(dom.i({ class: "la la-times" }), {
                            class: "clear-backspace",
                            "data-vvveb-action": "clearSearch",
                          }),
                          { class: "search" }
                        ),
                        dom.div(
                          dom.div(dom.img({ src: "" }), {
                            class: "block-preview",
                          }),
                          dom.div(
                            dom.ul({
                              class: "blocks-list clearfix",
                              "data-type": "leftpanel",
                            })
                          ),
                          { class: "drag-elements-sidepane sidepane" }
                        ),
                        {
                          class: "tab-pane show active blocks",
                          id: "blocks",
                          "data-section": "content",
                          role: "tabpanel",
                          "aria-labelledby": "content-tab",
                        }
                      ),
                      { class: "tab-content" }
                    ),
                    {
                      class: "tab-pane show",
                      id: "components-tabs",
                      role: "tabpanel",
                      "aria-labelledby": "components-tab",
                    }
                  ),
                  dom.div(
                    dom.div(
                      dom.div(
                        dom.div(
                          dom.ul(
                            dom.li(
                              dom.a(
                                dom.i({ class: "la la-lg la-sliders-h" }),
                                dom.div(dom.span("Content")),
                                {
                                  class: "nav-link content-tab active",
                                  "data-bs-toggle": "tab",
                                  href: "#content-left-panel-tab",
                                  role: "tab",
                                  "aria-controls": "components",
                                  "aria-selected": "true",
                                }
                              ),
                              { class: "nav-item content-tab" }
                            ),
                            dom.li(
                              dom.a(
                                dom.i({ class: "la la-lg la-paint-brush" }),
                                dom.div(dom.span("Style")),
                                {
                                  class: "nav-link",
                                  "data-bs-toggle": "tab",
                                  href: "#style-left-panel-tab",
                                  role: "tab",
                                  "aria-controls": "style",
                                  "aria-selected": "false",
                                }
                              ),
                              { class: "nav-item style-tab" }
                            ),
                            dom.li(
                              dom.a(
                                dom.i({ class: "la la-lg la-tools" }),
                                dom.div(dom.span("Advanced")),
                                {
                                  class: "nav-link",
                                  "data-bs-toggle": "tab",
                                  href: "#advanced-left-panel-tab",
                                  role: "tab",
                                  "aria-controls": "advanced",
                                  "aria-selected": "false",
                                }
                              ),
                              { class: "nav-item advanced-tab" }
                            ),
                            {
                              class: "nav nav-tabs nav-fill",
                              id: "properties-tabs",
                              role: "tablist",
                            }
                          ),
                          dom.div(
                            dom.div(
                              dom.div(
                                dom.button({
                                  type: "button",
                                  class: "btn-close",
                                  "data-bs-dismiss": "alert",
                                  "aria-label": "Close",
                                }),
                                dom.strong("No selected element!"),
                                dom.br(),
                                "Click on an element to edit.",
                                {
                                  class:
                                    "alert alert-dismissible fade show alert-light m-3",
                                  role: "alert",
                                }
                              ),
                              {
                                class: "tab-pane show active",
                                id: "content-left-panel-tab",
                                "data-section": "content",
                                role: "tabpanel",
                                "aria-labelledby": "content-tab",
                              }
                            ),
                            dom.div({
                              class: "tab-pane show",
                              id: "style-left-panel-tab",
                              "data-section": "style",
                              role: "tabpanel",
                              "aria-labelledby": "style-tab",
                            }),
                            dom.div({
                              class: "tab-pane show",
                              id: "advanced-left-panel-tab",
                              "data-section": "advanced",
                              role: "tabpanel",
                              "aria-labelledby": "advanced-tab",
                            }),
                            { class: "tab-content" }
                          ),
                          {
                            class: "component-properties",
                            style: "height: 90vh",
                          }
                        )
                      ),
                      { class: "component-properties-sidepane" }
                    ),
                    {
                      class: "tab-pane",
                      id: "properties",
                      role: "tabpanel",
                      "aria-labelledby": "properties-tab",
                    }
                  ),
                  dom.div(
                    dom.div(
                      dom.div(
                        dom.div(
                          dom.input({
                            class: "header_check",
                            type: "checkbox",
                            checked: "true",
                            id: "header_pallette",
                          }),
                          dom.div(
                            dom.div(
                              dom.label("Background Color", {
                                class: "form-label",
                                for: "input-model",
                              }),
                              dom.div(
                                dom.div(
                                  dom.input({
                                    name: "background-color",
                                    type: "color",
                                    pattern: "#[a-f0-9]{6}",
                                    class: "form-control form-control-color",
                                  })
                                ),
                                { class: "input" }
                              ),
                              {
                                class: "mb-3 col-sm-6 inline",
                                "data-key": "background-color",
                              }
                            ),
                            dom.div(
                              dom.label("Background Color", {
                                class: "form-label",
                                for: "input-model",
                              }),
                              dom.div(
                                dom.div(
                                  dom.input({
                                    name: "background-color",
                                    type: "color",
                                    pattern: "#[a-f0-9]{6}",
                                    class: "form-control form-control-color",
                                  })
                                ),
                                { class: "input" }
                              ),
                              {
                                class: "mb-3 col-sm-6 inline",
                                "data-key": "background-color",
                              }
                            ),
                            {
                              class: "tab-pane section px-0",
                              "data-section": "content",
                            }
                          ),
                          { class: "component-properties" }
                        )
                      ),
                      { class: "drag-elements-sidepane sidepane" }
                    ),
                    {
                      class: "tab-pane",
                      id: "configuration",
                      role: "tabpanel",
                      "aria-labelledby": "configuration-tab",
                    }
                  ),
                  { class: "tab-content", style: "width: 80%; height: 90vh" }
                ),
                { class: "header d-flex" }
              ),
              { class: "drag-elements" }
            ),
            {
              id: "left-panel",
              class: "",
              style: "position: unset; float: none",
            }
          ),
          {
            id: "left-sidebar",
            class:
              "d-flex flex-column col-sm col-md-3 px-0 offcanvas-md offcanvas-start",
          }
        ),
        dom.div(
          dom.div(
            dom.div(
              dom.div({ id: "editors", class: "d-flex flex-row" }),
              dom.div(
                dom.div(
                  dom.div(
                    dom.div({ class: "dot dot-1" }),
                    dom.div({ class: "dot dot-2" }),
                    dom.div({ class: "dot dot-3" }),
                    { class: "animation-container" }
                  ),
                  dom.svg(
                    dom.defs(
                      dom.filter(
                        dom.fegaussianblur({
                          in: "SourceGraphic",
                          stddeviation: "10",
                          result: "blur",
                        }),
                        dom.fecolormatrix({
                          in: "blur",
                          mode: "matrix",
                          values:
                            "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7",
                        }),
                        { id: "goo" }
                      )
                    ),
                    { xmlns: "http://www.w3.org/2000/svg", version: "1.1" }
                  ),
                  { class: "loading-message active" }
                ),
                dom.div(
                  dom.div({ id: "highlight-name" }),
                  dom.div(
                    dom.a(dom.i({ class: "la la-plus" }), {
                      id: "add-section-btn",
                      href: "",
                      title: "Add element",
                    }),
                    { id: "section-actions" }
                  ),
                  { id: "highlight-box" }
                ),
                dom.div(
                  dom.div(
                    dom.a(
                      dom.svg(
                        dom.path({
                          "clip-rule": "evenodd",
                          d: "M56 40V216H148C176.719 216 200 192.719 200 164C200 147.849 192.637 133.418 181.084 123.88C187.926 115.076 192 104.014 192 92C192 63.2812 168.719 40 140 40H56ZM88 144V184H148C159.046 184 168 175.046 168 164C168 152.954 159.046 144 148 144H88ZM88 112V72H140C151.046 72 160 80.9543 160 92C160 103.046 151.046 112 140 112H88Z",
                          fill: "#252525",
                          "fill-rule": "evenodd",
                        }),
                        {
                          height: "24",
                          viewbox: "0 0 256 256",
                          width: "24",
                          xmlns: "http://www.w3.org/2000/svg",
                        }
                      ),
                      { id: "bold-btn", href: "", title: "Bold" }
                    ),
                    dom.a(
                      dom.svg(
                        dom.path({
                          d: "M202 40H84V64H126.182L89.8182 192H54V216H172V192H129.818L166.182 64H202V40Z",
                          fill: "#252525",
                        }),
                        {
                          height: "24",
                          viewbox: "0 0 256 256",
                          width: "24",
                          xmlns: "http://www.w3.org/2000/svg",
                        }
                      ),
                      { id: "italic-btn", href: "", title: "Italic" }
                    ),
                    dom.a(
                      dom.svg(
                        dom.path({
                          "clip-rule": "evenodd",
                          d: "M88 40H60V108.004C60 145.56 90.4446 176.004 128 176.004C165.555 176.004 196 145.56 196 108.004V40H168V108C168 130.091 150.091 148 128 148C105.909 148 88 130.091 88 108V40ZM204 216V192H52V216H204Z",
                          fill: "#252525",
                          "fill-rule": "evenodd",
                        }),
                        {
                          height: "24",
                          viewbox: "0 0 256 256",
                          width: "24",
                          xmlns: "http://www.w3.org/2000/svg",
                        }
                      ),
                      { id: "underline-btn", href: "", title: "Underline" }
                    ),
                    dom.a(
                      dom.svg(
                        dom.path({
                          d: "M6,4h8a4,4,0,0,1,4,4h0a4,4,0,0,1-4,4H6Z",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "3",
                        }),
                        dom.path({
                          d: "M6,12h9a4,4,0,0,1,4,4h0a4,4,0,0,1-4,4H6Z",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "3",
                        }),
                        {
                          height: "18",
                          viewbox: "0 0 24 24",
                          width: "18",
                          xmlns: "http://www.w3.org/2000/svg",
                        }
                      ),
                      {
                        id: "bold-btn",
                        class: "hint",
                        href: "",
                        title: "Bold",
                        "aria-label": "Bold",
                      }
                    ),
                    dom.a(
                      dom.svg(
                        dom.line({
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          x1: "19",
                          x2: "10",
                          y1: "4",
                          y2: "4",
                        }),
                        dom.line({
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          x1: "14",
                          x2: "5",
                          y1: "20",
                          y2: "20",
                        }),
                        dom.line({
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          x1: "15",
                          x2: "9",
                          y1: "4",
                          y2: "20",
                        }),
                        {
                          height: "18",
                          viewbox: "0 0 24 24",
                          width: "18",
                          xmlns: "http://www.w3.org/2000/svg",
                        }
                      ),
                      {
                        id: "italic-btn",
                        class: "hint",
                        href: "",
                        title: "Italic",
                        "aria-label": "Italic",
                      }
                    ),
                    dom.a(
                      dom.svg(
                        dom.path({
                          d: "M6,4v7a6,6,0,0,0,6,6h0a6,6,0,0,0,6-6V4",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          y1: "2",
                          y2: "2",
                        }),
                        dom.line({
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          x1: "4",
                          x2: "20",
                          y1: "22",
                          y2: "22",
                        }),
                        {
                          height: "18",
                          viewbox: "0 0 24 24",
                          width: "18",
                          xmlns: "http://www.w3.org/2000/svg",
                        }
                      ),
                      {
                        id: "underline-btn",
                        class: "hint",
                        href: "",
                        title: "Underline",
                        "aria-label": "Underline",
                      }
                    ),
                    dom.a(dom.del("S"), {
                      id: "strike-btn",
                      class: "hint",
                      href: "",
                      title: "Strikeout",
                      "aria-label": "Strikeout",
                    }),
                    dom.div(
                      dom.a(
                        dom.span(dom.i({ class: "la la-align-left" }), {
                          class: "hint",
                          "aria-label": "Text align",
                        }),
                        {
                          class: "btn btn-link dropdown-toggle",
                          type: "button",
                          id: "dropdownMenuButton",
                          "data-bs-toggle": "dropdown",
                          "aria-haspopup": "true",
                          "aria-expanded": "false",
                        }
                      ),
                      dom.div(
                        dom.a(
                          dom.i({ class: "la la-lg la-align-left" }),
                          `Align
                            Left`,
                          {
                            class: "dropdown-item",
                            href: "#",
                            "data-value": "Left",
                          }
                        ),
                        dom.a(
                          dom.i({ class: "la la-lg la-align-center" }),
                          `Align
                            Center`,
                          {
                            class: "dropdown-item",
                            href: "#",
                            "data-value": "Center",
                          }
                        ),
                        dom.a(
                          dom.i({ class: "la la-lg la-align-right" }),
                          `Align
                            Right`,
                          {
                            class: "dropdown-item",
                            href: "#",
                            "data-value": "Right",
                          }
                        ),
                        dom.a(
                          dom.i({ class: "la la-lg la-align-justify" }),
                          `Align
                            Justify`,
                          {
                            class: "dropdown-item",
                            href: "#",
                            "data-value": "Full",
                          }
                        ),
                        {
                          id: "justify-btn",
                          class: "dropdown-menu",
                          "aria-labelledby": "dropdownMenuButton",
                        }
                      ),
                      { class: "dropdown" }
                    ),
                    dom.div({ class: "separator" }),
                    dom.a(dom.i({ class: "la la-link" }), {
                      id: "link-btn",
                      class: "hint",
                      href: "",
                      title: "Create link",
                      "aria-label": "Create link",
                    }),
                    dom.div({ class: "separator" }),
                    dom.input({
                      id: "fore-color",
                      name: "color",
                      type: "color",
                      "aria-label": "Text color",
                      pattern: "#[a-f0-9]{6}",
                      class: "form-control form-control-color hint",
                    }),
                    dom.input({
                      id: "back-color",
                      name: "background-color",
                      type: "color",
                      "aria-label": "Background color",
                      pattern: "#[a-f0-9]{6}",
                      class: "form-control form-control-color hint",
                    }),
                    dom.div({ class: "separator" }),
                    dom.select(
                      dom.option("- Font size -", { value: "" }),
                      dom.option("8 px", { value: "8px" }),
                      dom.option("9 px", { value: "9px" }),
                      dom.option("10 px", { value: "10px" }),
                      dom.option("11 px", { value: "11px" }),
                      dom.option("12 px", { value: "12px" }),
                      dom.option("13 px", { value: "13px" }),
                      dom.option("14 px", { value: "14px" }),
                      dom.option("15 px", { value: "15px" }),
                      dom.option("16 px", { value: "16px" }),
                      dom.option("17 px", { value: "17px" }),
                      dom.option("18 px", { value: "18px" }),
                      dom.option("19 px", { value: "19px" }),
                      dom.option("20 px", { value: "20px" }),
                      dom.option("21 px", { value: "21px" }),
                      dom.option("22 px", { value: "22px" }),
                      dom.option("23 px", { value: "23px" }),
                      dom.option("24 px", { value: "24px" }),
                      dom.option("25 px", { value: "25px" }),
                      dom.option("26 px", { value: "26px" }),
                      dom.option("27 px", { value: "27px" }),
                      dom.option("28 px", { value: "28px" }),
                      {
                        id: "font-size",
                        class: "form-select",
                        "aria-label": "Font size",
                      }
                    ),
                    dom.div({ class: "separator" }),
                    dom.select(
                      dom.option("- Font family -", { value: "" }),
                      dom.optgroup(
                        dom.option("Arial", {
                          value: "Arial, Helvetica, sans-serif",
                        }),
                        dom.option("Lucida Grande", {
                          value:
                            "'Lucida Sans Unicode', 'Lucida Grande', sans-serif'",
                        }),
                        dom.option("Palatino Linotype", {
                          value:
                            "'Palatino Linotype', 'Book Antiqua', Palatino, serif'",
                        }),
                        dom.option("Times New Roman", {
                          value: "'Times New Roman', Times, serif'",
                        }),
                        dom.option("Georgia, serif", {
                          value: "Georgia, serif",
                        }),
                        dom.option("Tahoma", {
                          value: "Tahoma, Geneva, sans-serif",
                        }),
                        dom.option("Comic Sans", {
                          value: "'Comic Sans MS', cursive, sans-serif'",
                        }),
                        dom.option("Verdana", {
                          value: "Verdana, Geneva, sans-serif",
                        }),
                        dom.option("Impact", {
                          value: "Impact, Charcoal, sans-serif",
                        }),
                        dom.option("Arial Black", {
                          value: "'Arial Black', Gadget, sans-serif'",
                        }),
                        dom.option("Trebuchet", {
                          value: "'Trebuchet MS', Helvetica, sans-serif'",
                        }),
                        dom.option("Courier New", {
                          value: "'Courier New', Courier, monospace'",
                        }),
                        dom.option("Brush Script", {
                          value: "'Brush Script MT', sans-serif'",
                        }),
                        { label: "System default" }
                      ),
                      {
                        id: "font-family",
                        class: "form-select",
                        title: "Font family",
                      }
                    ),
                    { id: "wysiwyg-editor", class: "default-editor" }
                  ),
                  dom.div(
                    dom.a(dom.i({ class: "la la-crosshairs" }), {
                      id: "drag-btn",
                      href: "",
                      title: "Drag element",
                    }),
                    dom.a(dom.i({ class: "la la-level-up-alt" }), {
                      id: "parent-btn",
                      href: "",
                      title: "Select parent",
                      class: "la-rotate-180",
                    }),
                    dom.a(dom.i({ class: "la la-arrow-circle-up" }), {
                      id: "up-btn",
                      href: "#",
                      title: "Move element up",
                    }),
                    dom.a(dom.i({ class: "la la-arrow-circle-down" }), {
                      id: "down-btn",
                      href: "#",
                      title: "Move element down",
                    }),
                    dom.a(dom.i({ class: "la la-copy" }), {
                      id: "clone-btn",
                      href: "#",
                      title: "Clone element",
                    }),
                    dom.a(dom.i({ class: "la la-trash" }), {
                      id: "delete-btn",
                      href: "#",
                      title: "Remove element",
                    }),
                    dom.a(dom.i({ class: "la la-ellipsis-v" }), {
                      id: "options-btn",
                      href: "#",
                      title: "More Options",
                    }),
                    { id: "select-actions" }
                  ),
                  dom.div(
                    dom.div({ class: "top-left" }),
                    dom.div({ class: "top-center" }),
                    dom.div({ class: "top-right" }),
                    dom.div({ class: "center-left" }),
                    dom.div({ class: "center-right" }),
                    dom.div({ class: "bottom-left" }),
                    dom.div({ class: "bottom-center" }),
                    dom.div({ class: "bottom-right" }),
                    { class: "resize" }
                  ),
                  { id: "select-box" }
                ),
                dom.div(
                  dom.div(
                    dom.ul(
                      dom.li(
                        dom.a(
                          dom.i({ class: "la la-lg la-cube" }),
                          dom.div(dom.small("Components")),
                          {
                            class: "nav-link active",
                            id: "box-components-tab",
                            "data-bs-toggle": "tab",
                            href: "#box-components",
                            role: "tab",
                            "aria-controls": "components",
                            "aria-selected": "true",
                          }
                        ),
                        { class: "nav-item component-tab" }
                      ),
                      dom.li(
                        dom.a(
                          dom.i({ class: "la la-lg la-image" }),
                          dom.div(dom.small("Blocks")),
                          {
                            class: "nav-link",
                            id: "box-sections-tab",
                            "data-bs-toggle": "tab",
                            href: "#box-blocks",
                            role: "tab",
                            "aria-controls": "blocks",
                            "aria-selected": "false",
                          }
                        ),
                        { class: "nav-item sections-tab" }
                      ),
                      {
                        class: "nav nav-tabs",
                        id: "box-elements-tabs",
                        role: "tablist",
                      }
                    ),
                    dom.div(
                      dom.div(dom.i({ class: "la la-times la-lg" }), {
                        id: "close-section-btn",
                        class: "btn btn-light btn-sm bg-white btn-sm float-end",
                      }),
                      dom.div(
                        dom.div(
                          dom.input({
                            type: "radio",
                            id: "add-section-insert-mode-after",
                            value: "after",
                            checked: "checked",
                            name: "add-section-insert-mode",
                            class: "form-check-input",
                          }),
                          dom.label("After", {
                            class: "form-check-label small",
                            for: "add-section-insert-mode-after",
                          }),
                          { class: "form-check d-inline-block me-1" }
                        ),
                        dom.div(
                          dom.input({
                            type: "radio",
                            id: "add-section-insert-mode-inside",
                            value: "inside",
                            name: "add-section-insert-mode",
                            class: "form-check-input",
                          }),
                          dom.label("Inside", {
                            class: "form-check-label small",
                            for: "add-section-insert-mode-inside",
                          }),
                          { class: "form-check d-inline-block" }
                        ),
                        dom.div(
                          dom.input({
                            type: "radio",
                            id: "add-section-insert-mode-replace",
                            value: "replace",
                            name: "add-section-insert-mode",
                            class: "form-check-input",
                          }),
                          dom.label("Replace", {
                            class: "form-check-label small",
                            for: "add-section-insert-mode-replace",
                          }),
                          { class: "form-check d-inline-block" }
                        ),
                        { class: "mt-2 me-3 float-end" }
                      ),
                      { class: "section-box-actions" }
                    ),
                    dom.div(
                      dom.div(
                        dom.div(
                          dom.div(
                            dom.button(dom.i({ class: "la la-plus" }), {
                              class: "text-sm",
                              title: "Expand All",
                              "data-vvveb-action": "expand",
                            }),
                            dom.button(dom.i({ class: "la la-minus" }), {
                              title: "Collapse all",
                              "data-vvveb-action": "collapse",
                            }),
                            { class: "expand" }
                          ),
                          dom.input({
                            class: "form-control component-search",
                            placeholder: "Search components",
                            type: "text",
                            "data-vvveb-action": "search",
                            "data-vvveb-on": "keyup",
                          }),
                          dom.button(dom.i({ class: "la la-times" }), {
                            class: "clear-backspace",
                            "data-vvveb-action": "clearSearch",
                          }),
                          { class: "search" }
                        ),
                        dom.div(
                          dom.div(
                            dom.ul({
                              class: "components-list clearfix",
                              "data-type": "addbox",
                            })
                          )
                        ),
                        {
                          class: "tab-pane show active",
                          id: "box-components",
                          role: "tabpanel",
                          "aria-labelledby": "components-tab",
                        }
                      ),
                      dom.div(
                        dom.div(
                          dom.div(
                            dom.button(dom.i({ class: "la la-plus" }), {
                              class: "text-sm",
                              title: "Expand All",
                              "data-vvveb-action": "expand",
                            }),
                            dom.button(dom.i({ class: "la la-minus" }), {
                              title: "Collapse all",
                              "data-vvveb-action": "collapse",
                            }),
                            { class: "expand" }
                          ),
                          dom.input({
                            class: "form-control block-search",
                            placeholder: "Search blocks",
                            type: "text",
                            "data-vvveb-action": "search",
                            "data-vvveb-on": "keyup",
                          }),
                          dom.button(dom.i({ class: "la la-times" }), {
                            class: "clear-backspace",
                            "data-vvveb-action": "clearSearch",
                          }),
                          { class: "search" }
                        ),
                        dom.div(
                          dom.div(
                            dom.ul({
                              class: "blocks-list clearfix",
                              "data-type": "addbox",
                            }),
                            { style: "overflow: auto" }
                          )
                        ),
                        {
                          class: "tab-pane",
                          id: "box-blocks",
                          role: "tabpanel",
                          "aria-labelledby": "blocks-tab",
                        }
                      ),
                      { class: "tab-content" }
                    ),
                    { class: "header" }
                  ),
                  { id: "add-section-box", class: "drag-elements" }
                ),
                dom.div({ id: "drop-highlight-box" }),
                { id: "iframe-layer", class: "col-md-8 col-12" }
              ),
              { id: "iframe-wrapper", class: "d-flex auto" }
            ),
            {
              class: "d-flex align-items-center justify-content-center",
              style: "width: 100%",
            }
          ),
          {
            id: "preview-panel",
            class: "col-md-9 col-sm-12",
            style: "overflow-x: auto",
          }
        ),
        dom.div(
          dom.div(
            dom.div(dom.ol({ class: "breadcrumb" }), {
              class: "breadcrumb-navigator px-2",
              style: '--bs-breadcrumb-divider: " > "',
              id: "breadcrumb-navigator",
            }),
            dom.div(
              dom.div(
                dom.input({
                  type: "checkbox",
                  class: "form-check-input",
                  id: "runjs",
                  name: "runjs",
                  "data-vvveb-action": "toggleEditorJsExecute",
                }),
                dom.label(dom.small("Run javascript code on edit"), {
                  class: "form-check-label",
                  for: "runjs",
                }),
                {
                  id: "toggleEditorJsExecute",
                  class: "form-check mt-1",
                  style: "display: none",
                }
              ),
              dom.button(dom.i({ class: "la la-code" }), "Code editor", {
                id: "code-editor-btn",
                "data-view": "mobile",
                class: "btn btn-sm btn-light btn-sm",
                title: "Code editor",
                "data-vvveb-action": "toggleEditor",
                "data-bs-toggle": "offcanvas",
                "data-bs-target": "#vvveb-code-editor",
              }),
              { class: "btn-group", role: "group" }
            ),
            { class: "d-flex flex-row justify-content-around" }
          ),
          { id: "bottom-panel", class: "col" }
        ),
        { class: "row mx-auto col", style: "height: 90vh" }
      ),
      dom.div(dom.textarea({ class: "form-control" }), dom.div(), {
        id: "vvveb-code-editor",
        class: "col-md-4 offcanvas-md offcanvas-end my-auto",
        style: "display: none; height: 90vh",
      }),
      { class: "d-flex flex-row", id: "vvveb-main-section" }
    ),
    {
      id: `vvveb-builder${ui_id ? "-" + ui_id : ""}`,
      class: "vvveb-builder row",
    }
  ).node;

const BuilderUiModals = () =>
  dom.div(
    dom.div(
      dom.div(
        dom.div(
          dom.div(
            dom.p(dom.i({ class: "la la-lg la-save" }), "Export html", {
              class: "modal-title text-primary",
            }),
            dom.button({
              type: "button",
              class: "btn-close",
              "data-bs-dismiss": "modal",
              "aria-label": "Close",
            }),
            { class: "modal-header" }
          ),
          dom.div(
            dom.textarea({ rows: "25", cols: "150", class: "form-control" }),
            { class: "modal-body" }
          ),
          dom.div(
            dom.button(dom.i({ class: "la la-times" }), "Close", {
              type: "button",
              class: "btn btn-secondary btn-lg",
              "data-bs-dismiss": "modal",
            }),
            { class: "modal-footer" }
          ),
          { class: "modal-content" }
        ),
        { class: "modal-dialog modal-lg", role: "document" }
      ),
      {
        class: "modal fade",
        id: "textarea-modal",
        tabindex: "-1",
        role: "dialog",
        "aria-labelledby": "textarea-modal",
        "aria-hidden": "true",
      }
    ),
    dom.div(
      dom.div(
        dom.div(
          dom.div(
            dom.p(dom.i({ class: "la la-lg la-comment" }), "VvvebJs", {
              class: "modal-title text-primary",
            }),
            dom.button({
              type: "button",
              class: "btn-close",
              "data-bs-dismiss": "modal",
              "aria-label": "Close",
            }),
            { class: "modal-header" }
          ),
          dom.div(dom.p("Page was successfully saved!."), {
            class: "modal-body",
          }),
          dom.div(
            dom.button(dom.i({ class: "la la-times" }), "Close", {
              type: "button",
              class: "btn btn-secondary btn-lg",
              "data-bs-dismiss": "modal",
            }),
            { class: "modal-footer" }
          ),
          { class: "modal-content" }
        ),
        { class: "modal-dialog", role: "document" }
      ),
      {
        class: "modal fade",
        id: "message-modal",
        tabindex: "-1",
        role: "dialog",
      }
    ),
    dom.div(
      dom.div(
        dom.form(
          dom.div(
            dom.div(
              dom.h6(dom.i({ class: "la la-lg la-file" }), "New page", {
                class: "modal-title text-primary fw-normal",
              }),
              dom.button({
                type: "button",
                class: "btn-close",
                "data-bs-dismiss": "modal",
                "aria-label": "Close",
              }),
              { class: "modal-header" }
            ),
            dom.div(
              dom.div(
                dom.label(
                  "Template",
                  dom.abbr(
                    dom.i({
                      class: "la la-lg la-question-circle text-primary",
                    }),
                    {
                      title:
                        "The contents of this template will be used as a start for the new template",
                    }
                  ),
                  { class: "col-sm-3 col-form-label" }
                ),
                dom.div(
                  dom.div(
                    dom.select(
                      dom.option("Blank Template", {
                        value: "new-page-blank-template.html",
                      }),
                      dom.option("Narrow jumbotron", {
                        value: "demo/narrow-jumbotron/index.html",
                      }),
                      dom.option("Album", { value: "demo/album/index.html" }),
                      { class: "form-select", name: "startTemplateUrl" }
                    )
                  ),
                  { class: "col-sm-9 input" }
                ),
                { class: "mb-3 row", "data-key": "type" }
              ),
              dom.div(
                dom.label("Page name", { class: "col-sm-3 col-form-label" }),
                dom.div(
                  dom.div(
                    dom.input({
                      name: "title",
                      type: "text",
                      value: "My page",
                      class: "form-control",
                      placeholder: "My page",
                      required: "",
                    })
                  ),
                  { class: "col-sm-9 input" }
                ),
                { class: "mb-3 row", "data-key": "href" }
              ),
              dom.div(
                dom.label("File name", { class: "col-sm-3 col-form-label" }),
                dom.div(
                  dom.div(
                    dom.input({
                      name: "file",
                      type: "text",
                      value: "my-page.html",
                      class: "form-control",
                      placeholder: "my-page.html",
                      required: "",
                    })
                  ),
                  { class: "col-sm-9 input" }
                ),
                { class: "mb-3 row", "data-key": "href" }
              ),
              dom.div(
                dom.label("Save to folder", {
                  class: "col-sm-3 col-form-label",
                }),
                dom.div(
                  dom.div(
                    dom.input({
                      name: "folder",
                      type: "text",
                      value: "my-pages",
                      class: "form-control",
                      placeholder: "/",
                      required: "",
                    })
                  ),
                  { class: "col-sm-9 input" }
                ),
                { class: "mb-3 row", "data-key": "href" }
              ),
              { class: "modal-body text" }
            ),
            dom.div(
              dom.button(dom.i({ class: "la la-times" }), "Cancel", {
                class: "btn btn-secondary btn-lg",
                type: "reset",
                "data-bs-dismiss": "modal",
              }),
              dom.button(dom.i({ class: "la la-check" }), "Create page", {
                class: "btn btn-primary btn-lg",
                type: "submit",
              }),
              { class: "modal-footer" }
            ),
            { class: "modal-content" }
          ),
          { action: "save.php" }
        ),
        { class: "modal-dialog", role: "document" }
      ),
      {
        class: "modal fade",
        id: "new-page-modal",
        tabindex: "-1",
        role: "dialog",
      }
    ),
    dom.div(
      dom.div(
        dom.div(
          dom.strong("Page save", { class: "me-auto" }),
          dom.button({
            type: "button",
            class: "btn-close text-white px-2",
            "data-bs-dismiss": "toast",
            "aria-label": "Close",
          }),
          { class: "toast-header text-white" }
        ),
        dom.div(
          dom.div(
            dom.div(
              "Elements saved!",
              dom.div("Template backup was saved!"),
              dom.div("Template was saved!"),
              { class: "message" }
            ),
            dom.div(
              dom.a("View page", {
                class: "btn btn-success btn-icon btn-sm w-100 mt-2",
                href: "",
              })
            ),
            { class: "flex-grow-1" }
          ),
          { class: "toast-body" }
        ),
        {
          class: "toast",
          role: "alert",
          "aria-live": "assertive",
          "aria-atomic": "true",
        }
      ),
      {
        class: "toast-container position-fixed end-0 bottom-0 me-3 mb-3",
        id: "top-toast",
      }
    )
  ).node;
