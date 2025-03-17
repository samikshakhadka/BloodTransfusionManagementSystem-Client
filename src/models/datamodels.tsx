export interface InitialState {
  auth: {
    userId: string | undefined;
    hospitalId: string | undefined;
    userType: {
      userTypeId: string | undefined;
      userTypeName: string | undefined;
    };
  };
}

export type InventoryData = {
  dateModified: any;
  dateCreated: string;
  inventoryId: string;
  inventoryName: string;
  bloodGroupId: string;
  hospitalId: string;
  quantity: number;
};

export type EditInventoryData = {
  inventoryId: string;
  inventoryName: string;
  quantity: number;
  bloodGroupId: string;
  hospitalId: string;
};
export type PatientData = {
  patientName: string;
  bloodGroup: {
    bloodGroupId: string;
    bloodGroupName: string;
  };
  district: string;
  province: string;
  municipality: string;
  wardNo: number;
  phoneNumber: number;
  hospitalId: string;
  remarks: string;
  bloodGroupId: string;
};
export type EditPatientwaitlist = {
  patientId: string;
  patientName: string;
  district: string;
  province: string;
  municipality: string;
  wardNo: number;
  phoneNumber: number;
  bloodGroupId: string;
  hospitalId: string;
  remarks: string;
};

export type DonorData = {
  donorName: string;
  address: string;
  userTypeId: string;
  hospitalId?: string | undefined;
  fatherName: string;
  bloodGroupId: string;
  lastDonated: Date | null;
  district: string;
  province: string;
  municipality: string;
  wardNo: number;
  phoneNumber: number;
  emergencyContact: number;
  dateOfBirth: Date;
};

export type AdminData = {
  donorId: string;
  donorName: string;
  email: string;
  address: string;
  userTypeId: string;
  hospitalId: string;
  userId: string;
  bloodGroupId: string;
  fatherName: string;
  lastDonated: string;
  province: string;
  district: string;
  municipality: string;
  wardNo: number;
  phoneNumber: number;
  emergencyContact: number;
  registrationId: number;
  password: string;
  isVerified: string;
  dateOfBirth: Date;
};

export type AdminDataTable = {
  donorName: string;
  email: string;
  address: string;
  userTypeId: string;
  hospitalId: string;
  userId: string;
  bloodGroupId: string;
  fatherName: string;
  lastDonated: string;
  province: string;
  district: string;
  municipality: string;
  wardNo: number;
  phoneNumber: number;
  emergencyContact: number;
  registrationId: number;
  password: string;
  isVerified: string;
  dateOfBirth: string;
  name: string;
  userTypeName: string;
  userType: UserType;
  hospitalName: string;
  actions?: React.ReactNode;
  hospital: {
    hospitalId: string;
    hospitalName: string;
  };
};

export type EditDonors = {
  donorId: string;
  userId: string;
  bloodGroupId: string;
  hospitalId: string | undefined;
  dateOfBirth: string;
  address: string;
  donorName: string;
  fatherName: string;
  lastDonated: string | null;
  province: string;
  district: string;
  municipality: string;
  wardNo: number;
  phoneNumber: number;
  emergencyContact: number;
};

export type BloodGroup = {
  bloodGroupId: string;
  bloodGroupName: string;
};

export type Hospitals = {
  hospitalId: string;
  hospitalName: string;
};

export type UserType = {
  userTypeId: string;
  userTypeName: string;
};

export type UserTypes = {
  userTypeId: string;
  userTypeName: string;
  dateCreated: Date;
};

export type Hospital = {
  hospitalId: string;
  hospitalName: string;
  hospitalAddress: string;
  logoUrl: string;
  hospitalDescription: string;
  contactPerson: string;
  dateCreated: Date;
  dateModified: Date;
  municipality: string;
  district: string;
  wardNo: number;
  province: string;
  hospitalEmail: string;
  phoneNumber1: number;
  phoneNumber2: number;
  location: string;
};
export type AddAdminDataModel = {
  userId: string;
  hospitalId: string;
  userTypeId: string;
  name: string;
  hospitalName: string;
  address: string;
  email: string;
  password: string;
};

export type ResetPasswordData = {
  userId: string;
  password: string;
  confirmPassword: string;
  email: string;
};

export type EditAdminDataModel = {
  userId: string;
  userType: {
    userTypeId: string;
    userTypeName: string;
  };
  hospital: {
    hospitalId: string;
    hospitalName: string;
  };
  hospitalId: string;
  hospitalName: string;
  email: string;
  userTypeId: string;
  userTypeName: string;
};

export type User = {
  userId: string;
  name: string;
  address: string;
  email: string;
  password: string;
  hospital: Hospital;
  userTypeId: string;
  // userType: UserTypes;
};

export type Donors = {
  index: number;
  donorName: string;
  hospitalAffiliated: string;
  donorId: string;
  fatherName: string;
  lastDonated: string;
  district: string;
  province: string;
  dateOfBirth: string;
  municipality: string;
  wardNo: number;
  phoneNumber: number;
  emergencyContact: number;
  dateCreated: Date;
  hospital: Hospital;
  user: User;
  bloodGroup: BloodGroup;
};

