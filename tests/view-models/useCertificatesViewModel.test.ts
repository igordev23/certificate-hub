import { renderHook, act, waitFor } from "@testing-library/react";
import { useCertificatesViewModel } from "../../src/view-models/useCertificatesViewModel";

const mockCertificates = [
  {
    id: "1",
    recipientName: "João Silva",
    recipientCPF: "52998224725",
    courseName: "React",
    courseHours: 40,
    verificationCode: "ABC123",
    validityDate: "2027-01-01T00:00:00.000Z",
    templateId: "tpl-1",
    issuedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    recipientName: "Maria Souza",
    recipientCPF: "11122233344",
    courseName: "Node.js",
    courseHours: 60,
    verificationCode: "XYZ789",
    validityDate: "2026-06-01T00:00:00.000Z",
    templateId: "tpl-2",
    issuedAt: "2026-02-01T00:00:00.000Z",
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
  },
];

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("../../src/services/api", () => ({
  api: {
    listCertificates: jest.fn(),
    updateValidity: jest.fn(),
  },
}));

import { toast } from "sonner";
import { api } from "../../src/services/api";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useCertificatesViewModel", () => {
  it("loads certificates on mount", async () => {
    (api.listCertificates as jest.Mock).mockResolvedValue(mockCertificates);
    const { result } = renderHook(() => useCertificatesViewModel());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.items).toEqual(mockCertificates);
    expect(result.current.error).toBeNull();
  });

  it("sets error when listCertificates fails", async () => {
    (api.listCertificates as jest.Mock).mockRejectedValue(new Error("Network error"));
    const { result } = renderHook(() => useCertificatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Network error");
    expect(result.current.items).toEqual([]);
  });

  it("filters items by recipientName", async () => {
    (api.listCertificates as jest.Mock).mockResolvedValue(mockCertificates);
    const { result } = renderHook(() => useCertificatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.setQ("joão"));
    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].id).toBe("1");
  });

  it("filters items by CPF", async () => {
    (api.listCertificates as jest.Mock).mockResolvedValue(mockCertificates);
    const { result } = renderHook(() => useCertificatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.setQ("11122233344"));
    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].id).toBe("2");
  });

  it("filters items by verificationCode", async () => {
    (api.listCertificates as jest.Mock).mockResolvedValue(mockCertificates);
    const { result } = renderHook(() => useCertificatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.setQ("xyz789"));
    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].id).toBe("2");
  });

  it("returns all items when query is empty", async () => {
    (api.listCertificates as jest.Mock).mockResolvedValue(mockCertificates);
    const { result } = renderHook(() => useCertificatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.filteredItems).toHaveLength(2);
  });

  it("returns empty filteredItems when no match", async () => {
    (api.listCertificates as jest.Mock).mockResolvedValue(mockCertificates);
    const { result } = renderHook(() => useCertificatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.setQ("zzzzzz"));
    expect(result.current.filteredItems).toHaveLength(0);
  });

  it("salvarValidade calls updateValidity and reloads", async () => {
    (api.listCertificates as jest.Mock).mockResolvedValue(mockCertificates);
    (api.updateValidity as jest.Mock).mockResolvedValue(mockCertificates[0]);
    const { result } = renderHook(() => useCertificatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.setNovaValidade("2028-01-01"));
    act(() => result.current.setEditId("1"));
    await act(async () => {
      await result.current.salvarValidade("1");
    });
    expect(api.updateValidity).toHaveBeenCalledWith("1", expect.stringContaining("2028-01-01"));
    expect(result.current.editId).toBeNull();
  });

  it("salvarValidade shows toast on error", async () => {
    (api.listCertificates as jest.Mock).mockResolvedValue(mockCertificates);
    (api.updateValidity as jest.Mock).mockRejectedValue(new Error("Falha na atualização"));
    const { result } = renderHook(() => useCertificatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.setNovaValidade("2028-01-01"));
    await act(async () => {
      await result.current.salvarValidade("1");
    });
    expect(toast.error).toHaveBeenCalledWith("Falha na atualização", expect.any(Object));
  });

  it("copiar copies to clipboard and sets copied state", async () => {
    (api.listCertificates as jest.Mock).mockResolvedValue(mockCertificates);
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const { result } = renderHook(() => useCertificatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.copiar(mockCertificates[0]));
    expect(writeText).toHaveBeenCalledWith("ABC123");
    expect(result.current.copied).toBe("1");
  });
});
