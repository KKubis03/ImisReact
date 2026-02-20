import { Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
interface NavbarItemProps {
  to: string;
  label: string;
}
export default function NavbarItem({ to, label }: NavbarItemProps) {
  return (
    <RouterLink to={to} style={{ textDecoration: "none" }}>
      <Typography color="inherit">{label}</Typography>
    </RouterLink>
  );
}
