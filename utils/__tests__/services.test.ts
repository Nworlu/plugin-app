import { getIsActive } from "@/utils/services";

describe("getIsActive", () => {
  it("returns true when items match", () => {
    expect(getIsActive("home", "home")).toBe(true);
  });

  it("returns false when items do not match", () => {
    expect(getIsActive("home", "profile")).toBe(false);
  });
});
