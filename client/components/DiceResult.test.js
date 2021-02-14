import React from "react";
import DiceResult from "./DiceResult";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { rest } from "msw";
import { setupServer } from "msw/node";
import axios from "axios";

const exampleResults = [
  { rolls: [3], modifier: -5, sum: 33 },
  { rolls: [11, 2], modifier: 0, sum: 13 },
];

const server = setupServer(
  rest.get("/dice-results", (req, res, ctx) => {
    return res(ctx.json(exampleResults));
  }),
  rest.delete("/dice-results", (req, res, ctx) => {
    return res(null);
  })
);

test("displays multiple dice roll results", () => {
  const diceResults = exampleResults;
  render(<DiceResult results={diceResults} />);

  expect(screen.getByText(/rolls: 3/i)).toBeInTheDocument();
  expect(screen.getByText(/modifier: -5/i)).toBeInTheDocument();
  expect(screen.getByText(/you just rolled a 33/i)).toBeInTheDocument();

  expect(screen.getByText(/rolls: 11 \+ 2/i)).toBeInTheDocument();
  expect(screen.getByText(/modifier: 0/i)).toBeInTheDocument();
  expect(screen.getByText(/you just rolled a 13/i)).toBeInTheDocument();
});

describe("API calls", () => {
  beforeEach(() => {
    server.listen();
    jest.useFakeTimers();
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("displays dice roll results after calling api", async () => {
    render(<DiceResult url="/dice-results" />);

    await waitFor(() => screen.getByText(/rolls: 3/i));

    expect(screen.getByText(/rolls: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/modifier: -5/i)).toBeInTheDocument();
    expect(screen.getByText(/you just rolled a 33/i)).toBeInTheDocument();

    expect(screen.getByText(/rolls: 11 \+ 2/i)).toBeInTheDocument();
    expect(screen.getByText(/modifier: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/you just rolled a 13/i)).toBeInTheDocument();
  });

  test("displays new dice results after new data from api", async () => {
    render(<DiceResult url="/dice-results" />);

    await waitFor(() => screen.getByText(/rolls: 3/i));

    expect(screen.getByText(/rolls: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/modifier: -5/i)).toBeInTheDocument();
    expect(screen.getByText(/you just rolled a 33/i)).toBeInTheDocument();

    const newDiceResult = { rolls: [9, 9], modifier: -9, sum: 9 };
    // new data
    server.use(
      rest.get("/dice-results", (req, res, ctx) => {
        return res(ctx.json([newDiceResult]));
      })
    );

    await waitFor(() => screen.getByText(/rolls: 9/i));
    expect(screen.getByText(/modifier: -9/i)).toBeInTheDocument();
    expect(screen.getByText(/you just rolled a 9/i)).toBeInTheDocument();
  });

  //test.only("displays error when backend not available", async () => {
  //  server.use(
  //    rest.get("/dice-results", (req, res, ctx) => {
  //      console.log("REST ERROR");
  //      return res(ctx.status(500));
  //    })
  //  );

  //  render(<DiceResult url="/dice-results" />);
  //  // return error

  //  await waitFor(() => screen.getByRole("alert"));
  //  expect(screen.getByRole("alert")).toHaveTextContent("Server unavailable");
  //});

  test("shows delete button after receiving api results", async () => {
    render(<DiceResult url="/dice-results" />);
    expect(screen.queryByRole("button")).toBe(null);

    await waitFor(() => screen.getByText(/rolls: 3/i));
    expect(screen.getByRole("button")).toHaveTextContent("Delete History");
  });

  test("makes an get request every second", async () => {
    const successGetPromise = Promise.resolve({ data: exampleResults });
    axios.get = jest.fn();
    axios.get.mockReturnValue(successGetPromise);

    render(<DiceResult url="/dice-results" />);

    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 1000);
    jest.advanceTimersByTime(1000);
    expect(axios.get).toHaveBeenCalledTimes(1);
    await act(() => successGetPromise);

    jest.advanceTimersByTime(1000);
    expect(axios.get).toHaveBeenCalledTimes(2);
    await act(() => successGetPromise);
  });

  test("click on delete button calls DELETE request und no api results are displayed", async () => {
    render(<DiceResult url="/dice-results" />);
    await waitFor(() => screen.getByRole("button"));
    expect(screen.getByText(/rolls: 3/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.queryAllByText(/rolls:/i).length).toBe(0);
    });
  });
});

test("displays userName in roll results when prop userName is set", () => {
  const diceResults = exampleResults;
  render(
    <DiceResult
      results={[{ rolls: [1], modifier: 0, sum: 1, userName: "FooBar" }]}
    />
  );

  expect(screen.getByText(/rolls: 1/i)).toBeInTheDocument();
  expect(screen.getByText(/modifier: 0/i)).toBeInTheDocument();
  expect(screen.getByText(/foobar just rolled a 1/i)).toBeInTheDocument();
});
