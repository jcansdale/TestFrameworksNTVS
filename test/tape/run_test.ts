import assert = require('assert');
import path = require('path');
import utilities = require('../utilities');

let testFile = path.join(__dirname, "target_tests.js");
let workingFolder = __dirname;

export function run_tests_FailTest_ExitCode1() {
    let testName = "fail_test";

    let { status, stdout } = utilities.execTest(testName, testFile, workingFolder, utilities.projectFolder);

    assert.equal(status, 1, "check test failed");
}

export function run_tests_PassTest_ExitCode0() {
    let testName = "pass_test";

    let { status, stdout } = utilities.execTest(testName, testFile, workingFolder, utilities.projectFolder);

    assert.equal(status, 0, "check test passed");
}

export function run_tests_PassTest_ReportedInSdtout() {
    let testName = "pass_test";

    let { status, stdout } = utilities.execTest(testName, testFile, workingFolder, utilities.projectFolder);

    assert.notEqual(stdout.indexOf("# " + testName), -1, "check target test ran");
    assert.notEqual(stdout.indexOf("# tests 1"), -1, "check only target test ran");
}

export function run_tests_FailTest_ReportedInSdtout() {
    let testName = "fail_test";

    let { status, stdout } = utilities.execTest(testName, testFile, workingFolder, utilities.projectFolder);

    assert.notEqual(stdout.indexOf("# " + testName), -1, "check target test ran");
    assert.notEqual(stdout.indexOf("# tests 1"), -1, "check only target test ran");
}
