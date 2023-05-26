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

var ckeditorOptions = {
//   extraPlugins: "sharedspace",
  sharedSpaces: {
    top: "#wysiwyg-editor",
  },
};

class CKEditorPlugin extends Plugin {
  initialize() {
    this.builder.WysiwygEditor = new CKEditor(this.builder);
  }
}

class CKEditor {
  constructor(builder) {
    this.builder = builder;
    this.isActive = false;
    this.oldValue = "";
    this.doc = false;
    this.editor = false;
    this.toolbar = false;
  }

  init(doc) {
    this.doc = doc;
    //use default editor toolbar for ckeditor
    this.toolbar = $("#wysiwyg-editor");
    this.toolbar.removeClass("default-editor").addClass("ckeditor");
    this.toolbar.html("");
  }

  edit(element) {
    this.element = element;
    this.isActive = true;
    this.oldValue = element.html();
    this.builder.Builder.selectPadding = 10;
    //this.builder.Builder.highlightEnabled = false;
    element.attr({ contenteditable: true, spellcheckker: false });

    // CKEDITOR.disableAutoInline = true;
    // ckeditorOptions.sharedSpaces.top = this.toolbar.get(0);
    InlineEditor.create(element.get(0), ckeditorOptions).then(editor => {
        this.editor = editor;
    });

    this.toolbar.show();
  }

  destroy(element) {
    let data = this.editor.data.get();
    this.editor.destroy().then(() => {
      element.html(data)
      element.removeAttr("contenteditable spellcheckker");
      this.editor = false;
      this.isActive = false;
    });
    let node = this.element.get(0);
    this.toolbar.hide();

    this.builder.Undo.addMutation({
      type: "characterData",
      target: node,
      oldValue: this.oldValue,
      newValue: node.innerHTML,
    });
  }
}
