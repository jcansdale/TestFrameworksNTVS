import fs = require("fs");
import path = require("path");
import spawn = require("child_process");
import assert = require("assert");

export let projectFolder = path.join(__dirname, "..");
let runTestsFile = path.join(__dirname, "../run_tests.js");
let findTestsFile = path.join(__dirname, "../find_tests.js");

export function findTests(testFramework: string, testFiles: string[]) {
    let testFileList = testFiles.join(";");
    let discoverResultFile = path.join(__dirname, "result_file.json");
    unlinkLater(discoverResultFile);

    let args = [findTestsFile, testFramework,
        testFileList, discoverResultFile, projectFolder];
    let response = execNode(args);
    assert.equal(response.status, 0, `${runTestsFile} failed with exit code ${response.status }, message: ${response.message} and stdout: "${response.stdout}"`);

    return readResults(discoverResultFile);
}

function readResults(filename): Array<any> {
    let resultsJson = fs.readFileSync(filename, "utf8");
    return JSON.parse(resultsJson);
}

export function execTest(testName, testFile, workingFolder, projectFolder) {
    let args = [runTestsFile, "tape",
        testName, testFile, workingFolder, projectFolder];
    return execNode(args);
}

function execNode(args: string[]) {
    let stdout: string;
    let status = 0;
    let message;
    try {
        let node = process.argv[0];
        stdout = spawn.execFileSync(node, args, { encoding: "utf8" });
    }
    catch (e) {
        status = e.status;
        stdout = e.stdout;
        message = e.message;
    }

    return { status, stdout, message };
}

function getTempDir() {
    let tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
    return tempDir;
}

var tempFileCount = 0;
export function tempFile(content) {
    tempFileCount++;
    let name = `temp_${tempFileCount}.js`;
    let temp = getTempDir();
    let filename = path.join(temp, name);
    fs.writeFileSync(filename, content);
    unlinkLater(filename);
    return filename;
}

export function unlinkLater(filename) {
    setTimeout(() => {
        if (fs.exists(filename)) {
            fs.unlinkSync(filename);
        }
    }, 0);
}
