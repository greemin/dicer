import React from "react";
import Dicer, { diceTypes, diceNumbers } from "./Dicer";
import {
  act,
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
//import renderer from 'react-test-renderer';

// Comment out for v1.0
//test('renders without crashing', () => {
//  const root = renderer.create(<Dicer />).toJSON();
//
//  expect(root).toMatchSnapshot();
//});

test("displays the title of the app", () => {
  render(<Dicer />);
  const title = screen.getByRole("heading", { name: "Dicer" });
  expect(title).toBeInTheDocument();
  const subtitle = screen.getByRole("heading", {
    name: "A lightweight tool for all your dicing needs",
  });
  expect(subtitle).toBeInTheDocument();
});

test("displays dice roll result on 'Roll!'-button click", () => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  render(<Dicer />);

  const button = screen.getByText("Roll!");
  fireEvent.click(button);

  expect(screen.getByText(/rolls: 2/i)).toBeInTheDocument();
  expect(screen.getByText(/modifier: 0/i)).toBeInTheDocument();
  expect(screen.getByText(/Anon just rolled a 2/)).toBeInTheDocument();

  jest.spyOn(global.Math, "random").mockRestore();
});

test("displays dice roll result from multiple dice rolls", () => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  render(<Dicer />);

  const diceNumberSelect = screen.getByDisplayValue(diceNumbers[0].label);
  fireEvent.change(diceNumberSelect, { target: { value: 2 } });
  const diceTypeSelect = screen.getByDisplayValue(diceTypes[0].label);
  fireEvent.change(diceTypeSelect, { target: { value: 20 } });
  const modifierInput = screen.getByRole("spinbutton");
  fireEvent.change(modifierInput, { target: { value: -1 } });

  const button = screen.getByText("Roll!");

  fireEvent.click(button);

  expect(screen.getByText(/rolls: 10 \+ 10/i)).toBeInTheDocument();
  expect(screen.getByText(/modifier: -1/i)).toBeInTheDocument();
  expect(screen.getByText(/Anon just rolled a 19/)).toBeInTheDocument();

  jest.spyOn(global.Math, "random").mockRestore();
});

test("display dice roll result after Grid-Button click", () => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  render(<Dicer />);

  const twoD100 = screen.getByRole("button", { name: "2D100" });

  fireEvent.click(twoD100);

  expect(screen.getByText(/rolls: 50 \+ 50/i)).toBeInTheDocument();
  expect(screen.getByText(/modifier: 0/i)).toBeInTheDocument();
  expect(screen.getByText(/Anon just rolled a 100/)).toBeInTheDocument();

  jest.spyOn(global.Math, "random").mockRestore();
});

test("displays api dice roll result on 'Roll!'-button click", async () => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  axios.post = jest.fn();
  axios.get = jest.fn();

  render(<Dicer url="/dice-results" />);
  const rollResult = { rolls: [2], modifier: 0, sum: 2, userName: "Anon" };

  const successFullPostPromise = Promise.resolve({
    data: rollResult,
  });
  axios.post.mockReturnValue(successFullPostPromise);

  const successFullGetPromise = Promise.resolve({
    data: [rollResult],
  });
  axios.get.mockReturnValue(successFullGetPromise);

  const button = screen.getByText("Roll!");

  fireEvent.click(button);

  await waitFor(() =>
    expect(axios.post).toBeCalledWith("/dice-results", rollResult)
  );
  await waitFor(() => expect(axios.get).toBeCalledWith("/dice-results"));
  await waitFor(() =>
    expect(screen.getByText(/rolls: 2/i)).toBeInTheDocument()
  );
  expect(screen.getByText(/modifier: 0/i)).toBeInTheDocument();
  expect(screen.getByText(/Anon just rolled a 2/)).toBeInTheDocument();

  jest.spyOn(global.Math, "random").mockRestore();
});

test("all roll buttons are disabled while post request is running", async () => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  axios.post = jest.fn();

  render(<Dicer url="/dice-results" />);
  const rollResult = { rolls: [2], modifier: 0, sum: 2 };

  const successFullPostPromise = Promise.resolve({
    data: rollResult,
  });
  axios.post.mockReturnValue(successFullPostPromise);

  const button = screen.getByText("Roll!");
  fireEvent.click(button);

  const buttons = screen.getAllByRole("button");
  buttons.forEach((button) => expect(button).toBeDisabled());
  waitFor(() => buttons.forEach((button) => expect(button).not.toBeDisabled()));
});

test("renders username input with default name 'Anon'", () => {
  render(<Dicer />);
  expect(screen.getByRole("textbox")).toHaveValue("Anon");
});

test("username input can be changed", () => {
  render(<Dicer />);
  const input = screen.getByRole("textbox");
  fireEvent.change(input, { target: { value: "FooBar" } });

  expect(input).toHaveValue("FooBar");
});
