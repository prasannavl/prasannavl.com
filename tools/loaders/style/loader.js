
import path from 'path';
import { stringifyRequest } from 'loader-utils';

module.exports = function loader() {};
module.exports.pitch = function pitch(remainingRequest) {
  if (this.cacheable) {
    this.cacheable();
  }

  const insertCssPath = path.join(__dirname, './cssUtils.js');
  let output = `
    var content = require(${stringifyRequest(this, `!!${remainingRequest}`)});
    var insertCss = require(${stringifyRequest(this, `!${insertCssPath}`)});

    if (typeof content === 'string') {
      content = [[module.id, content, '']];
    }

    module.exports = content.locals || {};
    module.exports.getCssModule = function() { return { id: module.id, content: content.toString() }; };
    module.exports.insertIntoDom = insertCss.bind(null, content);
  `;

  output += this.debug ? `
    var removeCss = function() {};

    // Hot Module Replacement
    // https://webpack.github.io/docs/hot-module-replacement
    if (module.hot) {
      module.hot.accept(${stringifyRequest(this, `!!${remainingRequest}`)}, function() {
        var newContent = require(${stringifyRequest(this, `!!${remainingRequest}`)});
        if (typeof newContent === 'string') {
          newContent = [[module.id, content, '']];
        }
        removeCss = insertCss(newContent, { replace: true });
      });
      module.hot.dispose(function() { removeCss(); });
    }
  ` : '';

  return output;
};
