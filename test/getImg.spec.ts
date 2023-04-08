import { describe, it, expect } from "vitest";
import { getImg } from "@/utils";

describe("getImg", () => {
  it("returns the correct image path with default format", () => {
    const name = "matcap-opal";
    const expectedPath = "/src/assets/img/matcap-opal.png";

    expect(getImg(name)).toBe(expectedPath);
  });

  it("returns the correct image path with specified format", () => {
    const name = "earth_bumpmap";
    const format = "jpg";
    const expectedPath = "/src/assets/img/earth_bumpmap.jpg";

    expect(getImg(name, format)).toBe(expectedPath);
  });

  it("throws an error when image is not found", () => {
    const name = "not-a-real-image";

    expect(() => getImg(name)).toThrow();
  });
});
