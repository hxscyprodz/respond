export type DepartmentKey = 'police' | 'fire' | 'ambulance' | 'other';
export type DepartmentIcon = 'shield' | 'fire' | 'kit-medical' | 'alert-triangle';

export interface EmergencyDepartment {
  name: string;
  number: string;
  icon: DepartmentIcon;
  key: DepartmentKey;
}

export interface EmergencyCity {
  display: string;
  region: string;
  updatedAt: string;
  departments: EmergencyDepartment[];
}

export interface Profile {
  name?: string;
  city?: string;
}

export type LocationStatus = 'loading' | 'success' | 'services-disabled' | 'permission-denied' | 'timeout' | 'geocode-empty' | 'error';

export interface LocationDetectionResultLoading {
  status: 'loading';
}

export interface LocationDetectionResultSuccess {
  status: 'success';
  city: string;
  region?: string;
}

export interface LocationDetectionResultFailure {
  status: Exclude<LocationStatus, 'loading' | 'success'>;
  canAskAgain?: boolean;
}

export type LocationDetectionResult = LocationDetectionResultLoading | LocationDetectionResultSuccess | LocationDetectionResultFailure;

export interface AppContextValue {
  isOnline: boolean;
  profile: Profile | null;
  updateProfile: (next: Profile | null) => Promise<void>;
  loadingProfile: boolean;
}

export type HomeStackParamList = {
  HomeMain: undefined;
  Results: { city: EmergencyCity };
};

export type AppTabParamList = {
  Home: undefined;
  Profile: undefined;
};
