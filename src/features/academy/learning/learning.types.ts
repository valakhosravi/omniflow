export interface CategoryDto {
  CategoryId: number;
  Title: string | null;
  Image: string | null;
  CreatedDate: string;
}

export interface CourseDto {
  CourseId: number;
  CategoryId: number;
  CategoryName: string | null;
  TeacherId: number;
  TeacherName: string | null;
  Title: string | null;
  Description: string | null;
  Image: string | null;
  IsActive: boolean;
  DurationMinutes: number;
  CreatedDate: string;
  Seasons: SeasonDto[] | null;
}

export interface SeasonDto {
  SeasonId: number;
  Title: string | null;
  CourseId: number;
  IsActive: boolean;
  OrderNumber: number;
  Sections: SectionDto[] | null;
}

export interface SectionDto {
  SectionId: number;
  Title: string | null;
  SeasonId: number;
  CreatedDate: string;
}

export interface TeacherDto {
  TeacherId: number;
  FullName: string | null;
  Mobile: string | null;
  Avatar: string | null;
  CreatedDate: string;
}

export interface CreateTeacherRequest {
  FullName: string;
  Mobile: string;
  AvatarFile?: File;
}

export interface UpdateTeacherRequest {
  FullName: string;
  Mobile: string;
  AvatarFile?: File;
}

export interface CreateCourseRequest {
  CategoryId: number;
  TeacherId: number;
  Title: string;
  Description: string;
  ImageFile?: File;
  IsActive?: boolean;
  DurationHours?: number;
}

export interface UpdateCourseRequest {
  CategoryId: number;
  TeacherId: number;
  Title: string;
  Description: string;
  ImageFile?: File;
  IsActive?: boolean;
  DurationHours?: number;
}

export interface CreateSeasonRequest {
  CourseId: number;
  Title: string;
  OrderNumber: number;
}

export interface UpdateSeasonRequest {
  CourseId: number;
  Title: string;
  OrderNumber: number;
}

export interface ChangeSeasonOrderRequest {
  SeasonId: number;
  NewOrder: number;
}

export interface CreateSectionRequest {
  SeasonId: number;
  Title: string;
  OrderNumber: number;
}

export interface UpdateSectionRequest {
  SeasonId: number;
  Title: string;
  OrderNumber: number;
  SectionId: number;
}

export interface CreateSectionAndUploadFileRequest {
  Files?: File[];
  SeasonId: number;
  Title: string;
  OrderNumber: number;
}
