const ejs = require('ejs');
const sass = require('node-sass');
const fs = require('fs');

const html = fs.readFileSync('./template.ejs').toString().trim();
const style = fs.readFileSync('./style.scss').toString().trim();
const script = fs.readFileSync('./script.js').toString().trim();

const htmlString = ejs.render(html, {}, {});
const styleString = sass.renderSync({
  data: style,
  outputStyle: 'compressed',
}).css.toString();
const scriptString = ejs.render(script, { style: styleString, html: htmlString }, {});

fs.writeFileSync('./dist/bundle.js', scriptString);
