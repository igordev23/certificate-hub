import { renderHook, act, waitFor } from "@testing-library/react";
import { useEditCertificateViewModel } from "../../src/view-models/useEditCertificateViewModel";

const mockNavigate = jest.fn();

jest.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock("../../src/services/api", () => ({
  api: {
    getCertificate: jest.fn(),
    updateCertificate: jest.fn(),
    pdfUrl: jest.fn((id: string) => `http://localhost:3000/api/certificates/${id}/pdf`),
  },
}));

import { toast } from "sonner";
import { api } from "../../src/services/api";

const mockCertificate = {
  id: "cert-123",
  recipientName: "João Silva",
  recipientCPF: "52998224725",
  courseName: "React",
  courseHours: 40,
  verificationCode: "ABC123",
  validityDate: "2027-12-31T00:00:00.000Z",
  templateId: "tpl-1",
  issuedAt: "2026-06-10T00:00:00.000Z",
  createdAt: "2026-06-10T00:00:00.000Z",
  updatedAt: "2026-06-10T00:00:00.000Z",
};

const expiredCertificate = {
  ...mockCertificate,
  id: "cert-456",
  validityDate: "2024-01-01T00:00:00.000Z",
};

beforeEach(() => {
  jest.clearAllMocks();
  mockNavigate.mockReset();
});

describe("useEditCertificateViewModel", () => {
  it("loads certificate on mount and populates form", async () => {
    (api.getCertificate as jest.Mock).mockResolvedValue(mockCertificate);
    const { result } = renderHook(() => useEditCertificateViewModel("cert-123"));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.certificate).toEqual(mockCertificate);
    expect(result.current.form.getValues("recipientName")).toBe("João Silva");
    expect(result.current.form.getValues("recipientCPF")).toBe("52998224725");
    expect(result.current.form.getValues("courseName")).toBe("React");
    expect(result.current.form.getValues("courseHours")).toBe(40);
    expect(result.current.form.getValues("validityDate")).toBe("2027-12-31");
  });

  it("shows error toast on load failure", async () => {
    (api.getCertificate as jest.Mock).mockRejectedValue(new Error("Falha ao carregar"));
    const { result } = renderHook(() => useEditCertificateViewModel("cert-123"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(toast.error).toHaveBeenCalledWith("Falha ao carregar", { duration: Infinity });
    expect(result.current.certificate).toBeNull();
  });

  it("returns expired false for valid certificate", async () => {
    (api.getCertificate as jest.Mock).mockResolvedValue(mockCertificate);
    const { result } = renderHook(() => useEditCertificateViewModel("cert-123"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.expired).toBe(false);
  });

  it("returns expired true for expired certificate", async () => {
    (api.getCertificate as jest.Mock).mockResolvedValue(expiredCertificate);
    const { result } = renderHook(() => useEditCertificateViewModel("cert-456"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.expired).toBe(true);
  });

  it("returns pdfUrl from api.pdfUrl", async () => {
    (api.getCertificate as jest.Mock).mockResolvedValue(mockCertificate);
    const { result } = renderHook(() => useEditCertificateViewModel("cert-123"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.pdfUrl).toBe("http://localhost:3000/api/certificates/cert-123/pdf");
  });

  it("submit calls updateCertificate and navigates on success", async () => {
    (api.getCertificate as jest.Mock).mockResolvedValue(mockCertificate);
    (api.updateCertificate as jest.Mock).mockResolvedValue({
      ...mockCertificate,
      recipientName: "João Souza",
    });
    const { result } = renderHook(() => useEditCertificateViewModel("cert-123"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.form.setValue("recipientName", "João Souza"));
    await act(async () => {
      await result.current.submit();
    });
    expect(api.updateCertificate).toHaveBeenCalledWith("cert-123", {
      recipientName: "João Souza",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      validityDate: expect.any(String),
    });
    expect(toast.success).toHaveBeenCalledWith("Certificado atualizado com sucesso!");
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/certificados" });
  });

  it("submit shows error toast with field errors from API details", async () => {
    (api.getCertificate as jest.Mock).mockResolvedValue(mockCertificate);
    (api.updateCertificate as jest.Mock).mockRejectedValue({
      details: [{ field: "recipientName", message: "Nome é obrigatório" }],
    });
    const { result } = renderHook(() => useEditCertificateViewModel("cert-123"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.submit();
    });
    expect(toast.error).toHaveBeenCalledWith(
      "Verifique os campos do formulário e tente novamente.",
      { duration: Infinity },
    );
    expect(result.current.submitting).toBe(false);
  });

  it("submit shows error toast with general message", async () => {
    (api.getCertificate as jest.Mock).mockResolvedValue(mockCertificate);
    (api.updateCertificate as jest.Mock).mockRejectedValue(new Error("Servidor ocupado"));
    const { result } = renderHook(() => useEditCertificateViewModel("cert-123"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.submit();
    });
    expect(toast.error).toHaveBeenCalledWith("Servidor ocupado", { duration: Infinity });
    expect(result.current.submitting).toBe(false);
  });

  it("cancel navigates to /certificados", async () => {
    (api.getCertificate as jest.Mock).mockResolvedValue(mockCertificate);
    const { result } = renderHook(() => useEditCertificateViewModel("cert-123"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.cancel());
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/certificados" });
  });

  it("returns empty string pdfUrl when certificate is null", () => {
    (api.getCertificate as jest.Mock).mockResolvedValue(mockCertificate);
    const { result } = renderHook(() => useEditCertificateViewModel("cert-123"));
    expect(result.current.pdfUrl).toBe("");
  });
});
