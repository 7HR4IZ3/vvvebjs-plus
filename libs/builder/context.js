/*
 * Context.js
 * Copyright Jacob Kelley
 * MIT License
 *
 * Modified by Joshua Christman
 */

// context = (function () {
//   var options = {
//     fadeSpeed: 100,
//     filter: function ($obj) {
//       // Modify $obj, Do not return
//     },
//     above: "auto",
//     left: "auto",
//     preventDoubleContext: true,
//     compress: false,
//   };

//   function initialize(opts) {
//     options = $.extend({}, options, opts);

//     $(document).on("click", function () {
//       $(".dropdown-context").fadeOut(options.fadeSpeed, function () {
//         $(".dropdown-context")
//           .css({ display: "" })
//           .find(".drop-left")
//           .removeClass("drop-left");
//       });
//     });
//     if (options.preventDoubleContext) {
//       $(document).on("contextmenu", ".dropdown-context", function (e) {
//         e.preventDefault();
//       });
//     }
//     $(document).on("mouseenter", ".dropdown-submenu", function () {
//       var $sub = $(this).find(".dropdown-context-sub:first"),
//         subWidth = $sub.width(),
//         subLeft = $sub.offset().left,
//         collision = subWidth + subLeft > window.innerWidth;
//       if (collision) {
//         $sub.addClass("drop-left");
//       }
//     });
//   }

//   function updateOptions(opts) {
//     options = $.extend({}, options, opts);
//   }

//   function buildMenu(data, id, subMenu) {
//     var subClass = subMenu ? " dropdown-context-sub" : "",
//       compressed = options.compress ? " compressed-context" : "",
//       $menu = $(
//         '<ul class="dropdown-menu dropdown-context' +
//           subClass +
//           compressed +
//           '" id="dropdown-' +
//           id +
//           '"></ul>'
//       );

//     return buildMenuItems($menu, data, id, subMenu);
//   }

//   function buildMenuItems($menu, data, id, subMenu, addDynamicTag) {
//     var linkTarget = "";
//     for (var i = 0; i < data.length; i++) {
//       if (data[i].divider !== undefined) {
//         var divider = '<li class="divider';
//         divider += addDynamicTag ? " dynamic-menu-item" : "";
//         divider += '"></li>';
//         $menu.append(divider);
//       } else if (data[i].header !== undefined) {
//         var header = '<li class="nav-header';
//         header += addDynamicTag ? " dynamic-menu-item" : "";
//         header += '">' + data[i].header + "</li>";
//         $menu.append(header);
//       } else if (data[i].menu_item_src !== undefined) {
//         var funcName;
//         if (data[i].menu_item_src === "function") {
//           if (data[i].menu_item_src.name === "") {
//             // The function is declared like "foo = function() {}"
//             for (var globalVar in window) {
//               if (data[i].menu_item_src == window[globalVar]) {
//                 funcName = globalVar;
//                 break;
//               }
//             }
//           } else {
//             funcName = data[i].menu_item_src.name;
//           }
//         } else {
//           funcName = data[i].menu_item_src;
//         }
//         $menu.append(
//           '<li class="dynamic-menu-src" data-src="' + funcName + '"></li>'
//         );
//       } else {
//         if (data[i].href == undefined) {
//           data[i].href = "#";
//         }
//         if (data[i].target !== undefined) {
//           linkTarget = ' target="' + data[i].target + '"';
//         }
//         if (data[i].subMenu !== undefined) {
//           var sub_menu = '<li class="dropdown-submenu';
//           sub_menu += addDynamicTag ? " dynamic-menu-item" : "";
//           sub_menu +=
//             '"><a tabindex="-1" href="' +
//             data[i].href +
//             '">' +
//             data[i].text +
//             "</a></li>";
//           $sub = sub_menu;
//         } else {
//           var element = "<li";
//           element += addDynamicTag ? ' class="dynamic-menu-item"' : "";
//           element +=
//             '><a tabindex="-1" href="' + data[i].href + '"' + linkTarget + ">";
//           if (data[i].icon !== undefined)
//             element += '<span class="glyphicon ' + data[i].icon + '"></span> ';
//           element += data[i].text + "</a></li>";
//           $sub = $(element);
//         }
//         if (data[i].action !== undefined) {
//           $action = data[i].action;
//           $sub
//             .find("a")
//             .addClass("context-event")
//             .on("click", createCallback($action));
//         }
//         $menu.append($sub);
//         if (data[i].subMenu != undefined) {
//           var subMenuData = buildMenu(data[i].subMenu, id, true);
//           $menu.find("li:last").append(subMenuData);
//         }
//       }
//       if (options.filter == "function") {
//         options.filter($menu.find("li:last"));
//       }
//     }
//     return $menu;
//   }

//   function addContext(selector, data) {
//     if (data.id !== undefined && data.data !== undefined) {
//       var id = data.id;
//       $menu = $("body").find("#dropdown-" + id)[0];
//       if (typeof $menu === "undefined") {
//         $menu = buildMenu(data.data, id);
//         $("body").append($menu);
//       }
//     } else {
//       var d = new Date(),
//         id = d.getTime(),
//         $menu = buildMenu(data, id);
//       $("body").append($menu);
//     }

//     $(selector).on("contextmenu", function (e) {
//       e.preventDefault();
//       e.stopPropagation();

//       currentContextSelector = $(this);

//       $(".dropdown-context:not(.dropdown-context-sub)").hide();

//       let $dd = $("#dropdown-" + id);

//       $(window).on("click", (ev) => {
//         if ($menu.closest(ev.target).get(0)) {
//           $menu.hide();
//         }
//       });

