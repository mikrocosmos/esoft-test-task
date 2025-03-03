import axios from "axios";

export const fetchSubordinates = async (userId: number) => {
  const users = await axios.get(
    `http://localhost:3000/users/${userId}?subordinates=true`,
  );
  return users.data;
};
