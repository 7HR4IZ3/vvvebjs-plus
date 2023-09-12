
class CodeInput extends Input {
	constructor(...args) {
		super(...args);
		this.data.defaultValue = this.data.defaultValue || ""
		this._value = null;
		this.codemirror = null;
	}

	setValue(value) {
		// value = value.trim()
		if (this.codemirror) {
			this.codemirror.getDoc().setValue(value)
		} else {
			this._value = value;
		}
	}

	get html() {
		return this.renderTemplate("textareainput", this.data)
	}

	init(node) {
		let _this = this;
		this.codemirror = CodeMirror.fromTextArea(node.find("textarea").get(0), {
			mode: 'javascript',
			lineNumbers: true,
			autofocus: true,
			lineWrapping: false,
			theme: ((localStorage.getItem("vvveb.theme") || "light") === "light") ? "material" : 'monokai',
			...(this.data.config || {})
		});
		this.codemirror.on("change", function (e, obj) {
			_this.value = e.getDoc().getValue();
			_this.onChange(e, node);
		});
		this.codemirror.getDoc().setValue("")

		this._value && this.setValue(this._value)
	}
}
window.CodeInput = CodeInput;

class CodemirrorCodeEditor {
	
	constructor(builder) {
		this.builder = builder;
		this.isActive = false
		this.oldValue = ''
		this.doc = false
		this.codemirror = false
	}
	
	init(doc) {
		let _this = this;
		if (this.codemirror == false)		
		{
			this.codemirror = CodeMirror.fromTextArea(
				document.querySelector(
					this.builder.config.codeeditor?.target || "#vvveb-code-editor textarea"
				), {
				mode: 'text/html',
				lineNumbers: true,
				autofocus: true,
				lineWrapping: false,
				//viewportMargin:Infinity,
				theme: 'monokai',
				...(this.builder.config.codeeditor || {})
			});
			
			this.isActive = true;
			this.codemirror.getDoc().on("change", function (e, v) { 
				if (v.origin != "setValue") _this.builder.Builder.setHtml(e.getValue());
			});

			let on_init = _this.builder.config.codeeditor?.init;
			on_init && on_init(this)
		}
		
		
		//load code on document changes
		let builder = this.builder.Builder;
		let iframe = builder.pages.get(builder.currentPageName).iframe;
		let frameDoc = $(iframe.get(0).contentDocument)

		frameDoc.find("body").on("vvveb.undo.add vvveb.undo.restore", function (e) { _this.builder.CodeEditor.setValue(e);});
		//load code when a new url is loaded
		frameDoc.on("load", function (e) { _this.builder.CodeEditor.setValue();});

		this.isActive = true;
		this.setValue();

		return this.codemirror;
	}

	setValue(value) {
		if (this.isActive == true)
		{
			var scrollInfo = this.codemirror.getScrollInfo();
			this.codemirror.setValue(this.builder.Builder.getHtml());
			this.codemirror.scrollTo(scrollInfo.left, scrollInfo.top);
		}
	}

	destroy(element) {
		/*
		//save memory by destroying but lose scroll on editor toggle
		this.codemirror.toTextArea();
		this.codemirror = false;
		*/ 
		this.isActive = false;
	}

	toggle() {
		if (this.isActive != true)
		{
			this.isActive = true;
			return this.init();
		}
		this.isActive = false;
		this.destroy();
	}
}

class CodeMirrorPlugin extends Plugin {
	initialize() {
		this.builder.CodeEditor = new CodemirrorCodeEditor(this.builder);
	}
}
