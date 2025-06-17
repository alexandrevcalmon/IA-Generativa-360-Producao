
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useCreateLesson, useUpdateLesson, Lesson } from "@/hooks/useLessons";
import { LessonBasicFields } from "./LessonBasicFields";
import { LessonFileFields } from "./LessonFileFields";
import { LessonSettingsFields } from "./LessonSettingsFields";
import { LessonFormData } from "./types";

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

interface LessonFormProps {
  moduleId: string;
  lesson?: Lesson | null;
  onClose: () => void;
}

export const LessonForm = ({ moduleId, lesson, onClose }: LessonFormProps) => {
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
      image_url: lesson?.image_url || "",
      video_file_url: lesson?.video_file_url || "",
      material_url: lesson?.material_url || "",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <LessonBasicFields control={form.control} />
        <LessonFileFields control={form.control} />
        <LessonSettingsFields control={form.control} />

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
  );
};
