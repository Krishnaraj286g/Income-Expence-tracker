import React, { useEffect, useState } from 'react';
import axios from "axios";

export default function Expense() {
  // const url = "https://67fe04e03da09811b1774265.mockapi.io/krishnaraj/reactnew1";

  const url = "http://localhost:1120";
  const [username, setUsername] = useState("");
  const [useramount, setUseramount] = useState("");
  const [usertype, setUserType] = useState("Income");
  const [data, setData] = useState([]);
  const [_id, set_id] = useState(0);

  useEffect(() => {
    fetchData();
    const saved_id = sessionStorage.getItem("_id");
    if (saved_id) {
      set_id(saved_id);
      setUsername(sessionStorage.getItem("name") || "");
      setUseramount(sessionStorage.getItem("amount") || "");
      setUserType(sessionStorage.getItem("Type") || "Income");
    }
  }, []);

  function fetchData() {
    axios.get(url)
      .then((res) => setData(res.data.msg))
      .catch((err) => console.log(err));
  }

  function clearForm() {
    setUsername("");
    setUseramount("");
    setUserType("Income");
    set_id(0);
    sessionStorage.clear();
  }

  function save(e) {
    e.preventDefault();

    if (!username.trim() || isNaN(useramount) || Number(useramount) <= 0) {
      alert("Please enter a val_id name and a positive amount.");
      return;
    }

    const payload = {
      username,
      useramount: Number(useramount),
      usertype,
    };

    if (_id && _id !== 0) {
      axios.put(`${url}/${_id}`, payload)
        .then(() => {
          alert("Data Updated");
          clearForm();
          fetchData();
        })
        .catch((err) => console.log(err));
    } else {
      axios.post(url, payload)
        .then(() => {
          alert("Data Saved");
          clearForm();
          fetchData();
        })
        .catch((err) => console.log(err));
    }
  }

  let income = 0;
  let expense = 0;

  data.forEach((item) => {
    const amount = parseFloat(item.useramount);
    if (!isNaN(amount)) {
      if (item.usertype === "Income") income += amount;
      else if (item.usertype === "Expense") expense += amount;
    }
  });

  const balance = income - expense;

  function remove(_id) {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      axios.delete(`${url}/${_id}`)
        .then(() => {
          alert("Data Deleted");
          fetchData();
        })
        .catch((err) => console.log(err));
    }
  }

  function update(item) {
    sessionStorage.setItem("_id", item._id);
    sessionStorage.setItem("name", item.username);
    sessionStorage.setItem("amount", item.useramount);
    sessionStorage.setItem("Type", item.usertype);
    set_id(item._id);
    setUsername(item.username);
    setUseramount(item.useramount);
    setUserType(item.usertype);
  }

  function resetAll() {
    if (window.confirm("This will delete all data. Continue?")) {
      Promise.all(data.map((item) => axios.delete(`${url}/${item._id}`)))
        .then(() => {
          alert("All data has been reset.");
          clearForm();
          fetchData();
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <div id='cont1'>
      <div id='cont2'>
        <h2>Income / Expense Tracker</h2>
        <h3><marquee>Using REACT</marquee></h3>

        <div id='bal1'>
          <h2>
            Balance: <span style={{ color: balance > 0 ? "green" : balance < 0 ? "red" : "white" }}>₹{balance}</span>
          </h2>
          <div id='Totinex'>
            <div id='Totin'>
              <p>Total Income:</p>
              <p>₹{income}</p>
            </div>
            <div id='TotEx'>
              <p>Total Expense:</p>
              <p>₹{expense}</p>
            </div>
          </div>
        </div>

        <div id='ExpAdd'>
          <div id='AddForm'>
            <form onSubmit={save}>
              <div id='input-title'>
                <h3>{_id && _id !== 0 ? "Edit Entry" : "Add New"}</h3>
                <button type="button" onClick={resetAll}>Reset All</button>
              </div>

              <div>
                <label htmlFor="entryType">Entry type:</label>
                <select id="entryType" value={usertype} onChange={(e) => setUserType(e.target.value)}>
                  <option>Income</option>
                  <option>Expense</option>
                </select>
              </div>

              <div>
                <label htmlFor="username">Type Name:</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="useramount">Amount:</label>
                <input
                  id="useramount"
                  type="number"
                  value={useramount}
                  onChange={(e) => setUseramount(e.target.value)}
                  required
                  min="1"
                />
              </div>

              <button className='add-update' type='submit'>
                {_id && _id !== 0 ? "Update" : "Add"} Entry
              </button>
            </form>
          </div>

          
            {data.length > 0 ? (
              <div id='tableEx'>
              <table>
                
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Delete</th>
                    <th>Edit</th>
                  </tr>
                  </thead>
                
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.username}</td>
                      <td>{item.useramount}</td>
                      <td style={{ color: item.usertype === "Income" ? "green" : "red" }}>
                        {item.usertype}
                      </td>
                      <td>
                        <button className='delete' onClick={() => remove(item._id)}><i class="fa-solid fa-trash"></i></button>
                      </td>
                      <td>
                        <button className='Edit' onClick={() => update(item)}><i class="fa-solid fa-pen-to-square"></i></button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                
              </table>
              </div>

            ) : (
              ''
            )}
          
        </div>
      </div>
    </div>
  );
}





