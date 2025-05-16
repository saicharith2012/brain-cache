import { useRef } from "react";
import { Button } from "../components/Button";
import InputComponent from "../components/InputComponent";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  async function signin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    // console.log(username, password);

    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
      username,
      password,
    });
    
    localStorage.setItem("token", response.data.token);
    navigate("/dashboard");
  }
  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-sm min-w-48 flex flex-col p-8">
        <InputComponent ref={usernameRef} placeholder="Username" />
        <InputComponent ref={passwordRef} placeholder="Password" />
        <div className="mt-4">
          <Button
            variant="primary"
            text="Sign in"
            size="md"
            fullWidth={true}
            loading={false}
            onClick={signin}
          />
        </div>
      </div>
    </div>
  );
}
