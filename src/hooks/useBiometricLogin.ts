import { useState, useCallback } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "../firebase/config";

export function useBiometricLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async () => {
    console.log("login started");
    setError(null);
    setLoading(true);

    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      console.log("Hardware:", hasHardware, "Enrolled:", isEnrolled);

      if (!hasHardware) {
        throw new Error("Устройство не поддерживает биометрию");
      }
      if (!isEnrolled) {
        throw new Error("Биометрия не настроена");
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Авторизация по биометрии",
        cancelLabel: "Отмена",
        fallbackLabel: "Использовать пароль",
      });

      if (!result.success) {
        throw new Error("Аутентификация биометрией не удалась");
      }

      const email = await SecureStore.getItemAsync("email");
      const password = await SecureStore.getItemAsync("password");

      if (!email || !password) {
        throw new Error("Данные для входа не найдены");
      }


      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    } catch (e: any) {
      console.error("Ошибка биометрии:", e.message);
      setError(e.message || "Не удалось выполнить вход");
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}
