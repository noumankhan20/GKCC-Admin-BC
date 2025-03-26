"use client";
import React from "react";

const AMemberEditForm = ({
  filter,
  formData,
  setFormData,
  onApproveOrSave,
  onReject,
  onDiscard,
  signatureFile,
  setSignatureFile,
  associationLogoFile,
  setAssociationLogoFile,
}) => {
  return (
    <div className="mt-6 p-6 bg-white text-black rounded-lg">
      <h3 className="text-xl font-bold mb-4">
        {filter === "pending" ? "Approve Association" : "Edit Association"} (ID:{" "}
        {formData._id})
      </h3>

      <form>
        {/* Association Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold">Association Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.associationName || ""}
              onChange={(e) =>
                setFormData({ ...formData, associationName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Country</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.country || ""}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Location City</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.locationCity || ""}
              onChange={(e) =>
                setFormData({ ...formData, locationCity: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-semibold">
              Association Contact Number
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.associationContactNumber || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  associationContactNumber: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Association Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              value={formData.associationEmail || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  associationEmail: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Website Link</label>
            <input
              type="url"
              className="w-full p-2 border rounded"
              value={formData.websiteLink || ""}
              onChange={(e) =>
                setFormData({ ...formData, websiteLink: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Year Established</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={formData.yearEstablished || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  yearEstablished: Number(e.target.value),
                })
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Number of Members</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={formData.numberOfMembers || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numberOfMembers: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold">
              Association Activities
            </label>
            <textarea
              className="w-full p-2 border rounded"
              value={formData.associationActivities || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  associationActivities: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block font-semibold">Activity Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={
                formData.activityDate
                  ? new Date(formData.activityDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  activityDate: new Date(e.target.value).toISOString(),
                })
              }
            />
          </div>
        </div>

        {/* President Details */}
        <div className="mt-6">
          <h4 className="text-lg font-bold mb-2">President Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.president?.name || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    president: {
                      ...formData.president,
                      name: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block font-semibold">Mobile Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.president?.mobileNumber || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    president: {
                      ...formData.president,
                      mobileNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block font-semibold">WhatsApp Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.president?.whatsappNumber || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    president: {
                      ...formData.president,
                      whatsappNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={formData.president?.email || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    president: {
                      ...formData.president,
                      email: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block font-semibold">District</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.president?.district || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    president: {
                      ...formData.president,
                      district: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block font-semibold">Taluka</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.president?.taluka || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    president: {
                      ...formData.president,
                      taluka: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block font-semibold">Village</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.president?.village || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    president: {
                      ...formData.president,
                      village: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block font-semibold">Signature</label>
              <div className="mb-2">
                {signatureFile ? (
                  <img
                    src={URL.createObjectURL(signatureFile)}
                    alt="Signature Preview"
                    style={{ maxWidth: "256px" }}
                  />
                ) : formData.president?.signature ? (
                  <img
                    src={formData.president.signature}
                    alt="Signature"
                    style={{ maxWidth: "256px" }}
                  />
                ) : (
                  <span>No signature available</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSignatureFile(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        {/* Secretary Details */}
        <div className="mt-6">
          <h4 className="text-lg font-bold mb-2">Secretary Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.secretary?.name || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secretary: {
                      ...formData.secretary,
                      name: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block font-semibold">Mobile Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.secretary?.mobileNumber || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secretary: {
                      ...formData.secretary,
                      mobileNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block font-semibold">WhatsApp Number</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.secretary?.whatsappNumber || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secretary: {
                      ...formData.secretary,
                      whatsappNumber: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block font-semibold">District</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.secretary?.district || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secretary: {
                      ...formData.secretary,
                      district: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block font-semibold">Taluka</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.secretary?.taluka || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secretary: {
                      ...formData.secretary,
                      taluka: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block font-semibold">Village</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.secretary?.village || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secretary: {
                      ...formData.secretary,
                      village: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Optional Association Logo */}
        <div className="mt-6">
          <label className="block font-semibold">Association Logo (Optional)</label>
          <div className="mb-2">
            {associationLogoFile ? (
              <img
                src={URL.createObjectURL(associationLogoFile)}
                alt="Association Logo Preview"
                style={{ maxWidth: "256px" }}
              />
            ) : formData.associationLogo ? (
              <img
                src={formData.associationLogo}
                alt="Association Logo"
                style={{ maxWidth: "256px" }}
              />
            ) : (
              <span>No logo available</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAssociationLogoFile(e.target.files[0])}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-2">
          {filter === "pending" && (
            <>
              <button
                type="button"
                onClick={() => onApproveOrSave(formData._id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => onReject(formData._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </>
          )}

          {filter === "allowed" && (
            <button
              type="button"
              onClick={() => onApproveOrSave(formData._id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          )}

          <button
            type="button"
            onClick={onDiscard}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Discard Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AMemberEditForm;
