import { useRef } from "react";
import { Button } from "../components/Button";
import InputTextComponent from "../components/InputTextComponent";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signup() {
    const email = emailRef.current?.value;
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    // console.log(email, username, password);

    await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      email,
      username,
      password,
    });

    navigate("/signin");
  }
  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-sm min-w-48 flex flex-col p-8">
        <InputTextComponent ref={emailRef} placeholder="Email" />
        <InputTextComponent ref={usernameRef} placeholder="Username" />
        <InputTextComponent ref={passwordRef} placeholder="Enter Password" />
        <InputTextComponent placeholder="Confirm Password" />
        <div className="mt-4">
          <Button
            variant="primary"
            text="Sign up"
            size="md"
            fullWidth={true}
            loading={false}
            onClick={signup}
          />
        </div>
      </div>
    </div>
  );
}
