
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUploadField } from "@/components/FileUploadField";
import { Control } from "react-hook-form";
import { LessonFormData } from "./types";

interface LessonFileFieldsProps {
  control: Control<LessonFormData>;
}

export const LessonFileFields = ({ control }: LessonFileFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Arquivos da Aula</h3>
      
      <FormField
        control={control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FileUploadField
                label="Thumbnail da Aula"
                description="Recomendado: 1920x1080px (formato 16:9)"
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
        control={control}
        name="video_file_url"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FileUploadField
                label="Arquivo de Vídeo"
                description="Formato recomendado: MP4, máximo 2GB"
                value={field.value || ""}
                onChange={(url) => field.onChange(url || "")}
                uploadOptions={{
                  bucket: 'lesson-videos',
                  maxSize: 2 * 1024 * 1024 * 1024, // 2GB
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

      <FormField
        control={control}
        name="video_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL do Vídeo (Opcional)</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
                {...field} 
              />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground">
              Use este campo para vídeos do YouTube, Vimeo ou outras plataformas
            </p>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="material_url"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FileUploadField
                label="Material de Apoio"
                description="Formatos aceitos: PDF, Excel, Word, CSV (máximo 10MB)"
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
    </div>
  );
};
