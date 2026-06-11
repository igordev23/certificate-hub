import { renderHook } from "@testing-library/react";
import { useEnviosViewModel } from "../../src/view-models/useEnviosViewModel";

jest.mock("../../src/services/envios", () => ({
  envios: {
    list: jest.fn(),
  },
}));

import { envios } from "../../src/services/envios";

const mockEnvio = {
  id: 1,
  certificateId: "abc",
  recipientEmail: "test@test.com",
  recipientName: "João",
  status: "pendente" as const,
  data: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useEnviosViewModel", () => {
  it("returns items from envios.list on mount", () => {
    (envios.list as jest.Mock).mockReturnValue([mockEnvio]);
    const { result } = renderHook(() => useEnviosViewModel());
    expect(result.current.items).toEqual([mockEnvio]);
  });

  it("returns empty array when no envios", () => {
    (envios.list as jest.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useEnviosViewModel());
    expect(result.current.items).toEqual([]);
  });

  it("calls envios.list once on mount", () => {
    (envios.list as jest.Mock).mockReturnValue([]);
    renderHook(() => useEnviosViewModel());
    expect(envios.list).toHaveBeenCalledTimes(1);
  });
});
