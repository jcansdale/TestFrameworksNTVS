import test = require("tape");

exportRunner("tape/find_tests");
exportRunner("tape/run_test");
exportRunner("ExportRunner/find_tests");

function exportRunner(moduleName) {
    var mod = require("./" + moduleName);
    for (let name in mod) {
        let fun = mod[name];
        test(`${moduleName}#${name}`, function (t) {
            let error;
            try {
                fun();
            }
            catch (e) {
                error = e;
            }
            t.equal(error, undefined);
            t.end();
        });
    }
}