export type DonorTable = {
  index: number;
  donorName: string;
  bloodGroup: string;
  lastDonated: string;
  phoneNumber: number;
  municipality: string;
  wardNo: number;
  dateOfBirth: string;
  emergencyContact: number;
  actions: JSX.Element;
};

export interface EditInventoryProps {
  editElement: InventoryData;
  handleCloseEdit: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export interface EditHospitalProps {
  editElement: PresentHospitalData;
  handleCloseEdit: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export interface EditHospitalProfileProps {
  editElement: Hospital;
  handleCloseEdit: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export interface AddHospitalProfileProps {
  handleOpenForm: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export interface EditAdminProps {
  editElement: EditAdminDataModel;
  handleCloseEdit: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export interface ResetPasswordProps {
  handleCloseEdit: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export interface CreateInventoryProps {
  handleOpenForm: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export interface ClickOutsideProps {
  handleClickOutside: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}
export type SendEditData = {
  inventoryName: string;
  quantity: number;
  inventoryId: string;
  bloodGroupId: string;
  hospitalId: string;
};

export type PresentInventoryData = {
  inventoryName: string;
  quantity: number;
  inventoryId: string;
  bloodGroupId: string;
  dateModified: string;
  dateCreated: string;
  hospitalId: string;
};

export type PresentHospitalData = {
  userId: string;
  name: string;
  hospitalId: string;
  address: string;
  email: string;
};

export interface CreateAdminProps {
  handleOpenForm: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;

  hospitalId: string;
}
export interface EditPatientProps {
  editElement: PresentPatientData;
  handleCloseEdit: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export interface CreatePatientProps {
  handleOpenForm: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

export type SendEditPatientData = {
  patientId: string;
  patientName: string;
  district: string;
  province: string;
  municipality: string;
  wardNo: number;
  phoneNumber: number;
  bloodGroupId: string;
  hospitalId: string;
  remarks: string;
};

export type PresentPatientData = {
  patientId: string;
  patientName: string;
  bloodGroupId: string;
  hospitalId: string;
  district: string;
  province: string;
  municipality: string;
  wardNo: number;
  phoneNumber: number;
  bloodGroup: BloodGroup;
  hospital: Hospital;
  remarks: string;
};

export type Priority = {
  dateCreated: Date;
  priorityId: string;
  priorityLevelName: string;
};
export type Inventory = {
  dateCreated: Date;
  inventoryId: string;
  inventoryName: string;
};

export type DeleteAlertProps = {
  deleteRecord: string;
  handleCancel: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data?: InitialState;
};

export type Filters = {
  Key: string;
  value: string;
};

export type UserProfileEdit = {
  donorName: string;
  fatherName: string;
  email: string;
  province: string;
  district: string;
  municipality: string;
  phoneNumber: string;
  wardNo: number;
  bloodGroupId: string;
  emergencyContact: string;
  donorId: string;
  userId: string;
  hospitalId: string;
};

export type WardRepresentatives = {
  wardRepId: string;
  wardRepName: string;
  wardNo: string;
  phoneNumber: string;
  secondaryContact: string;
  actions: JSX.Element;
};

export type AvailableDonorsProps = {
  patientName: string;
  bloodGroupId: string;
  district: string;
  province: string;
  municipality: string;
  wardNo: number;
  phoneNumber: number;
  hospitalId: string;
  remarks: string;
  bloodGroup: BloodGroup;
};

export type ShowAvailableData = {
  clickedRowData: PatientData | undefined;
};

export interface DonorTableRow {
  index: number;
  donorName: string;
  bloodGroup: string;
  age: number;
  lastDonated: string | null;
  phoneNumber: number;
  district: string;
  municipality: string;
  wardNo: number;
  emergencyContact: number;
  actions?: React.ReactNode;
}

export interface DonorDataTable {
  bloodGroup: {
    bloodGroupId: string;
    bloodGroupName: string;
  };
  dateOfBirth: string;
  district: string;
  donorId: string;
  donorName: string;
  emergencyContact: number;
  fatherName: string;
  hospital: {
    hospitalId?: string | undefined;
    hospitalName: string;
    hospitalAddress: string;
  };
  lastDonated: string;
  municipality: string;
  phoneNumber: number;
  province: string;
  wardNo: number;
}

export interface EditAdminData {
  donorName: string;
  email: string;
  address: string;
  userTypeId: string;
  hospitalId: string;
  userId: string;
  bloodGroupId: string;
  dateOfBirth: Date;
  fatherName: string;
  lastDonated: string;
  province: string;
  district: string;
  municipality: string;
  wardNo: number;
  phoneNumber: number;
  emergencyContact: number;
  registrationId: number;
  password: string;
  isVerified: string;
  donorId: string;
}

export type AdminTable = {
  userId: string;
  email: string;
  address: string;
  userTypeId: string;
  hospitalId: string;
  bloodGroupId: string;
  dateOfBirth: string;
  fatherName: string;
  lastDonated: string;
  province: string;
  district: string;
  municipality: string;
  wardNo: number;
  phoneNumber: number;
  emergencyContact: number;
  registrationId: number;
  password: string;
  isVerified: string;
  donorId: string;
  donor: DonorDataTable;
  userType: UserType;
  hospital: Hospital;
  donorName: string;
  name: string;
  hospitalName: string;
  userTypeName: string;
  actions?: React.ReactNode;
};
