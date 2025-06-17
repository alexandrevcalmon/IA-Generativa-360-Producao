
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";

interface LessonFormData {
  title: string;
  content?: string;
  video_url?: string;
  duration_minutes?: number;
  order_index: number;
  is_free: boolean;
  image_url?: string;
  video_file_url?: string;
  material_url?: string;
}

interface LessonBasicFieldsProps {
  control: Control<LessonFormData>;
}

export const LessonBasicFields = ({ control }: LessonBasicFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
    </>
  );
};
