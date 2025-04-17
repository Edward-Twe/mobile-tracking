"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { findEmployee, loadOrganizations } from "../services/api";
import { useAuth } from "./AuthContext";

interface Organization {
  id: string;
  name: string;
}

interface OrganizationContextType {
  organizations: Organization[];
  selectedOrganization: Organization | null;
  selectOrganization: (organization: Organization) => void;
  clearSelectedOrg: () => void;
  isLoading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadOrgsData = async () => {
      if (!user?.id) {
        console.log("No user ID found:", user);
        return;
      }

      try {
        setIsLoading(true);
        const data = await loadOrganizations(user.id);

        if (!Array.isArray(data)) {
          console.error("Invalid data format received");
          return;
        }

        setOrganizations(data);
      } catch (error) {
        console.error("Error loading organizations:", error);
        setOrganizations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrgsData();
  }, [user?.id]);

  const selectOrganization = async (organization: Organization) => {
    setSelectedOrganization(organization);
    try {
      await AsyncStorage.setItem("selectedOrganizationId", organization.id);
      const employee = await findEmployee(user?.id, organization.id);
      await AsyncStorage.setItem("employee", JSON.stringify(employee));
      console.log("Employee saved:", employee);
    } catch (error) {
      console.error("Error saving selected organization:", error);
    }
  };

  const clearSelectedOrg = async () => {
    setSelectedOrganization(null);
    try {
      await AsyncStorage.removeItem("selectedOrganizationId");
    } catch (error) {
      console.error("Error clearing selected organization:", error);
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        selectedOrganization,
        selectOrganization,
        clearSelectedOrg,
        isLoading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
};
