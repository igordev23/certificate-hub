import { AlertCircle, X } from "lucide-react";

export interface ValidationError {
  field: string;
  message: string;
}

interface ErrorAlertProps {
  title?: string;
  errors: ValidationError[];
  onDismiss?: () => void;
}

export function ErrorAlert({
  title = "Erro ao emitir certificado",
  errors,
  onDismiss,
}: ErrorAlertProps) {
  if (errors.length === 0) return null;

  const errorsByField = errors.reduce(
    (acc, err) => {
      if (!acc[err.field]) acc[err.field] = [];
      acc[err.field].push(err.message);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3 items-start flex-1">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-destructive mb-2">{title}</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(errorsByField).map(([field, messages]) => (
                <div key={field}>
                  <p className="font-medium text-destructive/90 capitalize">
                    {formatFieldName(field)}
                  </p>
                  <ul className="list-disc list-inside text-destructive/80 space-y-1 ml-1">
                    {messages.map((msg, idx) => (
                      <li key={idx} className="text-xs">
                        {msg}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-destructive/60 hover:text-destructive transition-colors flex-shrink-0"
            aria-label="Fechar alerta"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function formatFieldName(field: string): string {
  const names: Record<string, string> = {
    recipientCPF: "CPF do participante",
    recipientName: "Nome do participante",
    email: "E-mail",
    courseName: "Nome do curso",
    courseHours: "Carga horária",
    templateId: "Template",
    validityDate: "Data de validade",
  };
  return names[field] || field;
}
