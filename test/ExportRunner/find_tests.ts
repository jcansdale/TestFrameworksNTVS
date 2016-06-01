import path = require("path");
import assert = require("assert");
import tape = require("../../ExportRunner/exportrunner.js");
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

//export function find_tests_OneTest_LineAndColumnAtPosition1() {
//    let testFile = utilities.tempFile(passTestSource("__TestName__"));

//    let results = utilities.findTests("tape", [testFile]);

//    const [{line, column}] = results;
//    assert.equal(line, 1, "check line number");
//    assert.equal(column, 1, "check column number");
//}

var testSource = name => `exports.${name} = function() {}`
