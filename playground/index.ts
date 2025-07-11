import z from "zod";
import { withTry, Try, zMaybe, Some, None } from "../index";

const UserSchema = z.object({
  name: z.string(),
  email: z.email(),
  other: z.object({ phone: zMaybe(z.string()) }),
});

type User = z.infer<typeof UserSchema>;

const uNone: User = {
  name: "John",
  email: "john@doe.com",
  other: { phone: new None() },
};

const uNoneStr = JSON.stringify(uNone);

console.log(uNoneStr);

const xNone: Try<User> = withTry(() => JSON.parse(uNoneStr)).map((uObj) =>
  z.parse(UserSchema, uObj),
);

console.log(xNone);

const uSome: User = {
  name: "John",
  email: "john@doe.com",
  other: { phone: new Some("111-111-1111") },
};

const uSomeStr = JSON.stringify(uSome);

console.log(uSomeStr);

const xSome: Try<User> = withTry(() => JSON.parse(uSomeStr)).map((uObj) =>
  z.parse(UserSchema, uObj),
);

console.log(xSome);
