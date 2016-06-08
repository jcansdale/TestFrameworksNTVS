import path = require("path");
import assert = require("assert");
import utilities = require("../utilities");

export function find_tests_PassTest_Expect1() {
    let expectedName = "__TestName__";
    let expectFile = utilities.tempFile(passTestSource(expectedName));

    let results = utilities.findTests("tape", [expectFile]);

    assert.equal(1, results.length);
    const [{test: testName, file: testFile}] = results;
    assert.equal(testName, expectedName);
    assert.equal(testFile, expectFile);
}

export function find_tests_FailTest_Expect1() {
    let expectedName = "__TestName__";
    let expectFile = utilities.tempFile(failTestSource(expectedName));

    let results = utilities.findTests("tape", [expectFile]);

    assert.equal(1, results.length);
    const [{test: testName, file: testFile}] = results;
    assert.equal(testName, expectedName);
    assert.equal(testFile, expectFile);
}

export function find_tests_TwoTestFiles_Expect2() {
    let expectedName1 = "__TestName1__";
    let expectFile1 = utilities.tempFile(passTestSource(expectedName1));
    let expectedName2 = "__TestName2__";
    let expectFile2 = utilities.tempFile(passTestSource(expectedName2));

    let results = utilities.findTests("tape", [expectFile1, expectFile2]);

    assert.equal(2, results.length);
    const [{test: testName1, file: testFile1},
        {test: testName2, file: testFile2}] = results;
    assert.equal(testName1, expectedName1);
    assert.equal(testFile1, expectFile1);
    assert.equal(testName2, expectedName2);
    assert.equal(testFile2, expectFile2);
}

export function find_tests_OneTest_LineAndColumnAtPosition0() {
    let testFile = utilities.tempFile(passTestSource("__TestName__"));

    let results = utilities.findTests("tape", [testFile]);

    const [{line, column}] = results;
    assert.equal(line, 0, "check line number");
    assert.equal(column, 0, "check column number");
}

export function find_tests_ErrorLoadingTestFile_NoTests() {
    let testFile = utilities.tempFile("throw new Error('Boom!');");

    let results = utilities.findTests("tape", [testFile]);

    assert.equal(results.length, 0, "check no tests were found");
    // error will be sent to stderr but tricky to check
}

var passTestSource = name => `
var test = require("tape");
test('${name}', function (t) {
    t.end();
});`

var failTestSource = name => `
var test = require("tape");
test('${name}', function (t) {
    t.plan(1);
    t.equal(1, 2);
});`
