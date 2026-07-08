import { test } from "@playwright/test";

const API = "http://localhost:3000/api";

const TEMPLATES = [
  {
    name: "Padrão Institucional",
    description: "Template oficial da instituição",
    layoutConfig: {
      backgroundColor: "#FFFFFF",
      primaryColor: "#1a365d",
      titleFontSize: 36,
      bodyFontSize: 14,
      showBorder: true,
      borderColor: "#c4a35a",
    },
  },
  {
    name: "Curso Livre",
    description: "Para cursos de extensão e capacitação",
    layoutConfig: {
      backgroundColor: "#F8F5F0",
      primaryColor: "#2d6a4f",
      titleFontSize: 32,
      bodyFontSize: 13,
      showBorder: true,
      borderColor: "#95b8a0",
    },
  },
  {
    name: "Workshop",
    description: "Template moderno para eventos rápidos",
    layoutConfig: {
      backgroundColor: "#0f172a",
      primaryColor: "#f8fafc",
      titleFontSize: 28,
      bodyFontSize: 12,
      showBorder: false,
    },
  },
];

const PEOPLE = [
  {
    name: "Ana Beatriz Oliveira",
    cpf: "52998224725",
    course: "Gestão de Projetos Ágeis",
    hours: 60,
  },
  {
    name: "Carlos Eduardo Lima",
    cpf: "81290752005",
    course: "Programação Web Full Stack",
    hours: 120,
  },
  {
    name: "Marina Fernandes Costa",
    cpf: "04538762090",
    course: "Análise de Dados com Python",
    hours: 80,
  },
  { name: "Rafael Souza Martins", cpf: "39628475005", course: "UI/UX Design Avançado", hours: 40 },
  {
    name: "Juliana Pereira Rocha",
    cpf: "72819463020",
    course: "Cloud Computing com AWS",
    hours: 100,
  },
  {
    name: "Thiago Almeida Neto",
    cpf: "15283769010",
    course: "Cibersegurança Defensiva",
    hours: 90,
  },
  {
    name: "Larissa Duarte Barbosa",
    cpf: "56473829100",
    course: "Inteligência Artificial",
    hours: 160,
  },
  { name: "Pedro Henrique Dias", cpf: "37482910506", course: "DevOps e Infraestrutura", hours: 70 },
];

function futureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

test.describe("Popular sistema com dados de exemplo", () => {
  test("cria templates e certificados via API", async ({ request }) => {
    // 1. Criar templates
    const templateIds: string[] = [];
    for (const t of TEMPLATES) {
      const res = await request.post(`${API}/templates`, { data: t });
      const body = await res.json();
      templateIds.push(body.data.id);
      console.log(`  ✔ Template criado: ${t.name} (${body.data.id})`);
    }

    // 2. Criar certificados (distribuídos entre os templates)
    for (let i = 0; i < PEOPLE.length; i++) {
      const p = PEOPLE[i];
      const templateId = templateIds[i % templateIds.length];
      const validityDate = futureDate(365 + i * 60);

      const res = await request.post(`${API}/certificates/emit`, {
        data: {
          recipientName: p.name,
          recipientCPF: p.cpf,
          courseName: p.course,
          courseHours: p.hours,
          validityDate,
          templateId,
        },
      });
      const body = await res.json();
      console.log(
        `  ✔ Certificado emitido: ${p.name} → ${p.course} (${body.data.verificationCode})`,
      );
    }

    console.log(
      `\n✅ Sistema populado com ${TEMPLATES.length} templates e ${PEOPLE.length} certificados.`,
    );
  });
});
