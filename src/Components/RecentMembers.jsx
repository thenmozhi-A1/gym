import React from "react";

const membersData = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    joined: "Apr 2, 2025",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    email: "mrod@example.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    joined: "Apr 1, 2025",
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Emma Chen",
    email: "emma.c@example.com",
    phone: "+1 (555) 234-5678",
    status: "pending",
    joined: "Mar 29, 2025",
    avatar: "/placeholder.svg",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "j.wilson@example.com",
    phone: "+1 (555) 876-5432",
    status: "active",
    joined: "Mar 28, 2025",
    avatar: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Olivia Martinez",
    email: "oliviam@example.com",
    phone: "+1 (555) 345-6789",
    status: "inactive",
    joined: "Mar 26, 2025",
    avatar: "/placeholder.svg",
  },
];

const statusClasses = {
  active: "badge bg-success text-light",
  pending: "badge bg-warning text-dark",
  inactive: "badge bg-danger text-light",
};

const RecentMembers = () => {
  return (
    <>
      {/* Internal CSS */}
      <style>{`

    .card shadow-sm {
        border-radius: 0.5rem;
        border: 1px solid #dee2e6;
        width: 100%;
        margin-bottom: 1.5rem;
        background-color: #fff;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1); 
        }



        .member-row:hover {
          background-color: #f8f9fa;
        }

        .member-avatar {
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid #dee2e6;
        }

        .member-name {
          font-weight: 500;
        }

        .member-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
        }
      `}</style>

      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Member Signups</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Member</th>
                  <th scope="col" className="d-none d-md-table-cell">
                    Contact
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col" className="d-none d-sm-table-cell">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {membersData.map((member) => (
                  <tr key={member.id} className="member-row">
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={member.avatar}
                          alt={member.name || "Avatar"}
                          className="member-avatar"
                          width="36"
                          height="36"
                        />
                        <div>
                          <div className="member-name">{member.name}</div>
                          <div className="text-muted d-md-none">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="d-none d-md-table-cell">
                      <div>{member.email}</div>
                      <div className="text-muted small">{member.phone}</div>
                    </td>
                    <td>
                      <span className={`member-badge ${statusClasses[member.status]}`}>
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>
                    <td className="d-none d-sm-table-cell">{member.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentMembers;
