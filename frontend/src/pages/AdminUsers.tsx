// src/pages/AdminUsers.tsx
import { useEffect, useState } from "react";
import { db } from "../firebaseClient";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

interface User {
  uid: string;
  email: string;
  role: string;
  displayName?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const data: User[] = snapshot.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }));
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (uid: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", uid), { role: newRole });
      setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)));
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const deleteUser = async (uid: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteDoc(doc(db, "users", uid));
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <table className="w-full border-collapse border border-slate-300">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-2">Email</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.uid}>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.displayName || "-"}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                  onClick={() => updateRole(u.uid, u.role === "admin" ? "student" : "admin")}
                >
                  Make {u.role === "admin" ? "Student" : "Admin"}
                </button>
                <button
                  className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                  onClick={() => deleteUser(u.uid)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
