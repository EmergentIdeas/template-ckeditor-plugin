; (function () {

	function escapeAttributeValue(s, preserveCR) {
		preserveCR = preserveCR ? '&#13;' : '\n';
		return ('' + s) /* Forces the conversion to string. */
			.replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
			.replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
			.replace(/"/g, '&quot;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			/*
			You may add other replacements here for HTML only 
			(but it's not necessary).
			Or for XML, only if the named entities are defined in its DTD.
			*/
			.replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
			.replace(/[\r\n]/g, preserveCR)
	}

	let escapeValues = {
		"'": '&apos;',
		'"': '&quot;',
		'<': '&lt;',
		'>': '&gt;',
		"&": '&amp;'
	}
	function descape(s) {
		s = ('' + s)
		for(let key of Object.keys(escapeValues)) {
			let value = escapeValues[key]
			s = s.split(value).join(key)
		}
		return s
	}

	function setIfExists(widget, attr) {
		var w = widget.element.$.attributes.getNamedItem('data-' + attr)
		if (w) {
			widget.setData(attr, w.value)
		}
	}
	function setIfExistsCheckbox(widget, attr) {
		var w = widget.element.$.attributes.getNamedItem('data-' + attr)
		if (w) {
			widget.setData(attr, w.value == 'false' ? false : true)
		}
	}

	function addClassIfDataExists(widget, name) {
		if (widget.data[name]) {
			widget.element.$.classList.add(widget.data[name])
		}

	}

	let places = ['top', 'right', 'bottom', 'left']
	let aspects = ['padding', 'margin']
	let placeholderText = '<p style="text-align: center;">dynamic content produced at runtime</p>'

	CKEDITOR.plugins.add('template-replacement', {
		requires: 'widget',

		icons: 'template-replacement',

		init: function (editor) {


			CKEDITOR.dialog.add('template-replacement', this.path + 'dialogs/template-replacement.js');

			editor.widgets.add('template-replacement', {

				button: 'Use a template',

				template: `<div class="tri-template-replacement" >
					${placeholderText}	
					</div>`
				, editables: {
				},

				dialog: 'template-replacement',
				dataAttributes: ['alttext', 'link', 'linktarget', 'templatecontent', 'layout', 'bordercss', 'verticalalign',
					'additionalclasses', 'additionalstyles', 'targetwidth', 'targetheight', 'aspectratio', 'margintop', 'marginright',
					'marginbottom', 'marginleft', 'paddingtop', 'paddingright', 'paddingbottom', 'paddingleft'],

				upcast: function (element) {
					return element.name == 'div' && element.hasClass('tri-template-replacement');
				},

				init: function () {
					for (var i in this.dataAttributes) {
						setIfExists(this, this.dataAttributes[i])
					}
					setIfExistsCheckbox(this, 'usecaption')
					setIfExistsCheckbox(this, 'linktarget')
				},
				data: function () {
					let data = this.data
					let templateReplacement = this.element.$

					// let's clear out the old info
					templateReplacement.className = 'tri-template-replacement'
					templateReplacement.style = `${data.additionalstyles || ''}`
					templateReplacement.removeAttribute('onclick')
					templateReplacement.innerHTML = placeholderText


					let linkPart = ''
					// if we're linking, set up the on click	
					if (data.link) {
						linkPart = ` onclick="if(!this.closest('.editing-page')) { `
						if (data.linktarget == true || data.linktarget == 'true') {
							linkPart += `window.open('${data.link}') }" `
						}
						else {
							linkPart += `window.location = '${data.link}' `
						}
						linkPart += '}" '
						templateReplacement.style.cursor = 'pointer'
					}




					if (data.targetwidth) {
						templateReplacement.style.width = data.targetwidth
					}
					if (data.targetheight) {
						templateReplacement.style.height = data.targetheight
					}

					if (data.layout == 'template-replacement-show-inline-block') {
						templateReplacement.style.display = 'inline-block'
					}
					if (data.layout == 'template-replacement-show-block') {
						templateReplacement.style.display = 'block'
					}
					if (data.layout == 'template-replacement-float-on-right') {
						templateReplacement.style.float = 'right'
					}
					if (data.layout == 'template-replacement-float-on-left') {
						templateReplacement.style.float = 'left'
					}

					if (data.bordercss) {
						templateReplacement.style.border = data.bordercss
					}


					if (this.data.additionalclasses) {
						this.element.$.className = this.element.$.className + ' ' + data.additionalclasses
					}

					// set padding and margin
					for (let aspect of aspects) {
						for (let place of places) {
							let value = data[aspect + place]
							if (value) {
								templateReplacement.style[`${aspect}-${place}`] = value
							}
						}
					}

					if (data.aspectratio) {
						templateReplacement.style.aspectRatio = data.aspectratio
					}

					for (var i in this.dataAttributes) {
						this.element.setAttribute('data-' + this.dataAttributes[i], this.data[this.dataAttributes[i]])
					}

				}
			})
		}
	});
})();