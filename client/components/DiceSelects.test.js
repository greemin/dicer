import React from "react";
import { diceTypes, diceNumbers } from "./Dicer";
import DiceSelects from "./DiceSelects";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

test("changes number of dice via select", () => {
  render(
    <DiceSelects
      types={diceTypes}
      numbers={diceNumbers}
      onDiceResult={() => {}}
    />
  );
  const diceNumberSelect = screen.getByDisplayValue(diceNumbers[0].label);
  fireEvent.change(diceNumberSelect, { target: { value: 4 } });
  expect(screen.getByDisplayValue("4")).toBeInTheDocument();
});

test("changes type of dice via select", () => {
  render(
    <DiceSelects
      types={diceTypes}
      numbers={diceNumbers}
      onDiceResult={() => {}}
    />
  );
  const diceTypeSelect = screen.getByDisplayValue(diceTypes[0].label);
  fireEvent.change(diceTypeSelect, { target: { value: 20 } });
  expect(screen.getByDisplayValue("D20")).toBeInTheDocument();
});

test("changes modifier of dice result via number input", () => {
  render(
    <DiceSelects
      types={diceTypes}
      numbers={diceNumbers}
      onDiceResult={() => {}}
    />
  );

  const input = screen.getByRole("spinbutton");
  fireEvent.change(input, { target: { value: 123 } });
  expect(screen.getByDisplayValue(123)).toBeInTheDocument();

  fireEvent.change(input, { target: { value: "ABC" } });
  expect(screen.queryByDisplayValue("ABC") === null).toBeTruthy();
});

test("button is disabled when disableButtons prop is true", () => {
  render(
    <DiceSelects
      types={diceTypes}
      numbers={diceNumbers}
      disableButtons
      onDiceResult={() => {}}
    />
  );
  expect(screen.getByRole("button")).toBeDisabled();
});

test("buttons are enabled when disableButtons prop is not true", () => {
  render(
    <DiceSelects
      types={diceTypes}
      numbers={diceNumbers}
      onDiceResult={() => {}}
    />
  );
  expect(screen.getByRole("button")).not.toBeDisabled();
});

test("when prop userName is set onDiceResult is called with userName in result", () => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  const onDiceResultStub = jest.fn();
  render(
    <DiceSelects
      types={diceTypes}
      numbers={diceNumbers}
      userName="FooBar"
      onDiceResult={onDiceResultStub}
    />
  );

  fireEvent.click(screen.getByRole("button"));
  expect(onDiceResultStub).toHaveBeenCalledWith({
    rolls: [2],
    modifier: 0,
    sum: 2,
    userName: "FooBar",
  });
  jest.spyOn(global.Math, "random").mockRestore();
});

test("when prop userName is not set onDiceResult is called with no userName in result", () => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.5);
  const onDiceResultStub = jest.fn();
  render(
    <DiceSelects
      types={diceTypes}
      numbers={diceNumbers}
      onDiceResult={onDiceResultStub}
    />
  );

  fireEvent.click(screen.getByRole("button"));
  expect(onDiceResultStub).toHaveBeenCalledWith({
    rolls: [2],
    modifier: 0,
    sum: 2,
  });
  jest.spyOn(global.Math, "random").mockRestore();
});
