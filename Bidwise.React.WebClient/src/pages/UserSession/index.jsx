import { useAuth } from "../../context/AuthContext";

const UserSessionPage = () => {
  const { loggedInUser, loading, error } = useAuth();

  if (loading) {
    return (
      <p>
        <em>Loading...</em>
      </p>
    );
  }

  if (error) {
    return (
      <p>
        <em>{error}</em>
      </p>
    );
  }

  return (
    <div>
      <h1 id="tabelLabel">User Session</h1>
      <p>This pages shows the current user&apos;s session.</p>
      <table className="table table-striped" aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Claim Type</th>
            <th>Claim Value</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(loggedInUser) &&
            loggedInUser.map((claim) => (
              <tr key={claim.type}>
                <td>{claim.type}</td>
                <td>{claim.value}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserSessionPage;
