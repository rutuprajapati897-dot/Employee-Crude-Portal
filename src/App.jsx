
import React, { useState, useEffect } from "react";

function App() {
  const [employees, setEmployees] = useState([]);
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => setEmployees(
        data.slice(0, 3).map(e => ({
          id: e.id,
          name: e.name,
          salary: 20000
        }))
      ))
      .catch(err => console.log(err));
  }, []);

  function saveEmployee() {
    if (!name.trim() || !salary) {
      alert("Enter all details");
      return;
    }

    if (id !== null) {
      setEmployees(employees.map(e =>
        e.id === id ? { ...e, name, salary } : e
      ));
    } else {
      const newId = employees.length
        ? Math.max(...employees.map(e => e.id)) + 1
        : 1;

      setEmployees([...employees, {
        id: newId,
        name,
        salary
      }]);
    }

    setId(null);
    setName("");
    setSalary("");
  }

  function editEmployee(e) {
    setId(e.id);
    setName(e.name);
    setSalary(e.salary);
  }

  function deleteEmployee(id) {
    setEmployees(employees.filter(e => e.id !== id));
  }

  return (
    <div>
      <h1>Employee Management System</h1>

      <input
        placeholder="Employee Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Salary"
        value={salary}
        onChange={e => setSalary(e.target.value)}
      />

      <button onClick={saveEmployee}>
        {id !== null ? "Update" : "Add Employee"}
      </button>

      <h2>Employee List</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.salary}</td>
              <td>
                <button onClick={() => editEmployee(e)}>
                  Edit
                </button>
                <button onClick={() => deleteEmployee(e.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
