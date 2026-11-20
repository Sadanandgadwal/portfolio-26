import * as React from "react";
import { Button, type ButtonProps } from "./button";

type IconButtonProps = Omit<ButtonProps, "size"> & {
  /** Required: icon-only controls need an accessible name. */
  "aria-label": string;
  size?: "default" | "sm";
};

function IconButton({ size = "default", variant = "ghost", ...props }: IconButtonProps) {
  return <Button size={size === "sm" ? "icon-sm" : "icon"} variant={variant} {...props} />;
}

export { IconButton, type IconButtonProps };
