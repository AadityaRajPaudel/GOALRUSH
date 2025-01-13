import React from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import "../styles/forgetpassword.css";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [isCodeSent, setIsCodeSent] = React.useState(false);
  const [recoveryCode, setRecoveryCode] = React.useState(null);
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const recoveryCodeRef = useRef(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (email === "") {
      setError("Enter your email");
      setLoading(false);
      return;
    }
    const recoveryCode = Math.floor(Math.random() * 9000 + 1000);
    // send email
    // then just check if code=recoverycode, if true navigate to reset pw
    try {
      const res = await fetch("/api/sendmail", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          recoveryCode,
        }),
      });
      if (res.success === false) {
        setError("Failed to send code. Please retry.");
        setLoading(false);
        return;
      }
      setIsCodeSent(true);
      setRecoveryCode(recoveryCode);
      setLoading(false);
      return;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      return;
    }
  };

  const submitRecoveryCode = async () => {
    if (recoveryCode == recoveryCodeRef.current.value) {
      // generate new recovery token from backend everytime and get it here
      const res = await fetch(`/api/auth/addtoken/${email}`, {
        method: "PUT",
      });
      const result = await res.json();
      const token = result.token;
      // send the email to the backend, generate complex random token in backend and save it to database, return that token and navigate to the route
      // check if user with that token exists, if not return invalid
      // reset token in every request
      navigate(`/changepassword`, { state: { token } });
      return;
    } else {
      setError("Recovery code is incorrect. Retry.");
      return;
    }
  };

  return (
    <div className="account-recovery-container">
      <form
        className="account-recovery-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="account-recovery-title">Recover Your Account</h2>
        <div className="email-field">
          <label htmlFor="email" className="email-label">
            Enter your account's email address
          </label>
          <input
            id="email"
            type="email"
            className="email-input"
            placeholder="you@example.com"
            onChange={handleEmailChange}
            required
          />
          <button type="button" onClick={sendCode} className="send-code-button">
            {loading ? "Sending Code..." : "Send Code"}
          </button>
        </div>
        {isCodeSent && (
          <div className="recovery-code-field">
            <label htmlFor="recoveryCode" className="recovery-code-label">
              Enter the code from your email:
            </label>
            <input
              type="number"
              id="recoveryCode"
              ref={recoveryCodeRef}
              className="recovery-code-input"
              required
            />
            <button
              type="button"
              onClick={submitRecoveryCode}
              className="recover-account-button"
            >
              Recover Account
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
