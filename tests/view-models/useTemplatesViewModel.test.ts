import { renderHook, act, waitFor } from "@testing-library/react";
import { useTemplatesViewModel } from "../../src/view-models/useTemplatesViewModel";

const origConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (typeof args[0] === "string" && args[0].includes("inside a test was not wrapped in act")) return;
    origConsoleError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = origConsoleError;
});

const mockTemplates = [
  {
    id: "1",
    name: "Template Azul",
    description: "Template com fundo azul",
    layoutConfig: {
      backgroundColor: "#0000FF",
      primaryColor: "#1a365d",
      borderColor: "#c4a35a",
      titleFontSize: 36,
      bodyFontSize: 14,
      showLogo: true,
      showBorder: true,
    },
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

jest.mock("../../src/services/api", () => ({
  api: {
    listTemplates: jest.fn(),
    createTemplate: jest.fn(),
    deleteTemplate: jest.fn(),
    updateTemplate: jest.fn(),
  },
}));

import { api } from "../../src/services/api";

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(window, "confirm").mockImplementation(() => true);
  jest.spyOn(window, "alert").mockImplementation(() => {});
});

describe("useTemplatesViewModel", () => {
  it("loads templates on mount", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useTemplatesViewModel());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.items).toEqual(mockTemplates);
    expect(result.current.error).toBeNull();
  });

  it("sets error when listTemplates fails", async () => {
    (api.listTemplates as jest.Mock).mockRejectedValue(new Error("Erro ao carregar"));
    const { result } = renderHook(() => useTemplatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Erro ao carregar");
  });

  it("add creates template and reloads list", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.createTemplate as jest.Mock).mockResolvedValue(mockTemplates[0]);
    const { result } = renderHook(() => useTemplatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      result.current.setName("Novo Template");
      result.current.setDescription("Descrição");
    });
    await act(async () => {
      await result.current.add({ preventDefault: jest.fn() } as any);
    });
    expect(api.createTemplate).toHaveBeenCalledWith({
      name: "Novo Template",
      description: "Descrição",
      layoutConfig: expect.objectContaining({
        backgroundColor: "#FFFFFF",
      }),
    });
    expect(result.current.name).toBe("");
    expect(result.current.description).toBe("");
    expect(result.current.open).toBe(false);
  });

  it("add shows alert on error", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.createTemplate as jest.Mock).mockRejectedValue(new Error("Falha ao criar"));
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const { result } = renderHook(() => useTemplatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.add({ preventDefault: jest.fn() } as any);
    });
    expect(alertSpy).toHaveBeenCalledWith("Falha ao criar");
    alertSpy.mockRestore();
  });

  it("remove calls deleteTemplate and reloads when confirmed", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.deleteTemplate as jest.Mock).mockResolvedValue(undefined);
    const { result } = renderHook(() => useTemplatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.remove("1");
    });
    expect(api.deleteTemplate).toHaveBeenCalledWith("1");
  });

  it("remove does not delete when not confirmed", async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useTemplatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.remove("1");
    });
    expect(api.deleteTemplate).not.toHaveBeenCalled();
  });

  it("remove shows alert on error", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.deleteTemplate as jest.Mock).mockRejectedValue(new Error("Falha ao remover"));
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const { result } = renderHook(() => useTemplatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.remove("1");
    });
    expect(alertSpy).toHaveBeenCalledWith("Falha ao remover");
    alertSpy.mockRestore();
  });

  it("startEditing sets editing state with template data", () => {
    const { result } = renderHook(() => useTemplatesViewModel());
    act(() => result.current.startEditing(mockTemplates[0]));
    expect(result.current.editingTemplate).toEqual(mockTemplates[0]);
    expect(result.current.editName).toBe("Template Azul");
    expect(result.current.editDescription).toBe("Template com fundo azul");
    expect(result.current.layout.backgroundColor).toBe("#0000FF");
  });

  it("startEditing merges with DEFAULT_LAYOUT when layoutConfig is partial", () => {
    const partial = {
      ...mockTemplates[0],
      layoutConfig: { backgroundColor: "#FF0000" },
    };
    const { result } = renderHook(() => useTemplatesViewModel());
    act(() => result.current.startEditing(partial));
    expect(result.current.layout.backgroundColor).toBe("#FF0000");
    expect(result.current.layout.primaryColor).toBe("#1a365d");
    expect(result.current.layout.showLogo).toBe(true);
  });

  it("saveChanges calls updateTemplate and reloads", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.updateTemplate as jest.Mock).mockResolvedValue(mockTemplates[0]);
    const { result } = renderHook(() => useTemplatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.startEditing(mockTemplates[0]));
    act(() => result.current.setEditName("Editado"));
    await act(async () => {
      await result.current.saveChanges();
    });
    expect(api.updateTemplate).toHaveBeenCalledWith("1", {
      name: "Editado",
      description: "Template com fundo azul",
      layoutConfig: expect.any(Object),
    });
    expect(result.current.editingTemplate).toBeNull();
  });

  it("saveChanges does nothing when no editingTemplate", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    const { result } = renderHook(() => useTemplatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.saveChanges();
    });
    expect(api.updateTemplate).not.toHaveBeenCalled();
  });

  it("saveChanges shows alert on error", async () => {
    (api.listTemplates as jest.Mock).mockResolvedValue(mockTemplates);
    (api.updateTemplate as jest.Mock).mockRejectedValue(new Error("Falha ao salvar"));
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    const { result } = renderHook(() => useTemplatesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.startEditing(mockTemplates[0]));
    await act(async () => {
      await result.current.saveChanges();
    });
    expect(alertSpy).toHaveBeenCalledWith("Falha ao salvar");
    alertSpy.mockRestore();
  });

  it("cancelEditing clears editingTemplate", () => {
    const { result } = renderHook(() => useTemplatesViewModel());
    act(() => result.current.startEditing(mockTemplates[0]));
    expect(result.current.editingTemplate).not.toBeNull();
    act(() => result.current.cancelEditing());
    expect(result.current.editingTemplate).toBeNull();
  });

  it("toggles open state", () => {
    const { result } = renderHook(() => useTemplatesViewModel());
    expect(result.current.open).toBe(false);
    act(() => result.current.setOpen(true));
    expect(result.current.open).toBe(true);
  });
});
