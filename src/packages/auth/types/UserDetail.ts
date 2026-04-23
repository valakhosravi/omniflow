export interface UserDetail {
  UserDetail: {
    FullName: string;
    GroupKeys: string[];
    IsActive: true;
    Mobile: string;
    PersonnelId: string;
    UserId: number;
    Address: string;
    BookId: string;
    FatherName: string;
    FirstName: string;
    LastName: string;
    NationalCode: string;
    EmploymentDate?: string;
    BirthDate: string;
    PositionType: number;
    Title?: string;
  };
  RoleIds: number[];
  ServiceIds: number[];
  Parent: parent;
}

interface parent {
  Address: string;
  BookId: string;
  BirthDate: string;
  EmploymentDate: string;
  FatherName: string;
  FirstName: string;
  FullName: string;
  GroupKeys: string[];
  IsActive: boolean;
  LastName: string;
  Mobile: string;
  NationalCode: string;
  PersonnelId: string;
  Title: string;
  UserId: number;
}
