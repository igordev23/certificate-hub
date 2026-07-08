import { renderHook, waitFor } from "@testing-library/react";
import { useDashboardViewModel } from "../../src/view-models/useDashboardViewModel";

const mockCertificates = [
  {
    id: "1",
    recipientName: "João",
    recipientCPF: "52998224725",
    courseName: "React",
    courseHours: 40,
    verificationCode: "ABC",
    validityDate: "2027-01-01T00:00:00.000Z",
    templateId: "tpl-1",
    issuedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    recipientName: "Maria",
    recipientCPF: "11122233344",
    courseName: "Node",
    courseHours: 60,
    verificationCode: "XYZ",
    validityDate: "2025-01-01T00:00:00.000Z",
    templateId: "tpl-2",
    issuedAt: "2025-01-01T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
  },
];

const mockTemplates = [{ id: "tpl-1", name: "Default" }];

jest.mock("../../src/services/api", () => ({
  api: {
    listCertificates: jest.fn(),
    listTemplates: jest.fn(),
  },
}));

jest.mock("../../src/models/certificate", () => ({
  isExpired: jest.fn(),
}));

jest.mock("../../src/services/envios", () => ({
  envios: {
    list: jest.fn(),
  },
}));

import { api } from "../../src/services/api";
import { isExpired } from "../../src/models/certificate";
import { envios } from "../../src/services/envios";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useDashboardViewModel", () => {
  it("loads stats on mount", async () => {
    (api.listCertificates as jest.Mock).mockResolvedValue(mockCertificates);
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (isExpired as jest.Mock).mockImplementation((date: string) => new Date(date) < new Date());
    (envios.list as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useDashboardViewModel());
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.stats.certs).toBe(2);
    expect(result.current.stats.ativos).toBe(1);
    expect(result.current.stats.templates).toBe(1);
    expect(result.current.stats.envios).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it("shows friendly error message from API, not stack trace", async () => {
    const apiError = new Error("Unauthorized - verifique suas credenciais");
    (api.listCertificates as jest.Mock).mockRejectedValue(apiError);
    (api.listTemplates as jest.Mock).mockRejectedValue(apiError);

    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Unauthorized - verifique suas credenciais");
    expect(result.current.error).not.toContain("Error:");
    expect(result.current.error).not.toContain("at ");
  });

  it("handles API 401 with HTTP status fallback", async () => {
    (api.listCertificates as jest.Mock).mockRejectedValue(new Error("HTTP 401"));
    (api.listTemplates as jest.Mock).mockRejectedValue(new Error("HTTP 401"));

    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("HTTP 401");
    expect(result.current.error).not.toContain("stack");
    expect(result.current.error).not.toContain("Error:");
  });

  it("calculates ativos excluding expired certificates", async () => {
    (api.listCertificates as jest.Mock).mockResolvedValue(mockCertificates);
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (isExpired as jest.Mock).mockReturnValue(true);
    (envios.list as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.ativos).toBe(0);
  });

  it("counts envios from envios.list", async () => {
    (api.listCertificates as jest.Mock).mockResolvedValue([]);
    (api.listTemplates as jest.Mock).mockResolvedValue([]);
    (envios.list as jest.Mock).mockReturnValue([{ id: 1 } as any]);

    const { result } = renderHook(() => useDashboardViewModel());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.envios).toBe(1);
  });
});
