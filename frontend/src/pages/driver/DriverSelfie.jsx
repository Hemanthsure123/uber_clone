import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { uploadSelfie } from "../../api/driver.api";

export default function DriverSelfie() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const submit = async () => {
    try {
      if (!file) {
        alert("Please capture or select a selfie");
        return;
      }

      // 1️⃣ Upload image to Cloudinary
      const cloudinaryRes = await uploadToCloudinary(file);

      if (!cloudinaryRes.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      // 2️⃣ Get onboarding token (issued during signup)
      const onboardingToken = localStorage.getItem("onboardingToken");

      if (!onboardingToken) {
        alert("Session expired. Please signup again.");
        navigate("/driver/signup");
        return;
      }

      // 3️⃣ Send selfie URL to backend (NO LOGIN)
      await uploadSelfie(onboardingToken, cloudinaryRes.secure_url);

      // 4️⃣ Redirect to OTP verification
      navigate("/driver/verify-otp");

    } catch (err) {
      alert(err.response?.data?.error || err.message || "Selfie upload failed");
    }
  };

  return (
    <>
      <h2>Capture Selfie</h2>

      <input
        type="file"
        accept="image/*"
        capture="user"
        onChange={e => setFile(e.target.files[0])}
      />

      <button onClick={submit}>Continue</button>
    </>
  );
}
