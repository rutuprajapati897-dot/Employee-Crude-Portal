
import { useEffect, useState } from "react";

function EmployeeCard({ employee, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-slate-800 border border-slate-700 p-4 rounded-xl">
      <div>
        <h3 className="font-bold text-white">
          {employee.id}. {employee.name}
        </h3>
        <p className="text-sm text-slate-400">{employee.email}</p>
        <p className="text-cyan-400">Salary: ₹{employee.salary}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(employee)}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(employee.id)}
          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(
          data.slice(0, 5).map((e, index) => ({
            id: index + 1,
            name: e.name,
            email: e.email,
            salary: 25000
          }))
        );
      })
      .catch(() => {
        setEmployees([
          { id: 1, name: "Aarav Patel", email: "aarav@gmail.com", salary: 25000 },
          { id: 2, name: "Diya Shah", email: "diya@gmail.com", salary: 28000 },
          { id: 3, name: "Krish Modi", email: "krish@gmail.com", salary: 30000 },
          { id: 4, name: "Riya Mehta", email: "riya@gmail.com", salary: 27000 },
          { id: 5, name: "Dev Joshi", email: "dev@gmail.com", salary: 32000 }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  function saveEmployee(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !salary) return;

    if (editId !== null) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editId
            ? { ...emp, name: name.trim(), email: email.trim(), salary }
            : emp
        )
      );
    } else {
      const nextId =
        employees.length === 0
          ? 1
          : Math.max(...employees.map((emp) => emp.id)) + 1;

      setEmployees([
        ...employees,
        {
          id: nextId,
          name: name.trim(),
          email: email.trim(),
          salary
        }
      ]);
    }

    clearForm();
  }

  function editEmployee(emp) {
    setEditId(emp.id);
    setName(emp.name);
    setEmail(emp.email);
    setSalary(String(emp.salary));
  }

  function deleteEmployee(id) {
    setEmployees(employees.filter((emp) => emp.id !== id));

    if (editId === id) clearForm();
  }

  function clearForm() {
    setEditId(null);
    setName("");
    setEmail("");
    setSalary("");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-5 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-cyan-400 font-bold tracking-widest">
            EMPLOYEE PORTAL
          </p>
          <h1 className="text-4xl font-extrabold mt-2">
            Staff<span className="text-purple-400">Sphere</span>
          </h1>
          <p className="text-slate-400 mt-2">
            Employee Management System
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <form
            onSubmit={saveEmployee}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-fit"
          >
            <h2 className="text-xl font-bold text-purple-300 mb-5">
              {editId !== null ? "Update Employee" : "Add Employee"}
            </h2>

            <label className="text-slate-300 text-sm">Name</label>
            <input
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 mt-1 mb-4 outline-none focus:border-purple-400"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label className="text-slate-300 text-sm">Email</label>
            <input
              type="email"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 mt-1 mb-4 outline-none focus:border-purple-400"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="text-slate-300 text-sm">Salary (₹)</label>
            <input
              type="number"
              min="1"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 mt-1 mb-5 outline-none focus:border-purple-400"
              placeholder="Enter salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-bold"
            >
              {editId !== null ? "Save Changes" : "+ Add Employee"}
            </button>

            {editId !== null && (
              <button
                type="button"
                onClick={clearForm}
                className="w-full mt-2 bg-slate-700 hover:bg-slate-600 p-3 rounded-lg"
              >
                Cancel
              </button>
            )}
          </form>

          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">Our Team</h2>
              <span className="bg-cyan-400/10 text-cyan-300 px-3 py-1 rounded-full text-sm">
                {employees.length} Employees
              </span>
            </div>

            {loading ? (
              <p className="text-cyan-300">Loading employees...</p>
            ) : employees.length === 0 ? (
              <p className="text-slate-400 text-center py-10">
                No employees found. Add your first employee!
              </p>
            ) : (
              <div className="space-y-3">
                {employees.map((emp) => (
                  <EmployeeCard
                    key={emp.id}
                    employee={emp}
                    onEdit={editEmployee}
                    onDelete={deleteEmployee}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
