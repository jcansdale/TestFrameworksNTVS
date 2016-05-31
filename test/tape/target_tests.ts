import test = require("tape");

test('fail_test', function (t) {
    t.plan(1);
    t.equal(2+2, 5);
});

test('pass_test', function (t) {
    t.plan(1);
    t.equal(1, 1);
});

test('pass2_test', function (t) {
    t.plan(2);
    t.equal(1, 1);
    t.equal(1, 1);
});

test('empty_test', function (t) {
    t.end();
});

test('comment_test', function (t) {
    t.comment("Hello, World!");
    t.end();
});
