
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCreateModule, useUpdateModule, CourseModule } from "@/hooks/useCourseModules";

const moduleSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  order_index: z.number().min(0),
  is_published: z.boolean().default(false),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

interface CreateModuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  module?: CourseModule | null;
}

export const CreateModuleDialog = ({ isOpen, onClose, courseId, module }: CreateModuleDialogProps) => {
  const createModuleMutation = useCreateModule();
  const updateModuleMutation = useUpdateModule();

  const form = useForm<ModuleFormData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: module?.title || "",
      description: module?.description || "",
      order_index: module?.order_index || 0,
      is_published: module?.is_published || false,
    },
  });

  const onSubmit = async (data: ModuleFormData) => {
    try {
      const moduleData = {
        course_id: courseId,
        title: data.title,
        description: data.description || null,
        order_index: data.order_index,
        is_published: data.is_published,
      };

      if (module) {
        await updateModuleMutation.mutateAsync({ id: module.id, ...moduleData });
      } else {
        await createModuleMutation.mutateAsync(moduleData);
      }
      
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar módulo:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {module ? "Editar Módulo" : "Criar Novo Módulo"}
          </DialogTitle>
          <DialogDescription>
            {module 
              ? "Edite as informações do módulo abaixo." 
              : "Preencha as informações para criar um novo módulo."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do módulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o conteúdo do módulo"
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order_index"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Publicar Módulo</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Torne o módulo visível para os alunos
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createModuleMutation.isPending || updateModuleMutation.isPending}
              >
                {module ? "Atualizar" : "Criar"} Módulo
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
