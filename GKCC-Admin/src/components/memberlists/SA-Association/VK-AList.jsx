'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";

const AssociationList = () => {
  const [associations, setAssociations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAssociationId, setSelectedAssociationId] = useState(null); // Track selected association's ID
  const [selectedAssociation, setSelectedAssociation] = useState(null); // Store the full details of the selected association
  const [viewDetails, setViewDetails] = useState(null); // Store the details to show for the clicked association
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  // API endpoint to fetch accepted associations
  const url = `http://localhost:5001/api/association/getAcceptedAllAssociation`;

  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        const response = await axios.get(url);
        const data =
          response.data.data || response.data.associations || response.data;
        setAssociations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to fetch associations");
      } finally {
        setLoading(false);
      }
    };

    fetchAssociations();
  }, [url]);

  // Fetch member count for each association
  const fetchMemberCount = async (associationName) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/member/totalMembers/${associationName}`
      );
      return response.data.data?.totalMembers || 0; // Directly return totalMembers instead of length
    } catch (err) {
      console.error("Failed to fetch member count", err);
      return 0;
    }
  };

  // Fetch president and secretary details by GKCC ID
  const fetchAssociationDetails = async (gkccId) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/association/getAssociationByGKCCId/${gkccId}`
      );
      return response.data.data;
    } catch (err) {
      console.error("Failed to fetch association details", err);
      return {};
    }
  };

  // Fetch membership details for each association using the association name
  const fetchMembershipDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/member/memberships/Code4Bharat`
      );
      return response.data.data || []; // Return member data
    } catch (err) {
      console.error("Failed to fetch membership details", err);
      return [];
    }
  };

  // Combine all data (president, secretary, member count, and memberships)
  const getAssociationDetails = async (association) => {
    const memberCount = await fetchMemberCount(association.associationName);
    const details = await fetchAssociationDetails(association.GKCCId);
    const memberships = await fetchMembershipDetails(association.associationName);

    return {
      ...association,
      president: details.president,
      secretary: details.secretary,
      memberCount,
      memberships, // Add membership details
    };
  };

  const [associationsWithDetails, setAssociationsWithDetails] = useState([]);

  useEffect(() => {
    const fetchAllDetails = async () => {
      const allDetailsPromises = associations.map(async (association) => {
        const fullDetails = await getAssociationDetails(association);
        return fullDetails;
      });
      const allDetails = await Promise.all(allDetailsPromises);
      setAssociationsWithDetails(allDetails);
    };

    if (associations.length > 0) {
      fetchAllDetails();
    }
  }, [associations]);

  // Filter associations based on search term, ensuring values are not undefined
  const filteredAssociations = associationsWithDetails.filter((assoc) => {
    return (
      (assoc.GKCCId && assoc.GKCCId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (assoc.associationName && assoc.associationName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (assoc.country && assoc.country.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Handle the View Details button click for Code4Bharat only
  const handleViewDetails = async () => {
    const details = await fetchMembershipDetails();
    setSelectedAssociation(details);
  };

  if (loading) {
    return <div className="text-white">Loading associations...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col p-4 bg-blue-500 text-white mt-6 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Accepted Association List</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by GKCC ID, Name, or Country"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-full text-black rounded-md"
        />
      </div>

      {/* Table of Associations */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">GKCC ID</th>
              <th className="px-4 py-2 border">Association Name</th>
              <th className="px-4 py-2 border">President</th>
              <th className="px-4 py-2 border">Secretary</th>
              <th className="px-4 py-2 border">Country</th>
              <th className="px-4 py-2 border">Member Count</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssociations.map((assoc, index) => (
              <tr key={assoc.GKCCId || index}>
                <td className="px-4 py-2 border">{assoc.GKCCId || "N/A"}</td>
                <td className="px-4 py-2 border">{assoc.associationName || "N/A"}</td>
                <td className="px-4 py-2 border">{assoc.president?.name || "N/A"}</td>
                <td className="px-4 py-2 border">{assoc.secretary?.name || "N/A"}</td>
                <td className="px-4 py-2 border">{assoc.country || "N/A"}</td>
                <td className="px-4 py-2 border">{assoc.memberCount || "N/A"}</td>
                <td className="px-4 py-2 border">
                  {assoc.associationName === "Code4Bharat" && (
                    <button
                    onClick={handleViewDetails}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    View Details
                  </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show association details if this is the selected association */}
      {selectedAssociation && (
        <div className="mt-6 p-4 bg-blue-600 rounded-lg text-white">
          <h3 className="text-lg font-bold mb-4">Code4Bharat Details</h3>
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border">GKCC ID</th>
                <th className="px-4 py-2 border">First Name</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
              </tr>
            </thead>
            <tbody>
              {selectedAssociation.map((member, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{member.GKCCId || "N/A"}</td>
                  <td className="px-4 py-2 border">{member.firstName || "N/A"}</td>
                  <td className="px-4 py-2 border">{member.status || "N/A"}</td>
                  <td className="px-4 py-2 border">{member.email || "N/A"}</td>
                  <td className="px-4 py-2 border">{member.mobileNumber || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssociationList;
