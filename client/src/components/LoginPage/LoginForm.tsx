import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  loginFormSchema,
  TLoginFormSchema,
} from "@/components/LoginPage/form/schema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/LoginPage/Field.tsx";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

interface Props {
  className?: string;
}

export const LoginForm: React.FC<Props> = ({ className }) => {
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  const form = useForm<TLoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data: TLoginFormSchema) => {
    try {
      const response = await axios.post("http://localhost:3000/login", data);
      if (!response.data.success) {
        setError(response.data.message);
        return;
      }
      const token = response.data.token;
      Cookies.set("token", token);
      setError("");
      navigate("/");
    } catch (err) {
      if (err instanceof AxiosError && err.status === 404) {
        setError("Такого пользователя не существует");
      }
      if (err instanceof AxiosError && err.status === 401) {
        setError("Неверный пароль");
      }

      console.error(err);
    }
  };
  return (
    <FormProvider {...form}>
      <form
        className={cn("", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl font-semibold">Добро пожаловать!</h1>
        <Field
          name="login"
          label="Логин"
          placeholder="Введите логин"
          className="bg-stone-900 border-0"
        />
        <Field
          name="password"
          type="password"
          label="Пароль"
          placeholder="Введите пароль"
          className="bg-stone-900 border-0"
        />
        <Button
          loading={form.formState.isSubmitting}
          className="h-10 mt-2 transition duration-300 font-semibold hover:text-white hover:bg-accent"
          type="submit"
        >
          Войти
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </FormProvider>
  );
};