//       $dd.find(".dynamic-menu-item").remove(); // Destroy any old dynamic menu items
//       $dd.find(".dynamic-menu-src").each(function (idx, element) {
//         var menuItems = window[$(element).data("src")]($(selector));
//         $parentMenu = $(element).closest(".dropdown-menu.dropdown-context");
//         $parentMenu = buildMenuItems(
//           $parentMenu,
//           menuItems,
//           id,
//           undefined,
//           true
//         );
//       });

//       if (typeof options.above == "boolean" && options.above) {
//         $dd
//           .addClass("dropdown-context-up")
//           .css({
//             top: e.pageY - 20 - $("#dropdown-" + id).height(),
//             left: e.pageX - 13,
//           })
//           .fadeIn(options.fadeSpeed);
//       } else if (typeof options.above == "string" && options.above == "auto") {
//         $dd.removeClass("dropdown-context-up");
//         var autoH = $dd.height() + 12;
//         if (e.pageY + autoH > $("html").height()) {
//           $dd
//             .addClass("dropdown-context-up")
//             .css({
//               top: e.pageY - 20 - autoH,
//               left: e.pageX - 13,
//             })
//             .fadeIn(options.fadeSpeed);
//         } else {
//           $dd
//             .css({
//               top: e.pageY + 10,
//               left: e.pageX - 13,
//             })
//             .fadeIn(options.fadeSpeed);
//         }
//       }

//       if (typeof options.left == "boolean" && options.left) {
//         $dd
//           .addClass("dropdown-context-left")
//           .css({
//             left: e.pageX - $dd.width(),
//           })
//           .fadeIn(options.fadeSpeed);
//       } else if (typeof options.left == "string" && options.left == "auto") {
//         $dd.removeClass("dropdown-context-left");
//         var autoL = $dd.width() - 12;
//         if (e.pageX + autoL > $("html").width()) {
//           $dd.addClass("dropdown-context-left").css({
//             left: e.pageX - $dd.width() + 13,
//           });
//         }
//       }
//     });
//   }

//   function destroyContext(selector) {
//     $(document).off("contextmenu", selector).off("click", ".context-event");
//   }

//   return {
//     init: initialize,
//     settings: updateOptions,
//     attach: addContext,
//     destroy: destroyContext,
//   };
// })();

// var createCallback = function (func) {
//   return function (event) {
//     func(event, currentContextSelector);
//   };
// };

// currentContextSelector = undefined;

class Menu {
  #options = {
    fadeSpeed: 100,
    filter: function ($obj) {},
    above: "auto",
    left: "auto",
    preventDoubleContext: true,
    compress: false
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

  createCallback(func) {
    let _this = this;
    return function (event) {
      func(event, _this.currentContextSelector);
    };
  };

  attach(selector) {
    $(selector).on("contextmenu", this.onContextMenu(selector));
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
      $(document).on("contextmenu", ".dropdown-context", function (e) {
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
            element += '<span class="glyphicon ' + item.icon + '"></span> ';
          element += item.text + "</a></li>";
          $sub = $(element);
        }
        if (item.action !== undefined) {
          $action = item.action;
          $sub
            .find("a")
            .addClass("context-event")
            .on("click", this.createCallback($action));
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
    let _this = this;
    let data = this.children;
    let id;
    let $menu, $parentMenu;
    selector = selector || this.config.selector;

    if (data.id !== undefined && data.data !== undefined) {
      id = data.id;
      $menu = $("body").find("#dropdown-" + id)[0];
      if ($menu === undefined) {
        $menu = this.buildMenu(data.data, id);
        $("body").append($menu);
      }
    } else {
      let d = new Date()
      id = d.getTime()
      $menu = this.buildMenu(data, id);
      $("body").append($menu);
    }

    return (e) => {
      let options = _this.config;

      e.preventDefault();
      e.stopPropagation();
      _this.currentContextSelector = $(this);

      $(".dropdown-context:not(.dropdown-context-sub)").hide();

      let $dd = $("#dropdown-" + id);

      $(window).on("click", (ev) => {
        if ($menu.closest(ev.target).get(0)) {
          $menu.hide();
        }
      });

      $dd.find(".dynamic-menu-item").remove(); // Destroy any old dynamic menu items
      $dd.find(".dynamic-menu-src").each(function (idx, element) {
        console.log(_this.functionCache, $(element))
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
            top: e.pageY - 20 - $("#dropdown-" + id).height(),
            left: e.pageX - 13,
          })
          .fadeIn(options.fadeSpeed);
      } else if (typeof options.above == "string" && options.above == "auto") {
        $dd.removeClass("dropdown-context-up");
        var autoH = $dd.height() + 12;
        if (e.pageY + autoH > $("html").height()) {
          $dd
            .addClass("dropdown-context-up")
            .css({
              top: e.pageY - 20 - autoH,
              left: e.pageX - 13,
            })
            .fadeIn(options.fadeSpeed);
        } else {
          $dd
            .css({
              top: e.pageY + 10,
              left: e.pageX - 13,
            })
            .fadeIn(options.fadeSpeed);
        }
      }

      if (typeof options.left == "boolean" && options.left) {
        $dd
          .addClass("dropdown-context-left")
          .css({
            left: e.pageX - $dd.width(),
          })
          .fadeIn(options.fadeSpeed);
      } else if (typeof options.left == "string" && options.left == "auto") {
        $dd.removeClass("dropdown-context-left");
        var autoL = $dd.width() - 12;
        if (e.pageX + autoL > $("html").width()) {
          $dd.addClass("dropdown-context-left").css({
            left: e.pageX - $dd.width() + 13,
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
  constructor(header, children) {
    this.children = [
      new MenuItem(header),
      ...children,
      new MenuItem(true)
    ]
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
