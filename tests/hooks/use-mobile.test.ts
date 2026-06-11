import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "../../src/hooks/use-mobile";

describe("useIsMobile", () => {
  const originalInnerWidth = window.innerWidth;
  const matchMediaMock = jest.fn();

  beforeEach(() => {
    matchMediaMock.mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
    Object.defineProperty(window, "matchMedia", {
      value: matchMediaMock,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      value: originalInnerWidth,
      writable: true,
    });
  });

  it("returns true when screen width is less than 768", () => {
    Object.defineProperty(window, "innerWidth", { value: 767, writable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("returns false when screen width is 768 or more", () => {
    Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("returns false at exactly 768", () => {
    Object.defineProperty(window, "innerWidth", { value: 768, writable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it("sets up matchMedia listener on mount", () => {
    const addEventListener = jest.fn();
    matchMediaMock.mockReturnValue({
      addEventListener,
      removeEventListener: jest.fn(),
    });
    Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });
    renderHook(() => useIsMobile());
    expect(matchMediaMock).toHaveBeenCalledWith("(max-width: 767px)");
    expect(addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("cleans up matchMedia listener on unmount", () => {
    const removeEventListener = jest.fn();
    matchMediaMock.mockReturnValue({
      addEventListener: jest.fn(),
      removeEventListener,
    });
    Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });
    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    expect(removeEventListener).toHaveBeenCalled();
  });
});
