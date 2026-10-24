const assert = require("node:assert/strict");
const { test } = require("node:test");

const User = require("../models/user");

test("local accounts omit googleId so sparse unique indexes accept multiple users", () => {
  const user = new User({
    username: "new-user",
    email: "new-user@example.com",
    password: "hashed-password",
  });

  assert.equal(user.googleId, undefined);
  assert.equal(Object.hasOwn(user.toObject(), "googleId"), false);
});
