// Stub file for useCourseModules hook
// TODO: Implement when course_modules table exists

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  order_index: number;
  lessons: any[];
  is_published?: boolean;
  image_url?: string;
  course_id?: string;
}

export const useCourseModules = () => {
  return {
    data: [],
    isLoading: false,
    error: null
  };
};

export const useCreateModule = () => {
  return {
    mutate: (data?: any) => {},
    mutateAsync: async (data?: any) => {},
    isLoading: false,
    isPending: false
  };
};

export const useUpdateModule = () => {
  return {
    mutate: (data?: any) => {},
    mutateAsync: async (data?: any) => {},
    isLoading: false,
    isPending: false
  };
};

export const useDeleteModule = () => {
  return {
    mutate: (data?: any) => {},
    mutateAsync: async (data?: any) => {},
    isLoading: false,
    isPending: false
  };
};

export const useModulesByPage = () => {
  return {
    data: { data: [], count: 0 },
    isLoading: false,
    error: null
  };
};