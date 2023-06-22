
class Menu {
  #options = {
    fadeSpeed: 100,
    filter: function ($obj) {},
    above: "auto",
    left: "auto",
    preventDoubleContext: true,
    compress: false,
    event: "contextmenu"
  }

  constructor(config, children) {
    if (config instanceof Array) {
      this.children = config;
      this.config = children || {};
    } else {
      this.config = config;
      this.children = children;
    }
    this.currentContextSelector = undefined;
    this.functionCache = {}
    this.config = { ...this.#options, ...this.config };
  }

  createCallback(func, menu) {
    let _this = this;
    return function (event) {
      func(event, { menu: menu, selector: _this.currentContextSelector, Menu: _this });
      menu.hide();
    };
  };

  attach(selector, event) {
    event && (this.config.event = event);
    $(selector).on(this.config.event, this.onContextMenu(selector));
  }

  initialize() {
    $(document).on("click", function () {
      $(".dropdown-context").fadeOut(this.config.fadeSpeed, function () {
        $(".dropdown-context")
          .css({ display: "" })
          .find(".drop-left")
          .removeClass("drop-left");
      })
    })

    if (this.config.preventDoubleContext) {
      $(document).on(this.config.event, ".dropdown-context", function (e) {
        e.preventDefault();
      })
    }

    $(document).on("mouseenter", ".dropdown-submenu", function () {
      let $sub = $(this).find(".dropdown-context-sub:first"),
        subWidth = $sub.width(),
        subLeft = $sub.offset().left,
        collision = subWidth + subLeft > window.innerWidth;
      if (collision) {
        $sub.addClass("drop-left");
      }
    })
  }

  buildMenu(data, id, subMenu) {
    let subClass = subMenu ? " dropdown-context-sub" : "",
      compressed = this.config.compress ? " compressed-context" : "",
      $menu = $(
        '<ul class="dropdown-menu dropdown-context' +
          subClass +
          compressed +
          '" id="dropdown-' +
          id +
          '"></ul>'
      );

    return this.buildMenuItems($menu, data, id, subMenu);
  }

  buildMenuItems($menu, data, id, subMenu, addDynamicTag) {
    let linkTarget = "";
    let $sub, $action;
    for (let item of data) {
      if (item instanceof SubMenu) {
        this.buildMenuItems($menu, item.children, id, subMenu, addDynamicTag);
      } else if (typeof item === "function") {
        let funcName;
        if (item.name === "") {
          // The function is declared like "foo = function() {}"
          for (let globalVar in window) {
            if (item == window[globalVar]) {
              funcName = globalVar;
              break;
            }
          }
        } else {
          funcName = item.name;
        }
        this.functionCache[funcName] = item;
        $menu.append(
          '<li class="dynamic-menu-src" data-src="' + funcName + '"></li>'
        );
      } else if (item.divider !== undefined) {
        let divider = '<li class="divider';
        divider += addDynamicTag ? " dynamic-menu-item" : "";
        divider += '"></li>';
        $menu.append(divider);
      } else if (item.header !== undefined) {
        let header = '<li class="nav-header';
        header += addDynamicTag ? " dynamic-menu-item" : "";
        header += '">' + item.header + "</li>";
        $menu.append(header);
      } else {
        if (item.href == undefined) {
          item.href = "#";
        }
        if (item.target !== undefined) {
          linkTarget = ' target="' + item.target + '"';
        }
        if (item.subMenu !== undefined) {
          let sub_menu = '<li class="dropdown-submenu';
          sub_menu += addDynamicTag ? " dynamic-menu-item" : "";
          sub_menu +=
            '"><a tabindex="-1" href="' +
            item.href +
            '">' +
            item.text +
            "</a></li>";
          $sub = sub_menu;
        } else {
          let element = "<li";
          element += addDynamicTag ? ' class="dynamic-menu-item"' : "";
          element +=
            '><a tabindex="-1" href="' + item.href + '"' + linkTarget + ">";
          if (item.icon !== undefined)
            element += '<span class="' + item.icon + '"></span> ';
          element += item.text + "</a></li>";
          $sub = $(element);
        }
        if (item.action !== undefined) {
          $action = item.action;
          $sub
            .find("a")
            .addClass("context-event")
            .on("click", this.createCallback($action, $menu));
        }
        $menu.append($sub);
        if (item.subMenu != undefined) {
          let subMenuData = this.buildMenu(item.subMenu, id, true);
          $menu.find("li:last").append(subMenuData);
        }
      }
      if (this.config.filter == "function") {
        this.config.filter($menu.find("li:last"));
      }
    }
    return $menu;
  }

  onContextMenu(selector) {
    let id;
    let _this = this;

    return (e) => {
      let data = _this.children;
      let $menu, $parentMenu;
      let builder = _this.config.builder
      let options = _this.config;
      selector = selector || _this.config.selector;
      let target = ( builder.Builder.highlightEl || builder.Builder.selectedEl)
      _this.menu = $menu;

      if (data.id !== undefined && data.data !== undefined) {
        id = data.id;
        $menu = $("body").find("#dropdown-" + id).get(0);
        if (!$menu) {
          $menu = _this.buildMenu(data.data, id);
          $("body").append($menu);
        }
      } else {
        if (!id) {
          let d = new Date()
          id = d.getTime()
        }
        $("body").find("#dropdown-" + id).remove();
        $menu = _this.buildMenu(data, id);
        $("body").append($menu);
      }

      e.preventDefault();
      e.stopPropagation();
      _this.currentContextSelector = $(this);

      $(".dropdown-context:not(.dropdown-context-sub)").hide();

      let $dd = $("#dropdown-" + id);
      
      let page = builder.Builder.pages.get(builder.Builder.currentPageName);
      let iframe = page.iframe;
      let pageDoc = $(iframe.get(0).contentDocument);

      let ioffset = iframe.offset();

      pageDoc.find("body").on("click", (ev) => {
        if ($(ev.target).closest($menu.get(0))) {
          $menu.hide();
        }
      });

      $dd.find(".dynamic-menu-item").remove(); // Destroy any old dynamic menu items
      $dd.find(".dynamic-menu-src").each(function (idx, element) {
        let menuItems = _this.functionCache[$(element).data("src")]($(selector))
        $parentMenu = $(element).closest(".dropdown-menu.dropdown-context");
        $parentMenu = _this.buildMenuItems(
          $parentMenu,
          menuItems,
          id,
          undefined,
          true
        );
      });

      if (typeof options.above == "boolean" && options.above) {
        $dd
          .addClass("dropdown-context-up")
          .css({
            top: ioffset.top + e.pageY - 20 - $("#dropdown-" + id).height(),
            left: ioffset.left + e.pageX - 13,
          })
          .fadeIn(options.fadeSpeed);
      } else if (typeof options.above == "string" && options.above == "auto") {
        $dd.removeClass("dropdown-context-up");
        var autoH = $dd.height() + 12;
        if (e.pageY + autoH > $("html").height()) {
          $dd
            .addClass("dropdown-context-up")
            .css({
              top: ioffset.top + e.pageY - 20 - autoH,
              left: ioffset.left + e.pageX - 13,
            })
            .fadeIn(options.fadeSpeed);
        } else {
          $dd
            .css({
              top: ioffset.top + e.pageY,
              left: ioffset.left + e.pageX,
            })
            .fadeIn(options.fadeSpeed);
        }
      }

      if (typeof options.left == "boolean" && options.left) {
        $dd
          .addClass("dropdown-context-left")
          .css({
            left: ioffset.left + e.pageX - $dd.width(),
          })
          .fadeIn(options.fadeSpeed);
      } else if (typeof options.left == "string" && options.left == "auto") {
        $dd.removeClass("dropdown-context-left");
        var autoL = $dd.width() - 12;
        if (e.pageX + autoL > $("html").width()) {
          $dd.addClass("dropdown-context-left").css({
            left: ioffset.left + e.pageX - $dd.width() + 13,
          });
        }
      }
    }
  }
}

