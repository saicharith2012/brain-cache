import { Button } from "../components/Button";
import InputComponent from "../components/InputComponent";

export default function Signin() {
  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-sm min-w-48 flex flex-col p-8">
        <InputComponent placeholder="Username"/>
        <InputComponent placeholder="Password"/>
        <div className="mt-4">
        <Button variant="primary" text="Sign in" size="md" fullWidth={true} loading={false}/>
        </div>
      </div>
    </div>
  );
}
