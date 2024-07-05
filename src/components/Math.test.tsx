import { test, expect } from "vitest";
import { render } from "@solidjs/testing-library";
import Math from "./Math";

test("renders LaTeX", async () => {
  const { container } = render(() => <Math value="x^2" />);
  const katex = container.querySelectorAll(".katex");
  expect(katex.length).toBe(1);
});
