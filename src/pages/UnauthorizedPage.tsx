import React from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "72px", margin: "0" }}>403</h1>
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Access Denied</h2>
      <p style={{ fontSize: "16px", color: "#666", marginBottom: "30px" }}>
        You do not have permission to view this page.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        Go to Home Page
      </button>
    </div>
  );
};

export default UnauthorizedPage;
