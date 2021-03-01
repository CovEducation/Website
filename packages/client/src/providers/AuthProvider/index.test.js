import useAuth, { AuthProvider } from "./index";

test("module exports", () => {
  expect(useAuth).toBeTruthy();
  expect(AuthProvider).toBeTruthy();
});
