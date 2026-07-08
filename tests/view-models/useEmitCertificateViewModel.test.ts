import { renderHook, act, waitFor } from "@testing-library/react";
import {
  formatCPF,
  useEmitCertificateViewModel,
} from "../../src/view-models/useEmitCertificateViewModel";

const mockTemplates = [
  { id: "tpl-1", name: "Default", description: "", layoutConfig: {}, createdAt: "", updatedAt: "" },
];

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
    listTemplates: jest.fn(),
    emitCertificate: jest.fn(),
  },
}));

jest.mock("../../src/services/envios", () => ({
  envios: {
    add: jest.fn(),
  },
}));

import { toast } from "sonner";
import { api } from "../../src/services/api";
import { envios } from "../../src/services/envios";

beforeEach(() => {
  jest.clearAllMocks();
  mockNavigate.mockReset();
});

describe("formatCPF", () => {
  it("returns raw digits for <= 3 chars", () => {
    expect(formatCPF("529")).toBe("529");
  });

  it("adds dot after 3rd digit", () => {
    expect(formatCPF("5299")).toBe("529.9");
  });

  it("adds second dot after 6th digit", () => {
    expect(formatCPF("5299822")).toBe("529.982.2");
  });

  it("adds dash after 9th digit", () => {
    expect(formatCPF("52998224725")).toBe("529.982.247-25");
  });

  it("strips non-digits and limits to 11 chars", () => {
    expect(formatCPF("529.982.247-25123")).toBe("529.982.247-25");
  });

  it("handles empty string", () => {
    expect(formatCPF("")).toBe("");
  });

  it("handles only non-digits", () => {
    expect(formatCPF("abc.def.ghi-jk")).toBe("");
  });
});

describe("useEmitCertificateViewModel", () => {
  function setField(form: any, field: string, value: any) {
    act(() => form.setValue(field, value));
  }

  it("loads templates on mount", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    expect(result.current.loadingTemplates).toBe(true);
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    expect(result.current.templates).toEqual(mockTemplates);
    expect(result.current.form.getValues("templateId")).toBe("tpl-1");
  });

  it("sets default form state", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    expect(result.current.form.getValues("recipientName")).toBe("");
    expect(result.current.form.getValues("recipientCPF")).toBe("");
    expect(result.current.form.getValues("courseHours")).toBe(40);
    expect(result.current.submitting).toBe(false);
  });

  it("setValue updates form field", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    setField(result.current.form, "recipientName", "João Silva");
    expect(result.current.form.getValues("recipientName")).toBe("João Silva");
  });

  it("submit calls emitCertificate and navigates on success", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.emitCertificate as jest.Mock).mockResolvedValue({
      id: "cert-1",
      recipientName: "João Silva",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      verificationCode: "ABC123",
      validityDate: "2027-01-01T00:00:00.000Z",
      templateId: "tpl-1",
      issuedAt: "2026-06-10T00:00:00.000Z",
      createdAt: "2026-06-10T00:00:00.000Z",
      updatedAt: "2026-06-10T00:00:00.000Z",
    });
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    setField(result.current.form, "recipientName", "João Silva");
    setField(result.current.form, "recipientCPF", "529.982.247-25");
    setField(result.current.form, "courseName", "React");
    setField(result.current.form, "courseHours", 40);
    setField(result.current.form, "validityDate", "2027-01-01");
    setField(result.current.form, "email", "joao@test.com");
    await act(async () => {
      await result.current.submit();
    });
    expect(api.emitCertificate).toHaveBeenCalledWith({
      recipientName: "João Silva",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      validityDate: expect.any(String),
      templateId: "tpl-1",
    });
    expect(envios.add).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/certificados" });
  });

  it("submit does not call envios.add when email is empty", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.emitCertificate as jest.Mock).mockResolvedValue({
      id: "cert-1",
      recipientName: "João Silva",
      recipientCPF: "52998224725",
      courseName: "React",
      courseHours: 40,
      verificationCode: "ABC123",
      validityDate: "2027-01-01T00:00:00.000Z",
      templateId: "tpl-1",
      issuedAt: "2026-06-10T00:00:00.000Z",
      createdAt: "2026-06-10T00:00:00.000Z",
      updatedAt: "2026-06-10T00:00:00.000Z",
    });
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    setField(result.current.form, "recipientName", "João Silva");
    setField(result.current.form, "recipientCPF", "529.982.247-25");
    setField(result.current.form, "courseName", "React");
    await act(async () => {
      await result.current.submit();
    });
    expect(envios.add).not.toHaveBeenCalled();
  });

  it("submit shows toast with validation errors from API details", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.emitCertificate as jest.Mock).mockRejectedValue({
      details: [{ field: "recipientName", message: "Nome é obrigatório" }],
    });
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    setField(result.current.form, "recipientName", "João Silva");
    setField(result.current.form, "recipientCPF", "529.982.247-25");
    setField(result.current.form, "courseName", "React");
    await act(async () => {
      await result.current.submit();
    });
    expect(toast.error).toHaveBeenCalledWith(
      "Verifique os campos do formulário e tente novamente.",
      expect.any(Object),
    );
    expect(result.current.submitting).toBe(false);
  });

  it("submit shows toast with general error from API message", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.emitCertificate as jest.Mock).mockRejectedValue(new Error("Servidor ocupado"));
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    setField(result.current.form, "recipientName", "João Silva");
    setField(result.current.form, "recipientCPF", "529.982.247-25");
    setField(result.current.form, "courseName", "React");
    await act(async () => {
      await result.current.submit();
    });
    expect(toast.error).toHaveBeenCalledWith("Servidor ocupado", expect.any(Object));
    expect(result.current.submitting).toBe(false);
  });

  it("submit shows default toast when no message or details", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.emitCertificate as jest.Mock).mockRejectedValue({});
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    setField(result.current.form, "recipientName", "João Silva");
    setField(result.current.form, "recipientCPF", "529.982.247-25");
    setField(result.current.form, "courseName", "React");
    await act(async () => {
      await result.current.submit();
    });
    expect(toast.error).toHaveBeenCalledWith(
      "Não foi possível emitir o certificado. Tente novamente.",
      expect.any(Object),
    );
    expect(result.current.submitting).toBe(false);
  });

  it("cancel navigates to /certificados", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useEmitCertificateViewModel());
    await waitFor(() => expect(result.current.loadingTemplates).toBe(false));
    act(() => result.current.cancel());
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/certificados" });
  });
});
