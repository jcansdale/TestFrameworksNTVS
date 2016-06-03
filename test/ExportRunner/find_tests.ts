import vm = require("vm");
import path = require("path");
import assert = require("assert");
import utilities = require("../utilities");

export function find_tests_OneTest_Expect1Test() {
    let expectedName = "__TestName__";
    let source = testSource(expectedName);
    let expectFile = utilities.tempFile(source);

    let results = utilities.findTests("exportrunner", [expectFile]);

    assert.equal(results.length, 1, "check for 1 test");
    const [{test: testName, file: testFile}] = results;
    assert.equal(testName, expectedName);
    assert.equal(testFile, expectFile);
    assert.equal(1, results.length);
}

export function find_tests_TwoTestFiles_Expect2Tests() {
    let expectedName1 = "__TestName1__";
    let expectFile1 = utilities.tempFile(testSource(expectedName1));
    let expectedName2 = "__TestName2__";
    let expectFile2 = utilities.tempFile(testSource(expectedName2));

    let results = utilities.findTests("exportrunner", [expectFile1, expectFile2]);

    assert.equal(results.length, 2, "check for 2 tests");
    const [{test: testName1, file: testFile1},
        {test: testName2, file: testFile2}] = results;
    assert.equal(testName1, expectedName1);
    assert.equal(testFile1, expectFile1);
    assert.equal(testName2, expectedName2);
    assert.equal(testFile2, expectFile2);
    assert.equal(2, results.length);
}

// funcDetails.column returns start position of parameters
export function assert_columns_0_based() {
    var line0Func = vm.runInNewContext("(function func(a,b,c) {})");
    var column0Func = vm.runInNewContext("(function func\n(a,b,c) {})");
    var debug = vm.runInDebugContext('Debug');
    var line0FuncDetails = debug.findFunctionSourceLocation(line0Func);
    var column0FuncDetails = debug.findFunctionSourceLocation(column0Func);
    assert.equal(line0FuncDetails.line, 0, "lines are 0 based");
    assert.equal(column0FuncDetails.column, 0, "columns are 0 based");
}

export function find_tests_FunctionAtLine2_ExpectLine2() {
    let source = testSourceLine2("__TestName__");
    let testFile = utilities.tempFile(source);

    let results = utilities.findTests("exportrunner", [testFile]);

    assert.equal(results.length, 1, "check for 1 test");
    const [{line}] = results;
    assert.equal(line, 2, "check line number");
}

export function find_tests_FunctionAtColumn2_ExpectColumn2() {
    let source = testSourceColumn2("__TestName__");
    let testFile = utilities.tempFile(source);

    let results = utilities.findTests("exportrunner", [testFile]);

    assert.equal(results.length, 1, "check for 1 test");
    const [{column}] = results;
    assert.equal(column, 2, "check column number");
}

var testSource = name => `exports.${name} = function() {}`;

var testSourceLine2 = name => `exports.${name} = function
() {}`;

var testSourceColumn2 = name => `exports.${name} = function
 () {}`;
