import React, { useState } from "react";
import axios from "axios";

export const CompanyFetcher = () => {
  const [companyId, setCompanyId] = useState("4");
  const [companyData, setCompanyData] = useState(null);
  const [error, setError] = useState(null);

  const handleFetchCompany = async () => {
    setError(null); // Reset error state

    try {
      const response = await axios.get(
        `https://fastapi-dev-1-hneke7a2fvf0hyba.eastus-01.azurewebsites.net/api/companies/${companyId}`
      );
      setCompanyData(response.data);
    } catch (err) {
      setError(err.response ? err.response.data : "An error occurred");
    }
  };

  return (
    <div>
      <h1>Fetch Company Data</h1>
      <input
        type="number"
        placeholder="Enter Company ID"
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
      />
      <button onClick={handleFetchCompany}>Fetch Company</button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {companyData && (
        <div>
          <h2>Company Data:</h2>
          <pre>{JSON.stringify(companyData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
