import { renderHook, act, waitFor } from "@testing-library/react";
import { useVerifyViewModel } from "../../src/view-models/useVerifyViewModel";

const mockResult = {
  isAuthentic: true,
  isValid: true,
  certificate: {
    recipientName: "João Silva",
    courseName: "React",
    courseHours: 40,
    issuedAt: "2026-01-01T00:00:00.000Z",
    validityDate: "2027-01-01T00:00:00.000Z",
    verificationCode: "ABC123",
  },
};

jest.mock("../../src/services/api", () => ({
  api: {
    verify: jest.fn(),
  },
}));

import { api } from "../../src/services/api";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useVerifyViewModel", () => {
  it("starts with empty state", () => {
    const { result } = renderHook(() => useVerifyViewModel());
    expect(result.current.cpf).toBe("");
    expect(result.current.codigo).toBe("");
    expect(result.current.loading).toBe(false);
    expect(result.current.resultado).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("sets cpf and codigo", () => {
    const { result } = renderHook(() => useVerifyViewModel());
    act(() => result.current.setCpf("529.982.247-25"));
    act(() => result.current.setCodigo("ABC123"));
    expect(result.current.cpf).toBe("529.982.247-25");
    expect(result.current.codigo).toBe("ABC123");
  });

  it("buscar calls api.verify with stripped CPF and uppercase code", async () => {
    (api.verify as jest.Mock).mockResolvedValue(mockResult);
    const { result } = renderHook(() => useVerifyViewModel());
    act(() => result.current.setCpf("529.982.247-25"));
    act(() => result.current.setCodigo("abc123 "));
    await act(async () => {
      await result.current.buscar({ preventDefault: jest.fn() } as any);
    });
    expect(api.verify).toHaveBeenCalledWith("52998224725", "ABC123");
    expect(result.current.resultado).toEqual(mockResult);
    expect(result.current.error).toBeNull();
  });

  it("buscar sets error on API failure with details", async () => {
    (api.verify as jest.Mock).mockRejectedValue({
      details: [{ message: "CPF inválido" }, { message: "Código inválido" }],
    });
    const { result } = renderHook(() => useVerifyViewModel());
    await act(async () => {
      await result.current.buscar({ preventDefault: jest.fn() } as any);
    });
    expect(result.current.error).toBe("CPF inválido. Código inválido");
    expect(result.current.resultado).toBeNull();
  });

  it("buscar sets error on API failure with simple message", async () => {
    (api.verify as jest.Mock).mockRejectedValue(new Error("Servidor indisponível"));
    const { result } = renderHook(() => useVerifyViewModel());
    await act(async () => {
      await result.current.buscar({ preventDefault: jest.fn() } as any);
    });
    expect(result.current.error).toBe("Servidor indisponível");
  });

  it("buscar sets generic error when no message", async () => {
    (api.verify as jest.Mock).mockRejectedValue({});
    const { result } = renderHook(() => useVerifyViewModel());
    await act(async () => {
      await result.current.buscar({ preventDefault: jest.fn() } as any);
    });
    expect(result.current.error).toBe("Erro desconhecido");
  });

  it("buscar clears previous resultado and error before searching", async () => {
    (api.verify as jest.Mock).mockResolvedValue(mockResult);
    const { result } = renderHook(() => useVerifyViewModel());
    act(() => result.current.setCpf("529.982.247-25"));
    act(() => result.current.setCodigo("ABC123"));
    await act(async () => {
      await result.current.buscar({ preventDefault: jest.fn() } as any);
    });
    expect(result.current.resultado).toEqual(mockResult);
    expect(result.current.loading).toBe(false);
  });

  it("sets loading to true while searching and false after", async () => {
    let resolvePromise!: (val: typeof mockResult) => void;
    const promise = new Promise<typeof mockResult>((resolve) => {
      resolvePromise = resolve;
    });
    (api.verify as jest.Mock).mockReturnValue(promise);

    const { result } = renderHook(() => useVerifyViewModel());
    act(() => result.current.setCpf("52998224725"));
    act(() => result.current.setCodigo("ABC123"));

    let buscarPromise: Promise<void>;
    act(() => {
      buscarPromise = result.current.buscar({ preventDefault: jest.fn() } as any);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise(mockResult);
      await buscarPromise!;
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.resultado).toEqual(mockResult);
  });

  it("sets error when api.verify throws an error with details", async () => {
    const error = new Error("Erro de validação");
    (error as any).details = [{ message: "CPF inválido" }];
    (api.verify as jest.Mock).mockRejectedValue(error);
    const { result } = renderHook(() => useVerifyViewModel());
    await act(async () => {
      await result.current.buscar({ preventDefault: jest.fn() } as any);
    });
    expect(result.current.error).toBe("CPF inválido");
  });
});
