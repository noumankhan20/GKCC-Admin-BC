"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MemberTable from "./MemberTable";
import MemberModal from "./MemberModal";

const SAMemberListPage = () => {
  const [filter, setFilter] = useState("pending");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For the modal
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch the members according to filter
  useEffect(() => {
    let isMounted = true;

    const fetchMembers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      // URLs mapped by filter
      const urlMap = {
        pending: `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/getSApendinglist`,
        allowed: `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/getSAacceptedlist`,
        rejected: `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/getSARejectedlist`,
      };

      try {
        const response = await axios.get(urlMap[filter], {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted) {
          setMembers(
            Array.isArray(response.data.message) ? response.data.message : []
          );
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "An error occurred");
          setLoading(false);
        }
      }
    };

    fetchMembers();
    return () => {
      isMounted = false;
    };
  }, [filter]);

  // Open the modal with the selected member
  const openModalWithMember = (member) => {
    setSelectedMember(member);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedMember(null);
  };

  /**
   * handleApprove serves two purposes:
   * 1. Approve pending member (calls /approve/:id)
   * 2. Save changes to an already approved member (calls /update/:id)
   */
  const handleApprove = async (memberId, editableData) => {
    const token = localStorage.getItem("token");
    if (!memberId) return;

    try {
      const requestData = { ...editableData };
      console.log("Request Data:", requestData);

      // Decide the endpoint based on filter
      const endpoint =
        filter === "pending"
          ? `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/approve/${memberId}`
          : `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/approve/${memberId}`;

      await axios.post(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert(
        filter === "pending"
          ? "Approved successfully!"
          : "Updated successfully!"
      );

      // After approving or updating:
      // If your backend removes the user from the pending list or you just want to refresh, do so:
      setMembers((prev) => prev.filter((m) => m._id !== memberId));

      // Close the modal
      closeModal();
    } catch (error) {
      console.error("Error processing request:", error);
      alert(error.response?.data?.message || "Failed to process request");
    }
  };

  // Reject only applies to pending members
  const handleReject = async (memberId) => {
    const token = localStorage.getItem("token");
    if (!memberId) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/reject/${memberId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMembers((prev) => prev.filter((m) => m._id !== memberId));
      closeModal();
    } catch (err) {
      console.error("Error rejecting member:", err);
      alert(err.response?.data?.message || "Failed to reject");
    }
  };

  return (
    <div className="flex flex-col p-4 bg-blue-500 text-white mt-6 rounded-lg">
      <h2 className="text-lg font-bold mb-4">SA Member List</h2>

      {/* Filter Buttons */}
      <div className="flex justify-center space-x-4 mb-4">
        {["allowed", "pending", "rejected"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded ${
              filter === status ? "bg-blue-800 text-white" : "bg-white text-black"
            }`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Conditional Rendering for Loading, Error or Table */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <MemberTable
          members={members}
          filter={filter}
          onView={openModalWithMember}
        />
      )}

      {selectedMember && (
        <MemberModal
          mode={filter} // 'pending' | 'allowed' | 'rejected'
          member={selectedMember}
          onClose={closeModal}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default SAMemberListPage;
