// app/login/__tests__/LoginPage.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import LoginPage from "../page";

// Mock next/link so it doesn't need a real Next.js router context
vi.mock("next/link", () => ({
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

// Mock useAuth so we control login() without touching AuthContext/API calls
const mockLogin = vi.fn();
vi.mock("@/components/auth/AuthContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    mockLogin.mockReset();
  });

  it("renders email and password fields and a submit button", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("calls login with the entered email and password on submit", async () => {
    mockLogin.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText(/you@example.com/i), "tanya@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("tanya@example.com", "secret123");
    });
  });

  it("shows an error message when login fails", async () => {
    mockLogin.mockRejectedValue(new Error("Incorrect password"));
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText(/you@example.com/i), "tanya@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Incorrect password")).toBeInTheDocument();
  });

  it("disables the submit button while the login request is pending", async () => {
    let resolveLogin;
    mockLogin.mockReturnValue(new Promise((resolve) => (resolveLogin = resolve)));
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText(/you@example.com/i), "tanya@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();

    resolveLogin();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /sign in/i })).not.toBeDisabled();
    });
  });
});