class MenuItem {
  constructor(text, config) {
    if (typeof text === "string") {
      if (config) {
        this.text = text;
      } else {
        this.header = text;
      }
    } else if (typeof text === "boolean") {
      this.divider = text;
    }

    if (config) {
      if (config instanceof Array) {
        this.subMenu = config;
      } else if (typeof config === "function") {
        this.subMenu = [config];
      } else {
        Object.assign(this, config);
      }
    }
  }
}

class SubMenu {
  constructor(header, config, children) {
    let defaultConfig = { divider: true, header: true };
    if (config instanceof Array) {
      this.children = config;
      this.config = { ...defaultConfig, ...(children || {}) };
    } else {
      this.config = { ...defaultConfig, ...config };
      this.children = children;
    }

    if (this.config.header) {
      this.children.splice(0, 0, new MenuItem(header))
    }

    if (this.config.divider) {
      this.children.splice(0, 0, new MenuItem(true))
    }
  }
}

function MenuDivider() {
  return new MenuItem(true)
}

function MenuHeader(text) {
  return new MenuItem(text);
}

// let menu = new Menu([
//   new SubMenu("My Header", [
//     new MenuItem("Main Menu", [
//       new MenuItem("Basic Header"),
//       new MenuItem("Alert Me", {
//         action() {
//           alert("Hello World");
//         },
//       }),
//     ]),
//   ]),
//   new MenuItem("Meta"),
//   new MenuItem("The Author", [new MenuItem("@Thraize")]),

//   new SubMenu("Responsive", [
//     new MenuItem("Element", [
//       new MenuItem("Name", { action(e, selector) {
//         console.log(selector)
//       } })
//     ]),
//     new MenuItem("III", (selector) => {
//       console.log(selector)
//       return [
//         new MenuItem("Namessss")
//       ]
//     })
//   ]),
//   new MenuItem("Navigation"),
//   new MenuItem("Forward", { action: () => window.history.forward() }),
//   new MenuItem("Back", { action: () => window.history.back() }),

// ]);

// window.onload = () => menu.attach("body");
