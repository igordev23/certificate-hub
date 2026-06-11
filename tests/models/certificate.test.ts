import { isExpired } from "../../src/models/certificate";

describe("isExpired", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns true when date is in the past", () => {
    jest.setSystemTime(new Date("2026-06-10"));
    expect(isExpired("2025-01-01")).toBe(true);
  });

  it("returns false when date is in the future", () => {
    jest.setSystemTime(new Date("2026-06-10"));
    expect(isExpired("2027-01-01")).toBe(false);
  });

  it("returns false for today's date", () => {
    jest.setSystemTime(new Date("2026-06-10T12:00:00"));
    expect(isExpired("2026-06-10T23:59:00")).toBe(false);
  });

  it("returns true for yesterday's date", () => {
    jest.setSystemTime(new Date("2026-06-10T12:00:00"));
    expect(isExpired("2026-06-09T23:59:00")).toBe(true);
  });
});
