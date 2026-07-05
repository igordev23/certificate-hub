import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CertificadosListView } from "../../src/views/CertificadosListView";

const mockSalvarValidade = jest.fn();
const mockSetEditId = jest.fn();
const mockSetNovaValidade = jest.fn();
const mockSetQ = jest.fn();
const mockCopiar = jest.fn();
const mockLoad = jest.fn();

const mockCertificate = {
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
};

jest.mock("../../src/view-models/useCertificatesViewModel", () => ({
  useCertificatesViewModel: () => ({
    filteredItems: [mockCertificate],
    loading: false,
    error: null,
    load: mockLoad,
    q: "",
    setQ: mockSetQ,
    editId: "1",
    setEditId: mockSetEditId,
    novaValidade: "2027-01-01",
    setNovaValidade: mockSetNovaValidade,
    copiar: mockCopiar,
    salvarValidade: mockSalvarValidade,
    copied: null,
  }),
}));

jest.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

jest.mock("../../src/components/PageHeader", () => ({
  PageHeader: ({ action }: any) => <div>{action}</div>,
}));

jest.mock("../../src/services/pdf", () => ({
  generateCertificatePdf: jest.fn(() => ({ save: jest.fn() })),
}));

jest.mock("../../src/services/api", () => ({
  api: {
    pdfUrl: (id: string) => `/pdf/${id}`,
  },
}));

jest.mock("../../src/components/CertificateQRCode", () => ({
  CertificateQRCode: () => null,
}));

jest.mock("../../src/models/certificate", () => ({
  isExpired: () => false,
}));

describe("ValidityForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders date input and OK button when in editing mode", () => {
    render(<CertificadosListView />);

    expect(screen.getByDisplayValue("2027-01-01")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
  });

  it("navigates from date input to OK button via Tab", async () => {
    const user = userEvent.setup();
    render(<CertificadosListView />);

    const dateInput = screen.getByDisplayValue("2027-01-01");
    await user.click(dateInput);
    expect(dateInput).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "OK" })).toHaveFocus();
  });

  it("calls salvarValidade when OK button is clicked", async () => {
    const user = userEvent.setup();
    render(<CertificadosListView />);

    await user.click(screen.getByRole("button", { name: "OK" }));
    expect(mockSalvarValidade).toHaveBeenCalledWith("1");
  });
});
