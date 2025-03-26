"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Child components
import AMemberFilterTabs from "./AMemberFilterTabs";
import AMemberTable from "./AMemberTable";
import AMemberEditForm from "./AMemberEditForm";

const AMemberList = () => {
  const [filter, setFilter] = useState("pending"); // Default to 'pending'
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected member form logic
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState(null);

  // File states for images
  const [signatureFile, setSignatureFile] = useState(null);
  const [associationLogoFile, setAssociationLogoFile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMembers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        let url;
        if (filter === "pending") {
          url = `${process.env.NEXT_PUBLIC_BACKEND_API}/association/getPendingAssociation`;
        } else if (filter === "allowed") {
          url = `${process.env.NEXT_PUBLIC_BACKEND_API}/association/getAcceptedAssociation`;
        } else if (filter === "rejected") {
          url = `${process.env.NEXT_PUBLIC_BACKEND_API}/association/getRejectedAssociation`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          const memberData = response.data.message || [];
          setMembers(Array.isArray(memberData) ? memberData : []);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response ? err.response.data.message : "An error occurred"
        );
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMembers();
    return () => {
      isMounted = false;
    };
  }, [filter]);

  /**
   * Toggle form when user clicks "View"/"Edit".
   * - If the same member is clicked again, close the form.
   * - If a different member is clicked, open the form with that member's data.
   */
  const handleView = (member) => {
    if (selectedMember && selectedMember._id === member._id) {
      // Close the form
      handleDiscard();
    } else {
      // Open form
      setSelectedMember(member);
      setFormData(JSON.parse(JSON.stringify(member)));
      setSignatureFile(null);
      setAssociationLogoFile(null);
    }
  };

  /**
   * Close form automatically when switching tabs
   */
  useEffect(() => {
    handleDiscard();
  }, [filter]);

  /**
   * Discard changes -> close form
   */
  const handleDiscard = () => {
    setSelectedMember(null);
    setFormData(null);
    setSignatureFile(null);
    setAssociationLogoFile(null);
  };

  /**
   * Approve (or Save) - same API for both "pending" and "allowed".
   * If "pending", we remove from list after success.
   * If "allowed", we keep them in the list (just update).
   */
  const handleApproveOrSave = async (memberId) => {
    const token = localStorage.getItem("token");
    try {
      const payload = new FormData();
      // Basic fields
      payload.append("associationName", formData.associationName);
      payload.append("country", formData.country);
      payload.append("locationCity", formData.locationCity);
      payload.append("associationContactNumber", formData.associationContactNumber);
      payload.append("associationEmail", formData.associationEmail);
      payload.append("websiteLink", formData.websiteLink);
      payload.append("yearEstablished", formData.yearEstablished);
      payload.append("numberOfMembers", formData.numberOfMembers);
      payload.append("associationActivities", formData.associationActivities);
      payload.append("activityDate", formData.activityDate);

      // Nested objects
      payload.append("president", JSON.stringify(formData.president));
      payload.append("secretary", JSON.stringify(formData.secretary));

      // Signature & Logo
      if (signatureFile) {
        payload.append("signature", signatureFile);
      } else {
        payload.append("signature", formData.president.signature || "");
      }
      if (associationLogoFile) {
        payload.append("logo", associationLogoFile);
      } else {
        payload.append("logo", formData.associationLogo || "");
      }

      // NOTE: Using the same "approveAssociation" endpoint for both
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/association/approveAssociation/${memberId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Show different alerts for pending vs. accepted
      if (filter === "pending") {
        alert("Member approved successfully");
        // Remove from table
        setMembers(members.filter((m) => m._id !== memberId));
      } else if (filter === "allowed") {
        alert("Member updated successfully");
        // Update in the table
        const updatedList = members.map((m) =>
          m._id === memberId ? { ...m, ...formData } : m
        );
        setMembers(updatedList);
      }

      // Finally close the form
      handleDiscard();
    } catch (err) {
      console.error("Error saving member:", err);
      alert("Error saving member");
    }
  };

  /**
   * Reject (only for pending).
   */
  const handleReject = async (memberId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/association/rejectAssociation/${memberId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Member rejected successfully");
      setMembers(members.filter((m) => m._id !== memberId));
      handleDiscard();
    } catch (err) {
      console.error("Error rejecting member:", err);
      alert("Error rejecting member");
    }
  };

  if (loading) {
    return (
      <div className="text-white" aria-live="polite">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500" aria-live="assertive">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 bg-blue-500 text-white mt-6 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Association List</h2>

      {/* Filter Buttons */}
      <AMemberFilterTabs filter={filter} setFilter={setFilter} />

      {/* Table of Members */}
      <AMemberTable
        members={members}
        filter={filter}
        handleView={handleView}
        selectedMember={selectedMember}
      />

      {/* Inline Editable Form */}
      {formData && (
        <AMemberEditForm
          filter={filter}
          formData={formData}
          setFormData={setFormData}
          onApproveOrSave={handleApproveOrSave}
          onReject={handleReject}
          onDiscard={handleDiscard}
          signatureFile={signatureFile}
          setSignatureFile={setSignatureFile}
          associationLogoFile={associationLogoFile}
          setAssociationLogoFile={setAssociationLogoFile}
        />
      )}
    </div>
  );
};

export default AMemberList;
