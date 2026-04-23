import { baseQueryWithReauth } from "@/store/core/baseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import { GeneralResponse } from "@/services/commonApi/commonApi.type";
import {
  CategoryDto,
  CourseDto,
  SeasonDto,
  SectionDto,
  TeacherDto,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateSeasonRequest,
  UpdateSeasonRequest,
  ChangeSeasonOrderRequest,
  CreateSectionRequest,
  UpdateSectionRequest,
  CreateSectionAndUploadFileRequest,
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from "./learning.types";

const IS_MOCK = process.env.NODE_ENV === "development";

function toFormData<T extends Record<string, unknown>>(data: T): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
      formData.append(key, value, value.name);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) formData.append(key, item, item.name);
        else formData.append(key, String(item));
      });
      return;
    }
    formData.append(key, String(value));
  });
  return formData;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const learningApi = createApi({
  reducerPath: "learningApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Category", "Course", "Season", "Section", "Teacher"],
  endpoints: (builder) => ({
    // ── Category ──────────────────────────────────────────────────────
    getAllCategories: builder.query<GeneralResponse<CategoryDto[]>, void>({
      queryFn: async (_arg, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockGetAllCategories() as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Category/GetAll",
          method: "GET",
        }) as any;
      },
      providesTags: ["Category"],
    }),

    searchCategories: builder.query<GeneralResponse<CategoryDto[]>, string>({
      queryFn: async (value, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockSearchCategories(value) as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Category/Search",
          method: "GET",
          params: { value },
        }) as any;
      },
      providesTags: ["Category"],
    }),

    // ── Course ────────────────────────────────────────────────────────
    getAllCourses: builder.query<GeneralResponse<CourseDto[]>, void>({
      queryFn: async (_arg, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockGetAllCourses() as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Course/GetAll",
          method: "GET",
        }) as any;
      },
      providesTags: ["Course"],
    }),

    getCourseById: builder.query<GeneralResponse<CourseDto>, number>({
      queryFn: async (id, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockGetCourseById(id) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Course/GetById/${id}`,
          method: "GET",
        }) as any;
      },
      providesTags: (_result, _error, id) => [{ type: "Course", id }],
    }),

    createCourse: builder.mutation<
      GeneralResponse<CourseDto>,
      CreateCourseRequest
    >({
      queryFn: async (data, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockCreateCourse(data) as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Course/Create",
          method: "POST",
          body: toFormData(data as unknown as Record<string, unknown>),
        }) as any;
      },
      invalidatesTags: ["Course"],
    }),

    updateCourse: builder.mutation<
      GeneralResponse<CourseDto>,
      { id: number; body: UpdateCourseRequest }
    >({
      queryFn: async ({ id, body }, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockUpdateCourse(id, body) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Course/Update/${id}`,
          method: "PUT",
          body: toFormData(body as unknown as Record<string, unknown>),
        }) as any;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Course", id },
        "Course",
      ],
    }),

    deleteCourse: builder.mutation<GeneralResponse<null>, number>({
      queryFn: async (id, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockDeleteCourse(id) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Course/Delete/${id}`,
          method: "DELETE",
        }) as any;
      },
      invalidatesTags: ["Course"],
    }),

    changeCourseStatus: builder.mutation<GeneralResponse<null>, number>({
      queryFn: async (id, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockChangeCourseStatus(id) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Course/ChangeStatus/${id}`,
          method: "PATCH",
        }) as any;
      },
      invalidatesTags: (_result, _error, id) => [
        { type: "Course", id },
        "Course",
      ],
    }),

    // ── Season ────────────────────────────────────────────────────────
    getSeasonById: builder.query<GeneralResponse<SeasonDto>, number>({
      queryFn: async (id, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockGetSeasonById(id) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Season/GetById/${id}`,
          method: "GET",
        }) as any;
      },
      providesTags: (_result, _error, id) => [{ type: "Season", id }],
    }),

    getSeasonsByCourseId: builder.query<
      GeneralResponse<SeasonDto[]>,
      number
    >({
      queryFn: async (courseId, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockGetSeasonsByCourseId(courseId) as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Season/GetAllByCourseId",
          method: "GET",
          params: { courseId },
        }) as any;
      },
      providesTags: ["Season"],
    }),

    createSeason: builder.mutation<
      GeneralResponse<SeasonDto>,
      CreateSeasonRequest
    >({
      queryFn: async (body, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockCreateSeason(body) as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Season/Create",
          method: "POST",
          body,
        }) as any;
      },
      invalidatesTags: ["Season"],
    }),

    updateSeason: builder.mutation<
      GeneralResponse<SeasonDto>,
      { id: number; body: UpdateSeasonRequest }
    >({
      queryFn: async ({ id, body }, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockUpdateSeason(id, body) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Season/Update/${id}`,
          method: "PUT",
          body,
        }) as any;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Season", id },
        "Season",
      ],
    }),

    deleteSeason: builder.mutation<GeneralResponse<null>, number>({
      queryFn: async (id, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockDeleteSeason(id) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Season/Delete/${id}`,
          method: "DELETE",
        }) as any;
      },
      invalidatesTags: ["Season"],
    }),

    changeSeasonOrder: builder.mutation<
      GeneralResponse<SeasonDto[]>,
      ChangeSeasonOrderRequest
    >({
      queryFn: async (body, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockChangeSeasonOrder(body) as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Season/ChangeOrder",
          method: "PUT",
          body,
        }) as any;
      },
      invalidatesTags: ["Season"],
    }),

    // ── Section ───────────────────────────────────────────────────────
    getSectionById: builder.query<GeneralResponse<SectionDto>, number>({
      queryFn: async (id, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockGetSectionById(id) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Section/GetById/${id}`,
          method: "GET",
        }) as any;
      },
      providesTags: (_result, _error, id) => [{ type: "Section", id }],
    }),

    getSectionsBySeasonId: builder.query<
      GeneralResponse<SectionDto[]>,
      number
    >({
      queryFn: async (seasonId, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockGetSectionsBySeasonId(seasonId) as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Section/GetBySeasonId",
          method: "GET",
          params: { seasonId },
        }) as any;
      },
      providesTags: ["Section"],
    }),

    createSection: builder.mutation<
      GeneralResponse<SectionDto>,
      CreateSectionRequest
    >({
      queryFn: async (body, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockCreateSection(body) as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Section/Create",
          method: "POST",
          body,
        }) as any;
      },
      invalidatesTags: ["Section"],
    }),

    updateSection: builder.mutation<
      GeneralResponse<SectionDto>,
      { id: number; body: UpdateSectionRequest }
    >({
      queryFn: async ({ id, body }, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockUpdateSection(id, body) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Section/Update/${id}`,
          method: "PUT",
          body,
        }) as any;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Section", id },
        "Section",
      ],
    }),

    deleteSection: builder.mutation<GeneralResponse<null>, number>({
      queryFn: async (id, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockDeleteSection(id) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Section/Delete/${id}`,
          method: "DELETE",
        }) as any;
      },
      invalidatesTags: ["Section"],
    }),

    createSectionAndUploadFile: builder.mutation<
      GeneralResponse<SectionDto>,
      CreateSectionAndUploadFileRequest
    >({
      queryFn: async (data, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockCreateSectionAndUploadFile(data) as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Section/CreateAndUploadFile",
          method: "POST",
          body: toFormData(data as unknown as Record<string, unknown>),
        }) as any;
      },
      invalidatesTags: ["Section"],
    }),

    // ── Teacher ───────────────────────────────────────────────────────
    getAllTeachers: builder.query<GeneralResponse<TeacherDto[]>, void>({
      queryFn: async (_arg, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockGetAllTeachers() as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Teacher/GetAll",
          method: "GET",
        }) as any;
      },
      providesTags: ["Teacher"],
    }),

    searchTeachers: builder.query<GeneralResponse<TeacherDto[]>, string>({
      queryFn: async (value, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockSearchTeachers(value) as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Teacher/Search",
          method: "GET",
          params: { value },
        }) as any;
      },
      providesTags: ["Teacher"],
    }),

    getTeacherById: builder.query<GeneralResponse<TeacherDto>, number>({
      queryFn: async (id, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockGetTeacherById(id) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Teacher/GetById/${id}`,
          method: "GET",
        }) as any;
      },
      providesTags: (_result, _error, id) => [{ type: "Teacher", id }],
    }),

    createTeacher: builder.mutation<
      GeneralResponse<TeacherDto>,
      CreateTeacherRequest
    >({
      queryFn: async (body, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockCreateTeacher(body) as any;
        }
        return baseQuery({
          url: "/Academy/Learning/v1/Teacher/Create",
          method: "POST",
          body: toFormData(body as unknown as Record<string, unknown>),
        }) as any;
      },
      invalidatesTags: ["Teacher"],
    }),

    updateTeacher: builder.mutation<
      GeneralResponse<TeacherDto>,
      { id: number; body: UpdateTeacherRequest }
    >({
      queryFn: async ({ id, body }, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockUpdateTeacher(id, body) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Teacher/Update/${id}`,
          method: "PUT",
          body: toFormData(body as unknown as Record<string, unknown>),
        }) as any;
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Teacher", id },
        "Teacher",
      ],
    }),

    deleteTeacher: builder.mutation<GeneralResponse<null>, number>({
      queryFn: async (id, _api, _opts, baseQuery) => {
        if (IS_MOCK) {
          const m = await import("./learning.mock");
          return m.mockDeleteTeacher(id) as any;
        }
        return baseQuery({
          url: `/Academy/Learning/v1/Teacher/Delete/${id}`,
          method: "DELETE",
        }) as any;
      },
      invalidatesTags: ["Teacher"],
    }),
  }),
});
/* eslint-enable @typescript-eslint/no-explicit-any */

export const {
  // Category
  useGetAllCategoriesQuery,
  useSearchCategoriesQuery,
  useLazySearchCategoriesQuery,
  // Course
  useGetAllCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useChangeCourseStatusMutation,
  // Season
  useGetSeasonByIdQuery,
  useGetSeasonsByCourseIdQuery,
  useCreateSeasonMutation,
  useUpdateSeasonMutation,
  useDeleteSeasonMutation,
  useChangeSeasonOrderMutation,
  // Section
  useGetSectionByIdQuery,
  useGetSectionsBySeasonIdQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
  useCreateSectionAndUploadFileMutation,
  // Teacher
  useGetAllTeachersQuery,
  useSearchTeachersQuery,
  useLazySearchTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = learningApi;
