import AsyncStorage from "@react-native-async-storage/async-storage"

// Base URL for your API
const API_BASE_URL = "https://autosched-chi.vercel.app/api"
// const API_BASE_URL = "http://localhost:3000/api"

// Helper function to get auth token
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("authToken")
  } catch (error) {
    console.error("Error getting auth token:", error)
    return null
  }
}

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  data?: any,
  requiresAuth: boolean = true
)
: Promise<T> =>
{
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (requiresAuth) {
      const token = await getAuthToken()
      if (!token) {
        throw new Error("Authentication required")
      }
      headers["Authorization"] = `Bearer ${token}`
    }

    const config: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string | null;
  };
  sessionId: string;
  employeeId: string;
}

interface Organization {
  id: string;
  name: string;
  orgPic: string | null;
}

interface OrganizationResponse {
  organizations: Organization[];
  id: string;
  name: string;
  orgPic: string | null;
}

enum TimeUnit {
  minutes = 'minutes',
  hours = 'hours'
}

enum Status {
  unscheduled = 'unscheduled',
  todo = 'todo',
  inprogress = 'inprogress',
  completed = 'completed'
}

interface Task {
  id: string;
  task: string;
  requiredTimeValue: number;
  requiredTimeUnit: TimeUnit;
  spaceNeeded: number;
}

export interface JobOrderTask {
  id: string;
  jobOrderId: string;
  taskId: string;
  quantity: number;
  task: Task;
}

export interface Employee {
  id: string;
  name: string;
  email: string | null;
  area: string;
  areaLat: number;
  areaLong: number;
  space: number;
  lastLat: number | null;
  lastLong: number | null;
}

interface EmployeeSchedule {
  id: string;
  employeeId: string;
  scheduleId: string;
  totalDistance: number;
  totalTime: number;
  totalOrders: number;
  totalSpace: number;
  employee: Employee;
}

export interface JobOrder {
  id: string;
  orderNumber: string;
  createdAt: Date;
  address: string;
  city: string;
  postCode: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  spaceRequried: number;
  placeId: string;
  status: Status;
  schedulesId: string | null;
  employeeId: string | null;
  scheduledOrder: number | null;
  JobOrderTask: JobOrderTask[];
  EmployeeSchedule: EmployeeSchedule[];
}

export interface ScheduleDetails {
  id: string;
  name: string;
  orgId: string;
  createdAt: string; // ISO date string
  departAddress: string;
  departCity: string;
  departPostCode: string;
  departState: string;
  departCountry: string;
  departLatitude: number;
  departLongitude: number;
  departTime: string; // ISO date string
  departPlaceId: string;
  jobOrder: JobOrder[]; // Array of JobOrder
}

export interface Schedule {
  id: string;
  name: string;
  createdAt: Date;
  departAddress: string;
  departTime: Date;
}

interface ScheduleResponse {
  schedules: Schedule[];
}

// Auth API functions
export const loginApi = async (username: string, password: string) => {
  return apiRequest<LoginResponse>(
    "/login", 
    "POST", 
    { username, password }, 
    false
  );
}

export const findEmployee = async (userId: string, orgId: string) => {
  console.log("findEmployee", userId, orgId)
  return apiRequest<Employee>(
    `/employees?userId=${userId}&orgId=${orgId}`,
    "GET",
    undefined,
    false
  );
}

export const loadOrganizations = async (userId: string) => {
  return apiRequest<OrganizationResponse>(
    `/organizations/${userId}`,
    "GET",
    undefined,
    false
  );
}

export const loadSchedules = async (employeeId: string, orgId: string) => {
  return apiRequest<ScheduleResponse>(
    `/schedules/load?employeeId=${employeeId}&orgId=${orgId}`, 
    "GET", 
    undefined, 
    false
  );
}

export const findSchedule = async (scheduleId: string, employeeId: string) => {
  return apiRequest<ScheduleDetails>(
    `/schedules/find?scheduleId=${scheduleId}&employeeId=${employeeId}`, 
    "GET", 
    undefined,
    false
  );
}

export interface LocationData {
  userId: string; 
  latitude: number;
  longitude: number;
  orgId: string;
  scheduleId: string;
}

// Location API functions
export const sendLocationApi = async (locationData: LocationData) => {
  const headers = {
    'Content-Type': 'application/json'
  }

  return apiRequest<{ success: boolean }>("/update-location", "POST", locationData, false)
}

export const getUserLocationsApi = async (userId: string) => {
  return apiRequest<any[]>(`/location/user/${userId}`, "GET")
}

