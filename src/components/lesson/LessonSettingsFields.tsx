
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

interface LessonSettingsFieldsProps {
  control: Control<LessonFormData>;
}

export const LessonSettingsFields = ({ control }: LessonSettingsFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
        control={control}
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
    </>
  );
};
