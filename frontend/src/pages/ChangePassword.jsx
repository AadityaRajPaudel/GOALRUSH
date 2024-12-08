import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state?.token || null;
  const [formdata, setFormdata] = React.useState({});
  const [error, setError] = React.useState(false);

  // check if token exists in the database
  React.useEffect(() => {
    if (!token) {
      navigate("/");
    }
    const checkTokenExists = async () => {
      try {
        const res = await fetch(`/api/auth/verifyToken`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        });
        const result = await res.json();
        console.log("Hi" + token);
        if (result.success === false) {
          navigate("/");
          return;
        }
        return;
      } catch (err) {
        setError(err);
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

  const handleSubmit = async () => {
    if (formdata.password !== formdata.confirmPassword) {
      setError("Passwords donot match.");
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

      // aba token change handini db ma
      alert("Password changed successfully.");
      navigate("/signin");
    } catch (err) {
      setError(err);
      return;
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="password">New Password</label>
        <input type="password" required id="password" onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="confirmPassword">Re-Enter Password</label>
        <input
          type="password"
          required
          id="confirmPassword"
          onChange={handleChange}
        />
      </div>
      <button onClick={handleSubmit}>Change Password</button>
      <div>{token} token</div>
    </div>
  );
}
