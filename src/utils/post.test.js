import { test } from "node:test";
import assert from "node:assert/strict";
import { slugTransform, parseTags } from "./post.js";

test("slugTransform makes a safe, short ID", () => {
  assert.equal(slugTransform("Hello, World!"), "hello-world");
  assert.equal(slugTransform("  --Trim me--  "), "trim-me");
  assert.equal(slugTransform("a".repeat(50)).length, 36);
  assert.equal(slugTransform("Résumé tips"), "r-sum-tips");
});

test("parseTags lowercases, dedupes and limits", () => {
  assert.deepEqual(parseTags("React, appwrite ,react"), ["react", "appwrite"]);
  assert.deepEqual(parseTags(" , ,"), []);
  assert.equal(parseTags("a,b,c,d,e,f,g").length, 5);
  assert.equal(parseTags("x".repeat(40))[0].length, 30);
});