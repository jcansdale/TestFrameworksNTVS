import fs = require('fs');
import path = require('path');

export function find_tests(testFileList, discoverResultFile, projectFolder) {

    var test = findTape(projectFolder);
    if (test === null) {
        console.error("NTVS_ERROR:", "Couldn't find 'tape' module relative to", projectFolder);
        return;
    }

    let harness = test.getHarness({ exit: false });
    let tests = harness["_tests"];

    let count = 0;
    let testList = [];
    testFileList.split(';').forEach(function (testFile) {

        let testCases;
        process.chdir(path.dirname(testFile));
        try {
            testCases = require(testFile);
        } catch (ex) {
            console.error("NTVS_ERROR:", ex, "in", testFile);
            return;
        }

        for (; count < tests.length; count++) {
            var t = tests[count];
            t._skip = true; // Don't run tests.
            testList.push({
                test: t.name,
                suite: '',
                file: testFile,
                line: 1,
                column: 1
            });
        }
    });

    var fd = fs.openSync(discoverResultFile, 'w');
    fs.writeSync(fd, JSON.stringify(testList));
    fs.closeSync(fd);
};

export function run_tests(testName, testFile, workingFolder, projectFolder) {
    var testCases;
    process.chdir(path.dirname(testFile));
    try {
        testCases = require(testFile);
    } catch (ex) {
        console.error("NTVS_ERROR:", ex, "in", testFile);
        return;
    }

    try {
        var test = findTape(projectFolder);
        if (test === null) {
            console.error("NTVS_ERROR:", "Couldn't find 'tape' module relative to", projectFolder);
            return;
        }

        var harness = test.getHarness();
        harness.only(testName);
    } catch (ex) {
        console.error("NTVS_ERROR:", ex);
        return;
    }
};

function findTape(projectFolder) {
    var tapePath = path.join(projectFolder, 'node_modules', 'tape');
    return require(tapePath);
}
