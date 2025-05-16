import { useRef } from "react";
import { Button } from "../components/Button";
import InputComponent from "../components/InputComponent";
import axios from "axios";
import { BACKEND_URL } from "../config";

export default function Signin() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  async function signin() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    // console.log(username, password);

    await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
      username,
      password,
    });

    alert("Your are signed in.");
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
