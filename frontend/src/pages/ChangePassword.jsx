import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/changepassword.css";

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token || null;
  const [formdata, setFormdata] = React.useState({});
  const [error, setError] = React.useState(false);

  // check if token exists
  React.useEffect(() => {
    if (!token) {
      navigate("/");
    }
    const checkTokenExists = async () => {
      try {
        const res = await fetch(`/api/auth/verifyToken`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        });
        const result = await res.json();
        if (result.success === false) {
          navigate("/");
          return;
        }
        return;
      } catch (err) {
        setError(err.message);
      }
    };
    checkTokenExists();
  }, []);

  const handleChange = (e) => {
    setFormdata((prevFormdata) => {
      return {
        ...prevFormdata,
        [e.target.id]: e.target.value,
      };
    });
  };
  console.log(formdata);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formdata.password !== formdata.confirmPassword) {
      setError("Passwords donot match.");
      console.log("Not match");
      return;
    }
    try {
      const res = await fetch(`/api/auth/updatepw`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...formdata,
          token,
        }),
      });
      const result = await res.json();
      if (result.success === false) {
        setError(result.message);
        return;
      }

      // change token in db
      alert("Password changed successfully.");
      navigate("/signin");
    } catch (err) {
      setError(err.message);
      return;
    }
  };

  return (
    <div className="change-password-container">
      <form className="change-password-form" onSubmit={handleSubmit}>
        <h2 className="change-password-title">Change Password</h2>
        <div className="password-field">
          <label htmlFor="password" className="password-label">
            New Password
          </label>
          <input
            type="password"
            required
            id="password"
            className="password-input"
            onChange={handleChange}
            placeholder="Enter your new password"
          />
        </div>
        <div className="password-field">
          <label htmlFor="confirmPassword" className="password-label">
            Re-Enter Password
          </label>
          <input
            type="password"
            required
            id="confirmPassword"
            className="password-input"
            onChange={handleChange}
            placeholder="Re-enter your new password"
          />
        </div>
        <button type="submit" className="change-password-button">
          Change Password
        </button>
        {error && <div style={{ color: "red" }}>This is {error}</div>}
      </form>
    </div>
  );
}
