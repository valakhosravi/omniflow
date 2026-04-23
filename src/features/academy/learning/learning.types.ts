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

export interface CourseByCategoryDto {
  CategoryName: string | null;
  TeacherName: string | null;
  Seasons: SeasonDto[] | null;
  CourseId: number;
  CategoryId: number;
  TeacherId: number;
  Title: string | null;
  Description: string | null;
  Image: string | null;
  IsActive: boolean;
  DurationHours: number;
  CreatedDate: string;
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

export interface CourseInfoMediaFileDto {
  OriginalFileName: string | null;
  ObjectKey: string | null;
  MimeType: string | null;
  FileSize: number;
  DurationInSeconds: number | null;
  Status: number;
  CreatedDate: string;
  MediaFileId: string;
}

export interface CourseInfoSectionMediaDto {
  SectionMediaId: number;
  SectionId: number;
  MediaFileId: string;
  MediaType: number;
  OrderNumber: number;
  MediaFile: CourseInfoMediaFileDto | null;
}

export interface CourseInfoSectionDto {
  SectionId: number;
  Title: string | null;
  SeasonId: number;
  CreatedDate: string;
  SectionMedia: CourseInfoSectionMediaDto[];
}

export interface CourseInfoSeasonDto {
  SeasonId: number;
  Title: string | null;
  CourseId: number;
  IsActive: boolean;
  OrderNumber: number;
  Sections: CourseInfoSectionDto[];
}

export interface CourseInfoDto {
  CategoryName: string | null;
  TeacherName: string | null;
  Seasons: CourseInfoSeasonDto[];
  CourseId: number;
  CategoryId: number;
  TeacherId: number;
  Title: string | null;
  Description: string | null;
  Image: string | null;
  IsActive: boolean;
  DurationHours: number;
  CreatedDate: string;
}

export interface CourseAssignableUserDto {
  UserId: number;
  PersonnelId: number;
  FullName: string;
  Department: string | null;
  Title: string | null;
  IsAssigned: boolean;
}

export interface GetCourseAssignableUsersRequest {
  courseId: number;
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  department?: string;
}

export interface AssignUsersToCourseRequest {
  CourseId: number;
  UserIds: number[];
}

export interface TeacherDto {
  TeacherId: number;
  FullName: string | null;
  Mobile: string | null;
  Avatar: string | null;
  CreatedDate: string;
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

export interface SectionFormValues {
  Title: string;
  OrderNumber: number;
}

export interface SeasonFormValues {
  Title: string;
  OrderNumber: number;
}

export interface CourseFormValues {
  Title: string;
  Description: string;
  CategoryId: number;
  TeacherId: number;
  DurationHours?: number;
  IsActive: boolean;
}
