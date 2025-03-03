import axios from "axios";
import { serverAddress } from "@/constants/serverAddress.ts";

export const fetchSubordinates = async (userId: number) => {
  const users = await axios.get(
    `${serverAddress}/users/${userId}?subordinates=true`,
  );
  return users.data;
};
