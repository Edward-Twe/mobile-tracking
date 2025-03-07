"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, SafeAreaView } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useOrganization } from "../context/OrganizationContext"

interface Organization {
  id: string
  name: string
}

const OrganizationDropdown = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const { organizations, selectedOrganization, selectOrganization } = useOrganization()

  const handleSelectOrganization = (org: Organization) => {
    selectOrganization(org)
    setModalVisible(false)
  }

  return (
    <View>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.selectedText} numberOfLines={1}>
          {selectedOrganization?.name || "Select Organization"}
        </Text>
        <Feather name="chevron-down" size={16} color="#4a5568" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Organization</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#4a5568" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={organizations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.orgItem, selectedOrganization?.id === item.id && styles.selectedOrgItem]}
                  onPress={() => handleSelectOrganization(item)}
                >
                  <Text style={[styles.orgName, selectedOrganization?.id === item.id && styles.selectedOrgName]}>
                    {item.name}
                  </Text>
                  {selectedOrganization?.id === item.id && <Feather name="check" size={18} color="#4299e1" />}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.orgList}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#edf2f7",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 250,
  },
  selectedText: {
    fontSize: 14,
    color: "#4a5568",
    marginRight: 8,
    maxWidth: 210,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: "auto",
    height: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  orgList: {
    padding: 16,
  },
  orgItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  selectedOrgItem: {
    backgroundColor: "#ebf8ff",
  },
  orgName: {
    fontSize: 16,
    color: "#4a5568",
  },
  selectedOrgName: {
    color: "#4299e1",
    fontWeight: "500",
  },
})

export default OrganizationDropdown

