import { envios } from "../../src/services/envios";
import type { EnvioEmail } from "../../src/models/envio";

const mock: EnvioEmail = {
  id: 1,
  certificateId: "abc",
  recipientEmail: "test@test.com",
  recipientName: "João",
  status: "pendente",
  data: "2026-01-01T00:00:00.000Z",
};

beforeEach(() => {
  localStorage.clear();
});

describe("envios.list", () => {
  it("returns empty array when no data", () => {
    expect(envios.list()).toEqual([]);
  });

  it("returns parsed items from localStorage", () => {
    localStorage.setItem("certifyhub:envios", JSON.stringify([mock]));
    expect(envios.list()).toEqual([mock]);
  });

  it("returns empty array on parse error", () => {
    localStorage.setItem("certifyhub:envios", "{invalid}");
    expect(envios.list()).toEqual([]);
  });

  it("returns empty array when window is undefined", () => {
    const origWindow = globalThis.window;
    (globalThis as any).window = undefined;
    expect(envios.list()).toEqual([]);
    (globalThis as any).window = origWindow;
  });
});

describe("envios.add", () => {
  it("prepends item to empty list", () => {
    envios.add(mock);
    expect(envios.list()).toEqual([mock]);
  });

  it("prepends item to existing list", () => {
    const existing: EnvioEmail = { ...mock, id: 0 };
    localStorage.setItem("certifyhub:envios", JSON.stringify([existing]));
    envios.add(mock);
    expect(envios.list()).toEqual([mock, existing]);
  });
});
