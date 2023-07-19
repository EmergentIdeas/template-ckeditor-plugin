const path = require('path')
let webhandle = require('webhandle')

function integrate() {

	webhandle.addStaticDir(path.join(webhandle.projectRoot, 'node_modules/@dankolz/picture-ckeditor-plugin/public/ckeditor/plugins'), {urlPrefix: '/ckeditor/plugins'})
}

module.exports = integrate