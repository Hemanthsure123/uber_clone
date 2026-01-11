import { useState } from "react";
import { verifyOtp } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function DriverOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    await verifyOtp({
      email: prompt("Enter email"),
      otp
    });

    alert("Under admin review. You will be notified.");
    navigate("/login");
  };

  return (
    <>
      <h2>Driver OTP Verification</h2>
      <input placeholder="OTP" onChange={e => setOtp(e.target.value)} />
      <button onClick={submit}>Verify</button>
    </>
  );
}
