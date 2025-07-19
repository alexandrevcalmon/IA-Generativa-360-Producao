// Stub file for useLessonMaterials hook
// TODO: Implement when lesson_materials table exists

export interface LessonMaterial {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size_bytes?: number;
  extracted_content?: string;
}

export const useLessonMaterials = (lessonId?: string) => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};