import { faker } from "@faker-js/faker";
import type {
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
import type { GeneralResponse } from "@/services/commonApi/commonApi.type";

// ─── Response helpers ─────────────────────────────────────────────────────────

type MockOk<T> = { data: GeneralResponse<T> };
type MockErr = {
  error: { status: number; data: GeneralResponse<undefined> };
};

function ok<T>(data: T): MockOk<T> {
  return {
    data: {
      ResponseCode: 100,
      ResponseMessage: "عملیات با موفقیت انجام شد",
      Description: "",
      Data: data,
    },
  };
}

function notFound(msg = "آیتم مورد نظر یافت نشد"): MockErr {
  return {
    error: {
      status: 404,
      data: {
        ResponseCode: 104,
        ResponseMessage: msg,
        Description: "",
        Data: undefined,
      },
    },
  };
}

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

// ─── ID counters ──────────────────────────────────────────────────────────────

let _categoryId = 100;
let _teacherId = 100;
let _courseId = 100;
let _seasonId = 100;
let _sectionId = 100;

// ─── Generators ───────────────────────────────────────────────────────────────

function generateSection(seasonId: number, _order: number): SectionDto {
  return {
    SectionId: _sectionId++,
    Title: faker.lorem.sentence({ min: 2, max: 5 }),
    SeasonId: seasonId,
    OrderNumber: _order,
    CreatedDate: faker.date.past({ years: 1 }).toISOString(),
  };
}

function generateSeason(courseId: number, order: number): SeasonDto {
  const seasonId = _seasonId++;
  const sectionCount = faker.number.int({ min: 2, max: 4 });
  return {
    SeasonId: seasonId,
    Title: faker.lorem.sentence({ min: 2, max: 4 }),
    CourseId: courseId,
    IsActive: true,
    OrderNumber: order,
    Sections: Array.from({ length: sectionCount }, (_, i) =>
      generateSection(seasonId, i + 1),
    ),
  };
}

function generateCourse(
  categories: CategoryDto[],
  teachers: TeacherDto[],
): CourseDto {
  const category = faker.helpers.arrayElement(categories);
  const teacher = faker.helpers.arrayElement(teachers);
  const courseId = _courseId++;
  const seasonCount = faker.number.int({ min: 2, max: 4 });
  return {
    CourseId: courseId,
    CategoryId: category.CategoryId,
    CategoryName: category.Title,
    TeacherId: teacher.TeacherId,
    TeacherName: teacher.FullName,
    Title: faker.lorem.sentence({ min: 3, max: 6 }),
    Description: faker.lorem.paragraph(),
    Image: faker.image.url(),
    IsActive: faker.datatype.boolean(),
    DurationMinutes: faker.number.int({ min: 30, max: 600 }),
    CreatedDate: faker.date.past({ years: 1 }).toISOString(),
    Seasons: Array.from({ length: seasonCount }, (_, i) =>
      generateSeason(courseId, i + 1),
    ),
  };
}

// ─── In-memory store (singleton) ──────────────────────────────────────────────

class MockStore {
  categories: CategoryDto[];
  teachers: TeacherDto[];
  courses: CourseDto[];

  constructor() {
    this.categories = Array.from({ length: 6 }, () => ({
      CategoryId: _categoryId++,
      Title: faker.commerce.department(),
      Image: faker.image.url(),
      CreatedDate: faker.date.past({ years: 2 }).toISOString(),
    }));

    this.teachers = Array.from({ length: 5 }, () => ({
      TeacherId: _teacherId++,
      FullName: faker.person.fullName(),
      Mobile: faker.phone.number(),
      Avatar: faker.image.avatar(),
      CreatedDate: faker.date.past({ years: 2 }).toISOString(),
    }));

    this.courses = Array.from({ length: 8 }, () =>
      generateCourse(this.categories, this.teachers),
    );
  }

  findSeason(seasonId: number): SeasonDto | undefined {
    for (const course of this.courses) {
      const season = course.Seasons?.find((s) => s.SeasonId === seasonId);
      if (season) return season;
    }
    return undefined;
  }

  findSection(sectionId: number): SectionDto | undefined {
    for (const course of this.courses) {
      for (const season of course.Seasons ?? []) {
        const section = season.Sections?.find(
          (s) => s.SectionId === sectionId,
        );
        if (section) return section;
      }
    }
    return undefined;
  }
}

let _store: MockStore | null = null;
function getStore(): MockStore {
  if (!_store) _store = new MockStore();
  return _store;
}

// ─── Mock handlers ────────────────────────────────────────────────────────────

// Category

export async function mockGetAllCategories(): Promise<
  MockOk<CategoryDto[]> | MockErr
> {
  await delay();
  return ok(getStore().categories);
}

export async function mockSearchCategories(
  value: string,
): Promise<MockOk<CategoryDto[]> | MockErr> {
  await delay();
  const filtered = getStore().categories.filter((c) =>
    c.Title?.toLowerCase().includes(value.toLowerCase()),
  );
  return ok(filtered);
}

// Course

export async function mockGetAllCourses(): Promise<
  MockOk<CourseDto[]> | MockErr
> {
  await delay();
  return ok(getStore().courses);
}

export async function mockGetCourseById(
  id: number,
): Promise<MockOk<CourseDto> | MockErr> {
  await delay();
  const course = getStore().courses.find((c) => c.CourseId === id);
  if (!course) return notFound("دوره مورد نظر یافت نشد");
  return ok(course);
}

export async function mockCreateCourse(
  data: CreateCourseRequest,
): Promise<MockOk<CourseDto> | MockErr> {
  await delay();
  const store = getStore();
  const category = store.categories.find(
    (c) => c.CategoryId === data.CategoryId,
  );
  const teacher = store.teachers.find((t) => t.TeacherId === data.TeacherId);
  const newCourse: CourseDto = {
    CourseId: _courseId++,
    CategoryId: data.CategoryId,
    CategoryName: category?.Title ?? null,
    TeacherId: data.TeacherId,
    TeacherName: teacher?.FullName ?? null,
    Title: data.Title,
    Description: data.Description,
    Image: faker.image.url(),
    IsActive: data.IsActive ?? true,
    DurationMinutes: (data.DurationHours ?? 1) * 60,
    CreatedDate: new Date().toISOString(),
    Seasons: [],
  };
  store.courses.push(newCourse);
  return ok(newCourse);
}

export async function mockUpdateCourse(
  id: number,
  body: UpdateCourseRequest,
): Promise<MockOk<CourseDto> | MockErr> {
  await delay();
  const store = getStore();
  const idx = store.courses.findIndex((c) => c.CourseId === id);
  if (idx === -1) return notFound("دوره مورد نظر یافت نشد");
  const category = store.categories.find(
    (c) => c.CategoryId === body.CategoryId,
  );
  const teacher = store.teachers.find((t) => t.TeacherId === body.TeacherId);
  store.courses[idx] = {
    ...store.courses[idx],
    CategoryId: body.CategoryId,
    CategoryName: category?.Title ?? null,
    TeacherId: body.TeacherId,
    TeacherName: teacher?.FullName ?? null,
    Title: body.Title,
    Description: body.Description,
    IsActive: body.IsActive ?? store.courses[idx].IsActive,
    DurationMinutes: body.DurationHours
      ? body.DurationHours * 60
      : store.courses[idx].DurationMinutes,
  };
  return ok(store.courses[idx]);
}

export async function mockDeleteCourse(
  id: number,
): Promise<MockOk<null> | MockErr> {
  await delay();
  const store = getStore();
  const idx = store.courses.findIndex((c) => c.CourseId === id);
  if (idx === -1) return notFound("دوره مورد نظر یافت نشد");
  store.courses.splice(idx, 1);
  return ok(null);
}

export async function mockChangeCourseStatus(
  id: number,
): Promise<MockOk<null> | MockErr> {
  await delay();
  const store = getStore();
  const course = store.courses.find((c) => c.CourseId === id);
  if (!course) return notFound("دوره مورد نظر یافت نشد");
  course.IsActive = !course.IsActive;
  return ok(null);
}

// Season

export async function mockGetSeasonById(
  id: number,
): Promise<MockOk<SeasonDto> | MockErr> {
  await delay();
  const season = getStore().findSeason(id);
  if (!season) return notFound("فصل مورد نظر یافت نشد");
  return ok(season);
}

export async function mockGetSeasonsByCourseId(
  courseId: number,
): Promise<MockOk<SeasonDto[]> | MockErr> {
  await delay();
  const course = getStore().courses.find((c) => c.CourseId === courseId);
  return ok(course?.Seasons ?? []);
}

export async function mockCreateSeason(
  body: CreateSeasonRequest,
): Promise<MockOk<SeasonDto> | MockErr> {
  await delay();
  const store = getStore();
  const course = store.courses.find((c) => c.CourseId === body.CourseId);
  if (!course) return notFound("دوره مورد نظر یافت نشد");
  const newSeason: SeasonDto = {
    SeasonId: _seasonId++,
    Title: body.Title,
    CourseId: body.CourseId,
    IsActive: true,
    OrderNumber: body.OrderNumber,
    Sections: [],
  };
  if (!course.Seasons) course.Seasons = [];
  course.Seasons.push(newSeason);
  return ok(newSeason);
}

export async function mockUpdateSeason(
  id: number,
  body: UpdateSeasonRequest,
): Promise<MockOk<SeasonDto> | MockErr> {
  await delay();
  const store = getStore();
  const course = store.courses.find((c) => c.CourseId === body.CourseId);
  if (!course) return notFound("دوره مورد نظر یافت نشد");
  const season = course.Seasons?.find((s) => s.SeasonId === id);
  if (!season) return notFound("فصل مورد نظر یافت نشد");
  season.Title = body.Title;
  season.OrderNumber = body.OrderNumber;
  return ok(season);
}

export async function mockDeleteSeason(
  id: number,
): Promise<MockOk<null> | MockErr> {
  await delay();
  const store = getStore();
  for (const course of store.courses) {
    const idx = course.Seasons?.findIndex((s) => s.SeasonId === id) ?? -1;
    if (idx !== -1) {
      course.Seasons!.splice(idx, 1);
      return ok(null);
    }
  }
  return notFound("فصل مورد نظر یافت نشد");
}

export async function mockChangeSeasonOrder(
  body: ChangeSeasonOrderRequest,
): Promise<MockOk<SeasonDto[]> | MockErr> {
  await delay();
  const store = getStore();
  for (const course of store.courses) {
    const season = course.Seasons?.find((s) => s.SeasonId === body.SeasonId);
    if (season) {
      season.OrderNumber = body.NewOrder;
      const sorted = [...(course.Seasons ?? [])].sort(
        (a, b) => a.OrderNumber - b.OrderNumber,
      );
      course.Seasons = sorted;
      return ok(sorted);
    }
  }
  return notFound("فصل مورد نظر یافت نشد");
}

// Section

export async function mockGetSectionById(
  id: number,
): Promise<MockOk<SectionDto> | MockErr> {
  await delay();
  const section = getStore().findSection(id);
  if (!section) return notFound("بخش مورد نظر یافت نشد");
  return ok(section);
}

export async function mockGetSectionsBySeasonId(
  seasonId: number,
): Promise<MockOk<SectionDto[]> | MockErr> {
  await delay();
  const season = getStore().findSeason(seasonId);
  return ok(season?.Sections ?? []);
}

export async function mockCreateSection(
  body: CreateSectionRequest,
): Promise<MockOk<SectionDto> | MockErr> {
  await delay();
  const season = getStore().findSeason(body.SeasonId);
  if (!season) return notFound("فصل مورد نظر یافت نشد");
  const newSection: SectionDto = {
    SectionId: _sectionId++,
    Title: body.Title,
    SeasonId: body.SeasonId,
    OrderNumber: body.OrderNumber,
    CreatedDate: new Date().toISOString(),
  };
  if (!season.Sections) season.Sections = [];
  season.Sections.push(newSection);
  return ok(newSection);
}

export async function mockUpdateSection(
  id: number,
  body: UpdateSectionRequest,
): Promise<MockOk<SectionDto> | MockErr> {
  await delay();
  const section = getStore().findSection(id);
  if (!section) return notFound("بخش مورد نظر یافت نشد");
  section.Title = body.Title;
  section.SeasonId = body.SeasonId;
  section.OrderNumber = body.OrderNumber;
  return ok(section);
}

export async function mockDeleteSection(
  id: number,
): Promise<MockOk<null> | MockErr> {
  await delay();
  const store = getStore();
  for (const course of store.courses) {
    for (const season of course.Seasons ?? []) {
      const idx = season.Sections?.findIndex((s) => s.SectionId === id) ?? -1;
      if (idx !== -1) {
        season.Sections!.splice(idx, 1);
        return ok(null);
      }
    }
  }
  return notFound("بخش مورد نظر یافت نشد");
}

export async function mockCreateSectionAndUploadFile(
  data: CreateSectionAndUploadFileRequest,
): Promise<MockOk<SectionDto> | MockErr> {
  await delay();
  const season = getStore().findSeason(data.SeasonId);
  if (!season) return notFound("فصل مورد نظر یافت نشد");
  const newSection: SectionDto = {
    SectionId: _sectionId++,
    Title: data.Title,
    SeasonId: data.SeasonId,
    OrderNumber: data.OrderNumber,
    CreatedDate: new Date().toISOString(),
  };
  if (!season.Sections) season.Sections = [];
  season.Sections.push(newSection);
  return ok(newSection);
}

// Teacher

export async function mockGetAllTeachers(): Promise<
  MockOk<TeacherDto[]> | MockErr
> {
  await delay();
  return ok(getStore().teachers);
}

export async function mockSearchTeachers(
  value: string,
): Promise<MockOk<TeacherDto[]> | MockErr> {
  await delay();
  const filtered = getStore().teachers.filter((t) =>
    t.FullName?.toLowerCase().includes(value.toLowerCase()),
  );
  return ok(filtered);
}

export async function mockGetTeacherById(
  id: number,
): Promise<MockOk<TeacherDto> | MockErr> {
  await delay();
  const teacher = getStore().teachers.find((t) => t.TeacherId === id);
  if (!teacher) return notFound("مدرس مورد نظر یافت نشد");
  return ok(teacher);
}

export async function mockCreateTeacher(
  data: CreateTeacherRequest,
): Promise<MockOk<TeacherDto> | MockErr> {
  await delay();
  const newTeacher: TeacherDto = {
    TeacherId: _teacherId++,
    FullName: data.FullName,
    Mobile: data.Mobile,
    Avatar: faker.image.avatar(),
    CreatedDate: new Date().toISOString(),
  };
  getStore().teachers.push(newTeacher);
  return ok(newTeacher);
}

export async function mockUpdateTeacher(
  id: number,
  body: UpdateTeacherRequest,
): Promise<MockOk<TeacherDto> | MockErr> {
  await delay();
  const store = getStore();
  const idx = store.teachers.findIndex((t) => t.TeacherId === id);
  if (idx === -1) return notFound("مدرس مورد نظر یافت نشد");
  store.teachers[idx] = {
    ...store.teachers[idx],
    FullName: body.FullName,
    Mobile: body.Mobile,
  };
  return ok(store.teachers[idx]);
}

export async function mockDeleteTeacher(
  id: number,
): Promise<MockOk<null> | MockErr> {
  await delay();
  const store = getStore();
  const idx = store.teachers.findIndex((t) => t.TeacherId === id);
  if (idx === -1) return notFound("مدرس مورد نظر یافت نشد");
  store.teachers.splice(idx, 1);
  return ok(null);
}
