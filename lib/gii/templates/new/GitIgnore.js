"use strict";
var html = require('common-tags').html;
/**
 * create the RelutionHjson file for the Project
 * @link [template](https://github.com/github/gitignore/blob/master/Node.gitignore)
 */
var GitIgnore = (function () {
    function GitIgnore() {
        this.publishName = '.gitignore';
        this.name = 'gitignore';
    }
    Object.defineProperty(GitIgnore.prototype, "template", {
        get: function () {
            return ((_a = ["\n      # Logs\n      logs\n      *.log\n      npm-debug.log*\n\n      # Runtime data\n      pids\n      *.pid\n      *.seed\n\n      # Directory for instrumented libs generated by jscoverage/JSCover\n      lib-cov\n\n      # Coverage directory used by tools like istanbul\n      coverage\n\n      # nyc test coverage\n      .nyc_output\n\n      # Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)\n      .grunt\n\n      # node-waf configuration\n      .lock-wscript\n\n      # Compiled binary addons (http://nodejs.org/api/addons.html)\n      build/Release\n\n      # Dependency directories\n      node_modules\n      jspm_packages\n\n      # Optional npm cache directory\n      .npm\n\n      # Optional REPL history\n      .node_repl_history\n    "], _a.raw = ["\n      # Logs\n      logs\n      *.log\n      npm-debug.log*\n\n      # Runtime data\n      pids\n      *.pid\n      *.seed\n\n      # Directory for instrumented libs generated by jscoverage/JSCover\n      lib-cov\n\n      # Coverage directory used by tools like istanbul\n      coverage\n\n      # nyc test coverage\n      .nyc_output\n\n      # Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)\n      .grunt\n\n      # node-waf configuration\n      .lock-wscript\n\n      # Compiled binary addons (http://nodejs.org/api/addons.html)\n      build/Release\n\n      # Dependency directories\n      node_modules\n      jspm_packages\n\n      # Optional npm cache directory\n      .npm\n\n      # Optional REPL history\n      .node_repl_history\n    "], html(_a)));
            var _a;
        },
        enumerable: true,
        configurable: true
    });
    return GitIgnore;
}());
exports.GitIgnore = GitIgnore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2l0SWdub3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2dpaS90ZW1wbGF0ZXMvbmV3L0dpdElnbm9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUV6Qzs7O0dBR0c7QUFDSDtJQUFBO1FBRVMsZ0JBQVcsR0FBVyxZQUFZLENBQUM7UUFDbkMsU0FBSSxHQUFXLFdBQVcsQ0FBQztJQTJDcEMsQ0FBQztJQXpDQyxzQkFBSSwrQkFBUTthQUFaO1lBQ0UsTUFBTSxDQUFDLENBQUMsT0FBSSxpeEJBc0NYLGl5QkF0Q08sSUFBSSxLQXNDWCxDQUFDLENBQUM7O1FBQ0wsQ0FBQzs7O09BQUE7SUFDSCxnQkFBQztBQUFELENBQUMsQUE5Q0QsSUE4Q0M7QUE5Q1ksaUJBQVMsWUE4Q3JCLENBQUEifQ==