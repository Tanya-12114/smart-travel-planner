// app/register/__tests__/RegisterPage.test.jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import RegisterPage from "../page";

vi.mock("next/link", () => ({
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

const mockRegister = vi.fn();
vi.mock("@/components/auth/AuthContext", () => ({
  useAuth: () => ({ register: mockRegister }),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    mockRegister.mockReset();
  });

  it("renders name, email, password and confirm-password fields", () => {
    render(<RegisterPage />);
    expect(screen.getByPlaceholderText(/tanya sharma/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/at least 6 characters/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("blocks submission and shows an error when passwords don't match, without calling register", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByPlaceholderText(/tanya sharma/i), "Tanya Sharma");
    await user.type(screen.getByPlaceholderText(/you@example.com/i), "tanya@example.com");
    await user.type(screen.getByPlaceholderText(/at least 6 characters/i), "secret123");
    await user.type(screen.getByPlaceholderText("••••••••"), "different456");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("calls register with name, email and password when passwords match", async () => {
    mockRegister.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByPlaceholderText(/tanya sharma/i), "Tanya Sharma");
    await user.type(screen.getByPlaceholderText(/you@example.com/i), "tanya@example.com");
    await user.type(screen.getByPlaceholderText(/at least 6 characters/i), "secret123");
    await user.type(screen.getByPlaceholderText("••••••••"), "secret123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith("Tanya Sharma", "tanya@example.com", "secret123");
    });
  });

  it("surfaces an error returned by the register call (e.g. duplicate email)", async () => {
    mockRegister.mockRejectedValue(new Error("An account with this email already exists"));
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByPlaceholderText(/tanya sharma/i), "Tanya Sharma");
    await user.type(screen.getByPlaceholderText(/you@example.com/i), "tanya@example.com");
    await user.type(screen.getByPlaceholderText(/at least 6 characters/i), "secret123");
    await user.type(screen.getByPlaceholderText("••••••••"), "secret123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
  });
});
