import React from "react";
import DiceGrid from "./DiceGrid";
import { diceTypes, diceNumbers } from "./Dicer";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
//import renderer from 'react-test-renderer';

//test('renders without crashing', () => {
//  const tree = renderer.create(<Dicer />).toJSON();
//
//  expect(tree).toMatchSnapshot();
//});

test("renders diceTypes*diceNumbers grid-buttons", () => {
  render(
    <DiceGrid types={diceTypes} numbers={diceNumbers} onDiceResult={() => {}} />
  );

  expect(screen.getAllByTestId("dicegrid-button").length).toBe(
    diceTypes.length * diceNumbers.length
  );
});

test("there are diceTypes number of rows with diceNumbers number of buttons each", () => {
  render(
    <DiceGrid types={diceTypes} numbers={diceNumbers} onDiceResult={() => {}} />
  );

  const rows = screen.getAllByTestId("dicegrid-row");
  expect(rows.length).toBe(diceTypes.length);
  rows.forEach((row) => {
    expect(row.children.length).toBe(diceNumbers.length);
  });
});

test("button label format is like '2D20'", () => {
  render(
    <DiceGrid types={diceTypes} numbers={diceNumbers} onDiceResult={() => {}} />
  );

  const buttonsWithCorrectLables = screen.getAllByRole("button", {
    name: /\dD\d{1,3}/,
  });
  expect(buttonsWithCorrectLables.length).toBe(
    diceTypes.length * diceNumbers.length
  );
});

test("button click results in call of onDiceResult with result of selected dice roll", () => {
  const diceResultCb = jest.fn();
  render(
    <DiceGrid
      types={diceTypes}
      numbers={diceNumbers}
      onDiceResult={diceResultCb}
    />
  );

  jest.spyOn(global.Math, "random").mockReturnValue(0.1);

  const twoD20 = screen.getByRole("button", { name: "2D20" });
  fireEvent.click(twoD20);

  expect(diceResultCb).toHaveBeenCalledWith({
    rolls: [2, 2],
    modifier: 0,
    sum: 4,
  });

  jest.spyOn(global.Math, "random").mockRestore();
});

test("button are disabled when disableButtons prop is true", () => {
  render(
    <DiceGrid
      types={diceTypes}
      numbers={diceNumbers}
      disableButtons
      onDiceResult={() => {}}
    />
  );

  screen
    .getAllByRole("button")
    .forEach((button) => expect(button).toBeDisabled());
});

test("button are enabled when disableButtons prop is not true", () => {
  render(
    <DiceGrid types={diceTypes} numbers={diceNumbers} onDiceResult={() => {}} />
  );

  screen
    .getAllByRole("button")
    .forEach((button) => expect(button).not.toBeDisabled());
});

test("when prop userName is set onDiceResult is called with userName in result", () => {
  jest.spyOn(global.Math, "random").mockReturnValue(0.1);
  const onDiceResultStub = jest.fn();

  render(
    <DiceGrid
      types={diceTypes}
      numbers={diceNumbers}
      userName="FooBar"
      onDiceResult={onDiceResultStub}
    />
  );

  const twoD20 = screen.getByRole("button", { name: "2D20" });
  fireEvent.click(twoD20);

  expect(onDiceResultStub).toHaveBeenCalledWith({
    rolls: [2, 2],
    modifier: 0,
    sum: 4,
    userName: "FooBar",
  });

  jest.spyOn(global.Math, "random").mockRestore();
});
