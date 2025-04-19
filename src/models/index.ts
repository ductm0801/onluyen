import {
  courseStatusEnum,
  difficultyEnum,
  examEnum,
  examResultEnum,
  pendingExamEnum,
  questionEnum,
  statusEnum,
  userRoleEnum,
} from "@/constants/enum";

export type ILoginRequest = {
  username: string;
  password: string;
};

export type IUSer = {
  student: {
    education: string;
    level: string;
    gpa: number;
    certificate: string;
  };
  user: {
    id: string;
    imageUrl: string;
    fullName: string;
    email: string;
    phoneNumber: number;
    address: string;
    gender: string;
    status: number;
  };
  instructor: {
    id: string;
    certificate: string;
    yearOfExperience: number;
    specialization: string;
    availableBalance: number;
    pendingBalance: number;
    totalBalance: number;
  };
  id: string;
  imageUrl: string;
  fullName: string;
  email: string;
  phoneNumber: number;
  address: string;
  gender: string;
  subjects: IUserSubject[] | IUserSubject;
  status: number;
};
export type IUserSubject = {
  id: string;
  subjectName: string;
  subjectDescription: string;
  imageUrl: string;
  averageScorePercentage: number;
};

export type User = IUSer & {
  UserId: string;
  FullName: string;
  Role: string;
  Gender: string;
  exp: number;
  imageUrl: string;
};

export type Subject = {
  id: string;
  subjectName: string;
  imageUrl: string;
  subjectDescription: string;
};

export type IAccount = {
  address: string;
  userId: string;
  dateOfBirth: string;
  email: string;
  fullName: string;
  gender: string;
  imageUrl?: string;
  phoneNumber: string;
  role: keyof typeof userRoleEnum;
  isDelete: boolean;
  status: number;
};
export type IRegist = {
  email: string;
  fullName: string;
  password: string;
  phoneNumber: string;
  gender: string;
  username: string;
  role: string;
};
export type IQuestion = {
  id: string;
  title: string;
  imageUrl: string;
  difficulty: keyof typeof difficultyEnum;
  type: keyof typeof questionEnum;
  testId: string;
  testName: string;
  isDeleted: boolean;
  answerText?: string;
  answers: IAnswers[];
  subjectName: string;
};

export type IQuestionBank = {
  id: string;
  questionBankName: string;
  subjectId: string;
  description: string;
  subjectName: string;
  isDeleted: boolean;
};
export type IAnswers = {
  content: string;
  id: string;
  imageUrl?: string;
  isCorrect: boolean;
  questionId: string;
  isSelected: boolean;
};
export type IExamBank = {
  id: string;
  testBankName: string;
  description: string;
  subjectId: string;
  subjectName: string;
  isDeleted: boolean;
  numberOfTests: number;
};
export type IExam = {
  id: string;
  testName: string;
  description: string;
  testDate: Date;
  length: number;
  testBankId: string;
  testBankName: string;
  testType: keyof typeof examEnum;
  testApprovalStatus: keyof typeof pendingExamEnum;
  totalGrade: number;
  isDeleted: boolean;
  subjectName: string;
  questions: IQuestion[];
  studentGrade: number;
  studentCorrectAnswers: number;
  totalItemsCount: number;
  totalPageCount: number;
};

export type IExamPayment = {
  examEnrollmentId: string;
  amount: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  cancelUrl: string;
  returnUrl: string;
};
export type IPayment = {
  paymentType: string;
  id: string;
  description: string;
  orderCode: string;
  method: string;
  transactionAmount: number;
  status: keyof typeof statusEnum;
  creationDate: Date;
};
export type ICourse = {
  courseId: string;
  title: string;
  description: string;
  subjectId: string;
  subjectName: string;
  imageUrl: string;
  duration: string;
  isJoined: boolean;
  courseType: number;
  isStarted: boolean;
  coursePrice: number;
  courseStatus: keyof typeof courseStatusEnum;
  instructorId: string;
  instructorName: string;
  lessons: ILessons;
  studentCourseId: string;
  trialAllowance: boolean;
  totalVideosLength: number;
  participationType: number;
  trialCourse: {
    id: string;
    participationType: number;
  };
  paidCourse: {
    id: string;
    participationType: number;
  };
  totalParticipants: number;
};
export type ILessons = {
  totalItemsCount: number;
  pageSize: number;
  totalPageCount: number;
  pageIndex: number;
  next: boolean;
  previous: boolean;
  items: ILesson[];
};
export type ILesson = {
  lessonId: string;
  order: number;
  title: string;
  description: string;
  videoUrl: string;
  content: string;
  imageUrl: string;
  courseId: string;
  courseName: string;
  progress: IProgress;
  totalVideoLength: number;
};
export type IProgress = {
  id: string;
  lessonId: string;
  isCompleted: boolean;
  completeDate: Date;
};

export type ITest = {
  id: string;
  examName: string;
  description: string;
  freeAttempts: number;
  price: number;
  subjectId: string;
  subjectName: string;
  testBankId: string;
  testBankName: string;
  testSkills: number;
  examDate: Date;
  isDeleted: boolean;
  isEnrolled: boolean;
  enrollmentId: string;
  hasOngoingAttempt: boolean;
};
export type IInstructor = {
  userId: string;
  subjectId: string;
  certificate: string;
  yearOfExperience: number;
  resumeUrl: string;
  user: string;
  subject: string;
  courses: string;
  questionBanks: string;
  id: string;
  creationDate: Date;
  createdBy: string;
  modificationDate: string;
  modificationBy: string;
  deletionDate: string;
  deleteBy: string;
  isDeleted: boolean;
};
export type IEXamResult = {
  id: string;
  examName: string;
  description: string;
  freeAttempts: number;
  price: number;
  subjectId: string;
  subjectName: string;
  testBankId: string;
  testBankName: string;
  isDeleted: boolean;
  hasOngoingAttempt: boolean;
  latestGrade: number;
  latestExamResult: keyof typeof examResultEnum;
  nearestAttemptDate: Date;
  latestTestTotalGrade: number;
};
export type IInstructorDetail = {
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: number;
    address: string;
    gender: string;
  };
  instructor: {
    id: string;
    certificate: string;
    yearOfExperience: number;
    specialization: string;
    pendingBalance: number;
    availableBalance: number;
  };
  courses: ICourse[];
  subject: {
    description: string;
    subjectName: string;
  };
};
export type ICourseProgress = {
  courseId: string;
  title: string;
  description: string;
  isStarted: boolean;
  progress: number;
  studentCourseId: string;
};
export type IConsultRequest = {
  id: string;
  studentInfo: {
    user: {
      id: string;
      imageUrl: string;
      fullName: string;
      email: string;
      phoneNumber: number;
      address: string;
      gender: string;
      dateOfBirth: Date;
      status: number;
    };
    student: {
      education: string;
      level: string;
      gpa: number;
      certificate: string;
    };
    subjects: [
      {
        id: string;
        subjectName: string;
        subjectDescription: string;
        imageUrl: string;
        averageScorePercentage: number;
      }
    ];
  };
  message: string;
  testAttemptInfo: {
    testAttemptId: string;
    examName: string;
    subjectName: string;
    attemptDate: Date;
    publishedDate: Date;
    testTotalGrade: number;
    testLength: number;
    grade: number;
    subjectScores: [
      {
        subjectName: string;
        studentCorrectAnswers: number;
        totalQuestions: number;
      }
    ];
    isPass: false;
  };

  status: number;
  isDeleted: boolean;
  creationDate: Date;
};
