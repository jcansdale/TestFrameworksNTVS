import path = require("path");
import assert = require("assert");
import utilities = require("../utilities");

export function find_tests_OneTest_Expect1Test() {
    let expectedName = "__TestName__";
    let source = testSource(expectedName);
    let expectFile = utilities.tempFile(source);

    let results = utilities.findTests("mocha", [expectFile]);

    assert.equal(results.length, 1, "check for 1 test");
    const [{test: testName, file: testFile}] = results;
    assert.equal(testFile, expectFile);
}

export function find_tests_OneTestWithName_ExpectName() {
    let expectName = "__TestName__";
    let source = testSource(expectName);
    let expectFile = utilities.tempFile(source);

    let results = utilities.findTests("mocha", [expectFile]);

    assert.equal(results.length, 1, "check for 1 test");
    const [{test: testName, file: testFile}] = results;
    assert.equal(testName, " " + expectName, "This probably shouldn't start with a space!");
}

export function find_tests_OneTestWithDescription_ExpectDescription() {
    let description = "__Description__";
    let name = "__TestName__";
    let expectedFullName = toFullName(description, name);
    let source = testWithDescriptionSource(description, name);
    let expectFile = utilities.tempFile(source);

    let results = utilities.findTests("mocha", [expectFile]);

    assert.equal(results.length, 1, "check for 1 test");
    const [{test: testName, file: testFile}] = results;
    assert.equal(testName, expectedFullName);
    assert.equal(testFile, expectFile);
}

export function find_tests_TwoTestFiles_Expect2Tests() {
    let expectedName1 = "__TestName1__";
    let expectFile1 = utilities.tempFile(testSource(expectedName1));
    let expectedName2 = "__TestName2__";
    let expectFile2 = utilities.tempFile(testSource(expectedName2));

    let results = utilities.findTests("mocha", [expectFile1, expectFile2]);

    assert.equal(results.length, 2, "check for 2 tests");
    const [{test: testName1, file: testFile1},
        {test: testName2, file: testFile2}] = results;
    assert.equal(testFile1, expectFile1);
    assert.equal(testFile2, expectFile2);
}

export function find_tests_OneTest_EditorExpects1BasedLineAndColumn() {
    let source = testSource("__TestName__");
    let testFile = utilities.tempFile(source);

    let results = utilities.findTests("mocha", [testFile]);

    const [{line, column}] = results;
    assert.equal(line, 1, "check line number");
    assert.equal(column, 1, "check column number");
}

var testSource = name => `it('${name}', function () { })`;

var testWithDescriptionSource = (description, name) =>
`describe('${description}', function() {
    it('${name}', function () { })
})`;

var toFullName = (description, name) => `${description} ${name}`;
