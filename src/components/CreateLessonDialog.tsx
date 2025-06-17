
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
import { useCreateLesson, useUpdateLesson, Lesson } from "@/hooks/useLessons";
import { FileUploadField } from "@/components/FileUploadField";

const lessonSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().optional(),
  video_url: z.string().url().optional().or(z.literal("")),
  duration_minutes: z.number().min(0).optional(),
  order_index: z.number().min(0),
  is_free: z.boolean().default(false),
  image_url: z.string().optional(),
  video_file_url: z.string().optional(),
  material_url: z.string().optional(),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface CreateLessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  lesson?: Lesson | null;
}

export const CreateLessonDialog = ({ isOpen, onClose, moduleId, lesson }: CreateLessonDialogProps) => {
  const createLessonMutation = useCreateLesson();
  const updateLessonMutation = useUpdateLesson();

  const form = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: lesson?.title || "",
      content: lesson?.content || "",
      video_url: lesson?.video_url || "",
      duration_minutes: lesson?.duration_minutes || undefined,
      order_index: lesson?.order_index || 0,
      is_free: lesson?.is_free || false,
      image_url: (lesson as any)?.image_url || "",
      video_file_url: (lesson as any)?.video_file_url || "",
      material_url: (lesson as any)?.material_url || "",
    },
  });

  const onSubmit = async (data: LessonFormData) => {
    try {
      const lessonData = {
        module_id: moduleId,
        title: data.title,
        content: data.content || null,
        video_url: data.video_url || null,
        duration_minutes: data.duration_minutes || null,
        order_index: data.order_index,
        is_free: data.is_free,
        resources: null,
        image_url: data.image_url || null,
        video_file_url: data.video_file_url || null,
        material_url: data.material_url || null,
      };

      if (lesson) {
        await updateLessonMutation.mutateAsync({ id: lesson.id, ...lessonData });
      } else {
        await createLessonMutation.mutateAsync(lessonData);
      }
      
      form.reset();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar aula:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {lesson ? "Editar Aula" : "Criar Nova Aula"}
          </DialogTitle>
          <DialogDescription>
            {lesson 
              ? "Edite as informações da aula abaixo." 
              : "Preencha as informações para criar uma nova aula."
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
                    <Input placeholder="Nome da aula" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva o conteúdo da aula"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUploadField
                        label="Imagem da Aula (1920x1080px)"
                        value={field.value || ""}
                        onChange={(url) => field.onChange(url || "")}
                        uploadOptions={{
                          bucket: 'lesson-images',
                          maxSize: 5 * 1024 * 1024, // 5MB
                          allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
                        }}
                        accept="image/*"
                        preview={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="video_file_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUploadField
                        label="Arquivo de Vídeo (16:9)"
                        value={field.value || ""}
                        onChange={(url) => field.onChange(url || "")}
                        uploadOptions={{
                          bucket: 'lesson-videos',
                          maxSize: 100 * 1024 * 1024, // 100MB
                          allowedTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
                        }}
                        accept="video/*"
                        preview={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="video_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Vídeo (YouTube, Vimeo, etc.)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://youtube.com/watch?v=..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="material_url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUploadField
                      label="Material da Aula (.pdf, .xlsx, .docx, .csv)"
                      value={field.value || ""}
                      onChange={(url) => field.onChange(url || "")}
                      uploadOptions={{
                        bucket: 'lesson-materials',
                        maxSize: 10 * 1024 * 1024, // 10MB
                        allowedTypes: [
                          'application/pdf',
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                          'text/csv'
                        ],
                      }}
                      accept=".pdf,.xlsx,.docx,.csv"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (minutos)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ex: 30"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
            </div>

            <FormField
              control={form.control}
              name="is_free"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Aula Gratuita</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Permitir acesso gratuito a esta aula
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
                disabled={createLessonMutation.isPending || updateLessonMutation.isPending}
              >
                {lesson ? "Atualizar" : "Criar"} Aula
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
