import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/services/api";
import { friendlyError } from "@/lib/error-friendly";
import { createTemplateSchema, type CreateTemplateData } from "@/lib/schemas";
import type { Template } from "@/models/template";

type TemplateLayoutConfig = {
  backgroundColor: string;
  primaryColor: string;
  borderColor: string;
  titleFontSize: number;
  bodyFontSize: number;
  showLogo: boolean;
  showBorder: boolean;
};

const DEFAULT_LAYOUT: TemplateLayoutConfig = {
  backgroundColor: "#FFFFFF",
  primaryColor: "#1a365d",
  borderColor: "#c4a35a",
  titleFontSize: 36,
  bodyFontSize: 14,
  showLogo: true,
  showBorder: true,
};

export function useTemplatesViewModel() {
  const [items, setItems] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const addForm = useForm<CreateTemplateData>({
    resolver: zodResolver(createTemplateSchema),
    mode: "onBlur",
    defaultValues: { name: "", description: "" },
  });
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [layout, setLayout] = useState<TemplateLayoutConfig>(DEFAULT_LAYOUT);
  const [loadKey, setLoadKey] = useState(0);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await api.listTemplates());
    } catch (e) {
      setError((e as Error).message);
      toast.error(friendlyError(e), {
        duration: Infinity,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [loadKey]);

  async function add(data: CreateTemplateData) {
    setSaving(true);
    try {
      await api.createTemplate({
        name: data.name,
        description: data.description,
        layoutConfig: DEFAULT_LAYOUT,
      });
      toast.success("Template criado com sucesso!");
      addForm.reset();
      setOpen(false);
      setLoadKey((k) => k + 1);
    } catch (err) {
      toast.error(friendlyError(err), { duration: Infinity });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Remover este template?")) return;
    try {
      await api.deleteTemplate(id);
      toast.success("Template removido com sucesso!");
      setLoadKey((k) => k + 1);
    } catch (err) {
      toast.error(friendlyError(err), {
        duration: Infinity,
      });
    }
  }

  function startEditing(tpl: Template) {
    setEditingTemplate(tpl);
    setEditName(tpl.name);
    setEditDescription(tpl.description || "");
    setLayout({
      ...DEFAULT_LAYOUT,
      ...(tpl.layoutConfig as TemplateLayoutConfig),
    });
  }

  async function saveChanges() {
    if (!editingTemplate) return;
    setSaving(true);
    try {
      await api.updateTemplate(editingTemplate.id, {
        name: editName,
        description: editDescription,
        layoutConfig: layout,
      });
      toast.success("Template atualizado com sucesso!");
      setEditingTemplate(null);
      setLoadKey((k) => k + 1);
    } catch (err) {
      toast.error(friendlyError(err), {
        duration: Infinity,
      });
    } finally {
      setSaving(false);
    }
  }

  function cancelEditing() {
    setEditingTemplate(null);
  }

  return {
    items,
    loading,
    error,
    open,
    setOpen,
    saving,
    editingTemplate,
    editName,
    editDescription,
    layout,
    load,
    addForm,
    add: addForm.handleSubmit(add),
    remove,
    startEditing,
    saveChanges,
    cancelEditing,
    setEditName,
    setEditDescription,
    setLayout,
  };
}
