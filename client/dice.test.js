import { rollDice } from './dice';

describe('rollDice()', () => {
  test('1D6 or normal rollDice call returns an even number value between 1-6', () => {
    let diceResult = rollDice();

    expect(diceResult.rolls.length).toBe(1);
    expect(diceResult.rolls[0]).toBeGreaterThan(0);
    expect(diceResult.rolls[0]).toBeLessThan(7);
    expect(diceResult.rolls[0] % 1).toBe(0);

    expect(diceResult.sum).toBeGreaterThan(0);
    expect(diceResult.sum).toBeLessThan(7);
    expect(Math.abs(diceResult.sum) % 1).toBe(0);

    diceResult = rollDice(1, 6);

    expect(diceResult.rolls.length).toBe(1);
    expect(diceResult.rolls[0]).toBeGreaterThan(0);
    expect(diceResult.rolls[0]).toBeLessThan(7);
    expect(diceResult.rolls[0] % 1).toBe(0);

    expect(diceResult.sum).toBeGreaterThan(0);
    expect(diceResult.sum).toBeLessThan(7);
    expect(Math.abs(diceResult.sum) % 1).toBe(0);

    expect(diceResult.modifier).toBe(0);
  });

  test('3D20 + 10 should return 3 values between 1-20 and a sum of 13-70', () => {
    const diceResult = rollDice(3, 20, 10);

    expect(diceResult.rolls.length).toBe(3);
    expect(diceResult.rolls[0]).toBeGreaterThan(0);
    expect(diceResult.rolls[0]).toBeLessThan(21);
    expect(Math.abs(diceResult.rolls[0]) % 1).toBe(0);
    expect(diceResult.rolls[1]).toBeGreaterThan(0);
    expect(diceResult.rolls[1]).toBeLessThan(21);
    expect(Math.abs(diceResult.rolls[1]) % 1).toBe(0);
    expect(diceResult.rolls[2]).toBeGreaterThan(0);
    expect(diceResult.rolls[2]).toBeLessThan(21);
    expect(Math.abs(diceResult.rolls[2]) % 1).toBe(0);

    expect(diceResult.sum).toBeGreaterThan(12);
    expect(diceResult.sum).toBeLessThan(71);
    expect(Math.abs(diceResult.sum) % 1).toBe(0);

    expect(diceResult.modifier).toBe(10);
  });

  test('1D10 - 10 should return 1 value between 1-10 and a sum of -9-0', () => {
    const diceResult = rollDice(1, 10, -10);

    expect(diceResult.rolls.length).toBe(1);
    expect(diceResult.rolls[0]).toBeGreaterThan(0);
    expect(diceResult.rolls[0]).toBeLessThan(11);
    expect(Math.abs(diceResult.rolls[0]) % 1).toBe(0);

    expect(diceResult.sum).toBeGreaterThan(-10);
    expect(diceResult.sum).toBeLessThan(1);
    expect(Math.abs(diceResult.sum) % 1).toBe(0);

    expect(diceResult.modifier).toBe(-10);
  });
});

