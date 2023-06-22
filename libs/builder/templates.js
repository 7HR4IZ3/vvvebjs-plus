let TEMPLATES = {
  "vvveb-input-textinput": `
      <div>
        <input name="{%=key%}" type="text" class="form-control" />
      </div>
    `,
  "vvveb-input-textareainput": `
      <div>
        <textarea name="{%=key%}" {% if (typeof rows !== 'undefined') { %}
        rows="{%=rows%}" {% } else { %} rows="3" {% } %} class="form-control"/>
      </div>
    `,
  "vvveb-input-checkboxinput": `
      <div
        class="form-check{% if (typeof className !== 'undefined') { %} {%=className%}{% } %}"
      >
        <input
          name="{%=key%}"
          class="form-check-input"
          type="checkbox"
          id="{%=key%}_check"
        />
        <label class="form-check-label" for="{%=key%}_check"
          >{% if (typeof text !== 'undefined') { %} {%=text%} {% } %}</label
        >
      </div>
    `,
  "vvveb-input-radioinput": `
      <div>
        {% for ( var i = 0; i < options.length; i++ ) { %}

        <label
          class="form-check-input  {% if (typeof inline !== 'undefined' && inline == true) { %}custom-control-inline{% } %}"
          title="{%=options[i].title%}"
        >
          <input
            name="{%=key%}"
            class="form-check-input"
            type="radio"
            value="{%=options[i].value%}"
            id="{%=key%}{%=i%}"
            {%if
            (options[i].checked)
            {
            %}checked="{%=options[i].checked%}"
            {%
            }
            %}
          />
          <label class="form-check-label" for="{%=key%}{%=i%}"
            >{%=options[i].text%}</label
          >
        </label>

        {% } %}
      </div>
    `,
  "vvveb-input-radiobuttoninput": `
      <div
        class="btn-group {%if (extraclass) { %}{%=extraclass%}{% } %} clearfix"
        role="group"
      >
        {% var namespace = 'rb-' + Math.floor(Math.random() * 100); %}
        {% for ( var i = 0; i < options.length; i++ ) { %}

        <input
          name="{%=key%}"
          class="btn-check"
          type="radio"
          value="{%=options[i].value%}"
          id="{%=namespace%}{%=key%}{%=i%}"
          {%if
          (options[i].checked)
          {
          %}checked="{%=options[i].checked%}"
          {%
          }
          %}
          autocomplete="off"
        />
        <label
          class="btn btn-outline-primary {%if (options[i].extraclass) { %}{%=options[i].extraclass%}{% } %}"
          for="{%=namespace%}{%=key%}{%=i%}"
          title="{%=options[i].title%}"
        >
          {%if (options[i].icon) { %}<i class="{%=options[i].icon%}"></i>{% } %}
          {%=options[i].text%}
        </label>

        {% } %}
      </div>
    `,
  "vvveb-input-toggle": `
      <div class="form-check form-switch">
        <input
          type="checkbox"
          name="{%=key%}"
          value="{%=on%}"
          {%if
          (off)
          {
          %}
          data-value-off="{%=off%}"
          {%
          }
          %}
          {%if
          (on)
          {
          %}
          data-value-on="{%=on%}"
          {%
          }
          %}
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="{%=key%}"
        />
        <label class="form-check-label" for="{%=key%}"> </label>
      </div>
    `,
  "vvveb-input-header": `
      <h6 class="header">{%=header%}</h6>
    `,
  "vvveb-input-select": `

      <div>

      	<select class="form-select" name="{%=key%}">
      		{% var optgroup = false; for ( var i = 0; i < options.length; i++ ) { %}
      			{% if (options[i].optgroup) {  %}
      				{% if (optgroup) {  %}
      					</optgroup>
      				{% } %}
      				<optgroup label="{%=options[i].optgroup%}">
      			{% optgroup = true; } else { %}
      		<option value="{%=options[i].value%}"
      			{%
      				for (attr in options[i]) {
      						if (attr != "value" && attr != "text") {
      					 %}
      						{%=attr%}={%=options[i][attr]%}
      					{% }
      				} %}>
      		{%=options[i].text%}</option>
      		{% } } %}
      	</select>

      </div>
    `,
  "vvveb-input-icon-select": `
      <div class="input-list-select">
        <div class="elements">
          <div class="row">
            {% for ( var i = 0; i < options.length; i++ ) { %}
            <div class="col">
              <div class="element">
                {%=options[i].value%}
                <label>{%=options[i].text%}</label>
              </div>
            </div>
            {% } %}
          </div>
        </div>
      </div>
    `,
  "vvveb-input-html-list-select": `

      <div class="input-html-list-select">

      	<div class="current-element">

      	</div>

      	<div class="popup">
      		<select class="form-select">
      			{% var optgroup = false; for ( var i = 0; i < options.length; i++ ) { %}
      				{% if (options[i].optgroup) {  %}
      					{% if (optgroup) {  %}
      						</optgroup>
      					{% } %}
      					<optgroup label="{%=options[i].optgroup%}">
      				{% optgroup = true; } else { %}
      				<option value="{%=options[i].value%}">{%=options[i].text%}</option>
      			{% } } %}
      		</select>

      	      <div class="search">
      			  <input class="form-control search" placeholder="Search elements" type="text">
      			  <button class="clear-backspace">
      				  <i class="la la-times"></i>
      			  </button>
      		</div>

      		<div class="elements">
      				{%=elements%}
      			</div>
      		</div>
      	</div>
      </div>
    `,
  "vvveb-input-html-list-dropdown": `

      <div class="input-html-list-select" {% if (typeof id !== "undefined") { %} id={%=id%} {% } %}>

      	<div class="current-element">

      	</div>

      	<div class="popup">
      		<select class="form-select">
      			{% var optgroup = false; for ( var i = 0; i < options.length; i++ ) { %}
      				{% if (options[i].optgroup) {  %}
      					{% if (optgroup) {  %}
      						</optgroup>
      					{% } %}
      					<optgroup label="{%=options[i].optgroup%}">
      				{% optgroup = true; } else { %}
      				<option value="{%=options[i].value%}">{%=options[i].text%}</option>
      			{% } } %}
      		</select>

      	      <div class="search">
      			  <input class="form-control search" placeholder="Search elements" type="text">
      			  <button class="clear-backspace">
      				  <i class="la la-times"></i>
      			  </button>
      		</div>

      		<div class="elements">
      				{%=elements%}
      			</div>
      		</div>
      	</div>
      </div>
    `,
  "vvveb-input-dateinput": `
      <div>
        <input name="{%=key%}" type="date" class="form-control" {% if (typeof
        min_date === 'undefined') { %} min="{%=min_date%}" {% } %} {% if (typeof
        max_date === 'undefined') { %} max="{%=max_date%}" {% } %} />
      </div>
    `,
  "vvveb-input-listinput": `
      <div class="row">
        {% for ( var i = 0; i < options.length; i++ ) { %}
        <div class="col-6">
          <div class="input-group">
            <input
              name="{%=key%}_{%=i%}"
              type="text"
              class="form-control"
              value="{%=options[i].text%}"
            />
            <div class="input-group-append">
              <button class="input-group-text btn btn-sm btn-danger">
                <i class="la la-trash la-lg"></i>
              </button>
            </div>
          </div>
          <br />
        </div>
        {% } %} {% if (typeof hide_remove === 'undefined') { %}
        <div class="col-12">
          <button class="btn btn-sm btn-outline-primary">
            <i class="la la-trash la-lg"></i> Add new
          </button>
        </div>
        {% } %}
      </div>
    `,
  "vvveb-input-grid": `

      <div class="row">
      	<div class="col-6">

      		<label>Extra small</label>
      		<select class="form-select" name="col">

      			<option value="">None</option>
      			{% for ( var i = 1; i <= 12; i++ ) { %}
      			<option value="{%=i%}" {% if ((typeof col !== 'undefined') && col == i) { %} selected {% } %}>{%=i%}</option>
      			{% } %}

      		</select>
      	</div>


      	<div class="col-6">
      		<label>Small</label>
      		<select class="form-select" name="col-sm">

      			<option value="">None</option>
      			{% for ( var i = 1; i <= 12; i++ ) { %}
      			<option value="{%=i%}" {% if ((typeof col_sm !== 'undefined') && col_sm == i) { %} selected {% } %}>{%=i%}</option>
      			{% } %}

      		</select>
      	</div>

      	<div class="col-6">
      		<label>Medium</label>
      		<select class="form-select" name="col-md">

      			<option value="">None</option>
      			{% for ( var i = 1; i <= 12; i++ ) { %}
      			<option value="{%=i%}" {% if ((typeof col_md !== 'undefined') && col_md == i) { %} selected {% } %}>{%=i%}</option>
      			{% } %}

      		</select>
      	</div>

      	<div class="col-6">
      		<label>Large</label>
      		<select class="form-select" name="col-lg">

      			<option value="">None</option>
      			{% for ( var i = 1; i <= 12; i++ ) { %}
      			<option value="{%=i%}" {% if ((typeof col_lg !== 'undefined') && col_lg == i) { %} selected {% } %}>{%=i%}</option>
      			{% } %}

      		</select>
      	</div>


      	<div class="col-6">
      		<label>Extra large </label>
      		<select class="form-select" name="col-xl">

      			<option value="">None</option>
      			{% for ( var i = 1; i <= 12; i++ ) { %}
      			<option value="{%=i%}" {% if ((typeof col_lg !== 'undefined') && col_lg == i) { %} selected {% } %}>{%=i%}</option>
      			{% } %}

      		</select>
      	</div>

      	<div class="col-6">
      		<label>Extra extra large</label>
      		<select class="form-select" name="col-xxl">

      			<option value="">None</option>
      			{% for ( var i = 1; i <= 12; i++ ) { %}
      			<option value="{%=i%}" {% if ((typeof col_lg !== 'undefined') && col_lg == i) { %} selected {% } %}>{%=i%}</option>
      			{% } %}

      		</select>
      	</div>

      	{% if (typeof hide_remove === 'undefined') { %}
      	<div class="col-12">

      		<button class="btn btn-sm btn-outline-light text-danger">
      			<i class="la la-trash la-lg"></i> Remove
      		</button>

      	</div>
      	{% } %}

      </div>
    `,
  "vvveb-input-textvalue": `
      <div class="row">
        <div class="col-6 mb-1">
          <label>Value</label>
          <input
            name="value"
            type="text"
            value="{%=value%}"
            class="form-control"
            autocomplete="off"
          />
        </div>

        <div class="col-6 mb-1">
          <label>Text</label>
          <input
            name="text"
            type="text"
            value="{%=text%}"
            class="form-control"
            autocomplete="off"
          />
        </div>

        {% if (typeof hide_remove === 'undefined') { %}
        <div class="col-12">
          <button class="btn btn-sm btn-outline-light text-danger">
            <i class="la la-trash la-lg"></i> Remove
          </button>
        </div>
        {% } %}
      </div>
    `,
  "vvveb-input-rangeinput": `
      <div class="input-range">
        <input
          name="{%=key%}"
          type="range"
          min="{%=min%}"
          max="{%=max%}"
          step="{%=step%}"
          class="form-range"
          data-input-value
        />
        <input
          name="{%=key%}"
          type="number"
          min="{%=min%}"
          max="{%=max%}"
          step="{%=step%}"
          class="form-control"
          data-input-value
        />
      </div>
    `,
  "vvveb-input-imageinput": `
      <div>
        <input name="{%=key%}" type="text" class="form-control" />
        <input name="file" type="file" class="form-control" />
      </div>
    `,
  "vvveb-input-imageinput-gallery": `
      <div>
        <img
          id="thumb-{%=key%}"
          class="img-thumbnail p-0"
          data-target-input="#input-{%=key%}"
          data-target-thumb="#thumb-{%=key%}"
          style="cursor:pointer"
          src=""
          width="225"
          height="225"
        />
        <input
          name="{%=key%}"
          type="text"
          class="form-control mt-1"
          id="input-{%=key%}"
        />
        <button
          name="button"
          class="btn btn-primary btn-sm btn-icon mt-2"
          data-target-input="#input-{%=key%}"
          data-target-thumb="#thumb-{%=key%}"
        >
          <i class="la la-image la-lg"></i>&ensp;Set image
        </button>
      </div>
    `,
  "vvveb-input-colorinput": `
      <div>
        <input name="{%=key%}" type="color" {% if (typeof value !== 'undefined'
        && value != false) { %} value="{%=value%}" {% } %}
        pattern="#[a-f0-9]{6}" class="form-control form-control-color"/>
      </div>
    `,
  "vvveb-input-bootstrap-color-picker-input": `
      <div>
        <div id="cp2" class="input-group" title="Using input value">
          <input name="{%=key%}" type="text" {% if (typeof value !== 'undefined'
          && value != false) { %} value="{%=value%}" {% } %}
          class="form-control"/>
          <span class="input-group-append">
            <span class="input-group-text colorpicker-input-addon"
              ><i></i
            ></span>
          </span>
        </div>
      </div>
    `,
  "vvveb-input-numberinput": `
      <div>
        <input name="{%=key%}" type="number" value="{%=value%}" {% if (typeof
        min !== 'undefined' && min != false) { %}min="{%=min%}"{% } %} {% if
        (typeof max !== 'undefined' && max != false) { %}max="{%=max%}"{% } %}
        {% if (typeof step !== 'undefined' && step != false) {
        %}step="{%=step%}"{% } %} class="form-control"/>
      </div>
    `,
  "vvveb-input-button": `
      <div>
        <button class="btn btn-sm btn-primary {% if (typeof className !== 'undefined') { %} {%=className%} {% } %}">
          <i
            class="la  {% if (typeof icon !== 'undefined') { %} {%=icon%} {% } else { %} la-plus {% } %} la-lg"
          ></i>
          {%=text%}
        </button>
      </div>
    `,
  "vvveb-input-cssunitinput": `
      <div class="input-group css-unit" id="cssunit-{%=key%}">
        <input name="number" type="number" {% if (typeof value !== 'undefined'
        && value != false) { %} value="{%=value%}" {% } %} {% if (typeof min !==
        'undefined' && min != false) { %}min="{%=min%}"{% } %} {% if (typeof max
        !== 'undefined' && max != false) { %}max="{%=max%}"{% } %} {% if (typeof
        step !== 'undefined' && step != false) { %}step="{%=step%}"{% } %}
        class="form-control"/>
        <div class="input-group-append">
          <select class="form-select small-arrow" name="unit">
            <option value="em">em</option>
            <option value="rem">rem</option>
            <option value="px">px</option>
            <option value="%">%</option>
            <option value="vw">vw</option>
            <option value="vh">vh</option>
            <option value="ex">ex</option>
            <option value="ch">ch</option>
            <option value="cm">cm</option>
            <option value="mm">mm</option>
            <option value="in">in</option>
            <option value="pt">pt</option>
            <option value="auto">auto</option>
          </select>
        </div>
      </div>
    `,
  "vvveb-editormanager-page": `
    <li data-page="{%=name%}" class="file{% if (typeof className !== 'undefined') { %} {%=className%}{% } %}">
      <label for="{%=name%}" {% if (typeof description !== 'undefined') { %} title="{%=description%}" {% } %}>
        <span>{%=config.title%}</span>
        <div class="file-actions" style="display: block !important">
          <button href="#" class="close btn btn-outline-danger" title="Close"><i class="la la-times"></i></button>
        </div>
      </label> <input type="checkbox" id="{%=config.title%}" />
      <!-- <ol></ol> -->
    </li>
  `,
  "vvveb-filemanager-folder": `
      <li data-folder="{%=folder%}" class="folder">
        <label for="{%=folder%}"><span>{%=folderTitle%}</span></label>
        <input type="checkbox" id="{%=folder%}" />
        <ol></ol>
      </li>
    `,
  "vvveb-filemanager-page": `
      <li data-url="{%=url%}" data-file="{%=file%}" data-page="{%=name%}" class="file{% if (typeof className !== 'undefined') { %} {%=className%}{% } %}">
      	<label for="{%=name%}" {% if (typeof description !== 'undefined') { %} title="{%=description%}" {% } %}>
      		<span>{%=title%}</span>
      		<div class="file-actions">
      			<button href="#" class="split btn btn-outline-primary" title="Open sideways (ctrl + click)"><i class="la la-columns"></i></button>
      			<button href="#" class="rename btn btn-outline-primary" title="Rename"><i class="la la-pen"></i></button>
      			<button href="#" class="duplicate btn btn-outline-primary" title="Clone"><i class="la la-copy"></i></button>
      			<button href="#" class="delete btn btn-outline-danger" title="Delete"><i class="la la-trash"></i></button>
      		</div>
          
      	</label> <input type="checkbox" id="{%=name%}" />
      	<!-- <ol></ol> -->
      </li>
    `,
  "vvveb-filemanager-component": `
      <li data-url="{%=url%}" data-component="{%=name%}" class="component">
        <a href="{%=url%}"><span>{%=title%}</span></a>
      </li>
    `,
  "vvveb-breadcrumb-navigaton-item": `
      <li class="breadcrumb-item"><a href="#">{%=name%}</a></li>
    `,
  "vvveb-input-sectioninput": `
      <label class="header" data-header="{%=key%}" for="header_{%=key%}"
        ><span>{%=header%}</span>
        <div class="header-arrow"></div
      ></label>
      <input class="header_check" type="checkbox" {% if (typeof expanded !==
      'undefined' && expanded == false) { %} {% } else { %}checked="true"{% } %}
      id="header_{%=key%}">
      <div class="section row" data-section="{%=key%}"></div>
    `,
  "vvveb-property": `

      <div class="mb-3 {% if (typeof col !== 'undefined' && col != false) { %} col-sm-{%=col%} {% } else { %}row{% } %} {% if (typeof inline !== 'undefined' && inline == true) { %}inline{% } %} " data-key="{%=key%}" {% if (typeof group !== 'undefined' && group != null) { %}data-group="{%=group%}" {% } %}>

      	{% if (typeof name !== 'undefined' && name != false) { %}<label class="{% if (typeof inline === 'undefined' ) { %}col-sm-4{% } %} form-label" for="input-model">{%=name%}</label>{% } %}

      	<div class="{% if (typeof inline === 'undefined') { %}col-sm-{% if (typeof name !== 'undefined' && name != false) { %}8{% } else { %}12{% } } %} input"></div>

      </div>
    `,
  "vvveb-input-autocompletelist": `
      <div>
        <input name="{%=key%}" type="text" class="form-control" />

        <div
          class="form-control autocomplete-list"
          style="min-height: 150px; overflow: auto;"
        ></div>
      </div>
    `,
  "vvveb-input-tagsinput": `
      <div>
        <div class="form-control tags-input" style="height:auto;">
          <input
            name="{%=key%}"
            type="text"
            class="form-control"
            style="border:none;min-width:60px;"
          />
        </div>
      </div>
    `,
  "vvveb-input-noticeinput": `
      <div>
        <div
          class="alert alert-dismissible fade show alert-{%=type%}"
          role="alert"
        >
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
          <h6><b>{%=title%}</b></h6>

          {%=text%}
        </div>
      </div>
    `,
  "vvveb-section": `
      {% var suffix = Math.floor(Math.random() * 10000); %}

      <div class="section-item" draggable="true">
        <div class="controls">
          <div class="handle"></div>
          <div class="info">
            <div class="name">
              {%=name%}
              <div class="type">{%=type%}</div>
            </div>
          </div>
          <div class="buttons">
            <a class="delete-btn" href="" title="Remove section"
              ><i class="la la-trash text-danger"></i
            ></a>
            <!-- 
				<a class="up-btn" href="" title="Move element up"><i class="la la-arrow-up"></i></a>
				<a class="down-btn" href="" title="Move element down"><i class="la la-arrow-down"></i></a>
				-->
            <a class="properties-btn" href="" title="Properties"
              ><i class="la la-cog"></i
            ></a>
          </div>
        </div>

        <input
          class="header_check"
          type="checkbox"
          id="section-components-{%=suffix%}"
        />

        <label for="section-components-{%=suffix%}">
          <div class="header-arrow"></div>
        </label>

        <div class="tree">
          <ol>
            <li data-component="Products" class="file">
              <label
                for="idNaN"
                style="background-image:url(/js/vvvebjs/icons/products.svg)"
                ><span>Products</span></label
              >
              <input type="checkbox" id="idNaN" />
            </li>
            <li data-component="Posts" class="file">
              <label
                for="idNaN"
                style="background-image:url(/js/vvvebjs/icons/posts.svg)"
                ><span>Posts</span></label
              >
              <input type="checkbox" id="idNaN" />
            </li>
          </ol>
        </div>
      </div>
    `,
};
