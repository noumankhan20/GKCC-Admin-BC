"use client";
import React, { useState, useEffect } from "react";

const MemberModal = ({ member, onClose, onApprove, onReject, mode = "pending" }) => {
  // Local state to hold form values
  const [editableData, setEditableData] = useState(member || {});

  useEffect(() => {
    setEditableData(member || {});
  }, [member]);

  // Generic text change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // For editing children array, if needed
  const handleChildrenChange = (index, field, value) => {
    setEditableData((prev) => {
      const updatedChildren = [...(prev.children || [])];
      updatedChildren[index] = {
        ...updatedChildren[index],
        [field]: value,
      };
      return { ...prev, children: updatedChildren };
    });
  };

  // Discard changes and reset to original data
  const discardChanges = () => {
    setEditableData(member || {});
  };

  // Approve (for pending) or Save (for allowed)
  const handleSaveClick = () => {
    onApprove(member._id, editableData);
  };

  // Reject (only shown in pending mode)
  const handleRejectClick = () => {
    onReject(member._id);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white text-black rounded-lg max-h-screen w-full max-w-4xl p-6 overflow-y-auto relative z-10">
        <h3 className="text-xl font-bold mb-4">
          {mode === "pending"
            ? `Edit & Approve: ${member?.firstName} ${member?.middleName} ${member?.familyName}`
            : `Edit Approved Member: ${member?.firstName} ${member?.middleName} ${member?.familyName}`}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* EXAMPLE FIELDS - Add as many as you need */}
          <div>
            <label className="block font-semibold">First Name</label>
            <input
              type="text"
              name="firstName"
              value={editableData.firstName || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={editableData.middleName || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Family Name</label>
            <input
              type="text"
              name="familyName"
              value={editableData.familyName || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={editableData.email || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={
                editableData.dob
                  ? new Date(editableData.dob).toISOString().substring(0, 10)
                  : ""
              }
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          {/* More fields (phone, address, etc.) as needed... */}
          <div>
            <label className="block font-semibold">Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              value={editableData.bloodGroup || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Education</label>
            <input
              type="text"
              name="education"
              value={editableData.education || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          {/* WhatsApp fields */}
          <div>
            <label className="block font-semibold">WhatsApp Code</label>
            <input
              type="text"
              name="whatsappCountryCode"
              value={editableData.countryCode || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">WhatsApp Number</label>
            <input
              type="text"
              name="whatsappNumber"
              value={editableData.whatsappNumber || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          {/* Mobile fields */}
          <div>
            <label className="block font-semibold">Mobile Code</label>
            <input
              type="text"
              name="mobileCountryCode"
              value={editableData.countryCode || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={editableData.mobileNumber || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block font-semibold">Gender</label>
            <select
              name="gender"
              value={editableData.gender || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label className="block font-semibold">Marital Status</label>
            <select
              name="maritalStatus"
              value={editableData.maritalStatus || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="">-- Select --</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          </div>

          {/* International Address */}
          <div>
            <label className="block font-semibold">Intl. Flat</label>
            <input
              type="text"
              name="internationalFlat"
              value={editableData.internationalFlat || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Intl. Block</label>
            <input
              type="text"
              name="internationalBlock"
              value={editableData.internationalBlock || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Intl. Street Address</label>
            <input
              type="text"
              name="internationalStreetAddress"
              value={editableData.internationalStreetAddress || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Intl. City</label>
            <input
              type="text"
              name="internationalCity"
              value={editableData.internationalCity || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Intl. State/Province</label>
            <input
              type="text"
              name="internationalStateProvince"
              value={editableData.internationalStateProvince || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Intl. Postal Code</label>
            <input
              type="text"
              name="internationalPostalCode"
              value={editableData.internationalPostalCode || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Intl. Country</label>
            <input
              type="text"
              name="internationalCountry"
              value={editableData.internationalCountry || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          {/* Native Address */}
          <div>
            <label className="block font-semibold">Native Flat</label>
            <input
              type="text"
              name="nativeFlat"
              value={editableData.nativeFlat || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Native Block</label>
            <input
              type="text"
              name="nativeBlock"
              value={editableData.nativeBlock || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Native City</label>
            <input
              type="text"
              name="nativeCity"
              value={editableData.nativeCity || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">District</label>
            <input
              type="text"
              name="district"
              value={editableData.district || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Native Pincode</label>
            <input
              type="text"
              name="nativePincode"
              value={editableData.nativePincode || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold">Area</label>
            <input
              type="text"
              name="area"
              value={editableData.area || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          {/* Family Info */}
          <div>
            <label className="block font-semibold">Father Name</label>
            <input
              type="text"
              name="fatherName"
              value={editableData.fatherName || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Mother Name</label>
            <input
              type="text"
              name="motherName"
              value={editableData.motherName || ""}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>


          {/* If children array editing is needed */}
          {Array.isArray(editableData.children) &&
            editableData.children.map((child, index) => (
              <div key={index} className="col-span-2">
                <label className="block font-semibold">
                  Child {index + 1} Name:
                </label>
                <input
                  type="text"
                  value={child.name || ""}
                  onChange={(e) =>
                    handleChildrenChange(index, "name", e.target.value)
                  }
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end mt-6">
          {/* For both pending and allowed, handleSaveClick -> onApprove */}
          <button
            onClick={handleSaveClick}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            {mode === "pending" ? "Approve (With Changes)" : "Save Changes"}
          </button>

          <button
            onClick={discardChanges}
            className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
          >
            Discard Changes
          </button>

          {/* Show Reject button only for pending mode */}
          {mode === "pending" && (
            <button
              onClick={handleRejectClick}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Reject
            </button>
          )}

          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;

