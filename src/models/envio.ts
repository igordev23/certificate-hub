export interface EnvioEmail {
  id: number;
  certificateId: string;
  recipientEmail: string;
  recipientName: string;
  status: "enviado" | "falhou" | "pendente";
  data: string;
}
