import { LoginForm } from "@/components/LoginPage/LoginForm.tsx";
import { Container } from "@/components/Container.tsx";

function LoginPage() {
  return (
    <div>
      <Container className="flex flex-1 flex-col items-center justify-center min-h-full">
        <LoginForm className="flex flex-col gap-4 bg-stone-700 p-12 shadow-2xl rounded-xl md:w-1/2 mt-48" />
      </Container>
    </div>
  );
}

export default LoginPage;
