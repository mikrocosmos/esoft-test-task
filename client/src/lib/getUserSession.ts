import axios from "axios";
import Cookies from "js-cookie";
import { Session } from "@/@types/prisma.ts";
import { serverAddress } from "@/constants/serverAddress.ts";

export async function getUserSession(): Promise<Session | null> {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    const response = await axios.get(`${serverAddress}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
}
