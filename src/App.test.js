import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders accordion headings", () => {
  render(<App />);
  expect(screen.getByText(/JavaScript Basics/i)).toBeInTheDocument();
  expect(screen.getByText(/HTML Snippet/i)).toBeInTheDocument();
  expect(screen.getByText(/Terminal Commands/i)).toBeInTheDocument();
});
