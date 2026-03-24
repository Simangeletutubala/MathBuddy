import { Difficulty, Operation, Question } from '../types';

export class MathService {
  static generateQuestion(difficulty: Difficulty, enabledOperations: Operation[] = [Operation.ADDITION, Operation.SUBTRACTION, Operation.MULTIPLICATION]): Question {
    const operations = enabledOperations.length > 0 ? enabledOperations : [Operation.ADDITION];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let maxNum = 100; // Grade 4 starts with larger numbers
    if (difficulty === Difficulty.MEDIUM) maxNum = 1000;
    if (difficulty === Difficulty.HARD) maxNum = 10000;

    let num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * maxNum) + 1;

    let answer = 0;
    let text = '';
    let explanation: string[] = [];

    // Adjust for specific operations
    if (operation === Operation.MULTIPLICATION) {
      if (difficulty === Difficulty.EASY) {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
      } else if (difficulty === Difficulty.MEDIUM) {
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
      } else {
        num1 = Math.floor(Math.random() * 90) + 10;
        num2 = Math.floor(Math.random() * 90) + 10;
      }
    }

    if (operation === Operation.DIVISION) {
      if (difficulty === Difficulty.EASY) {
        num2 = Math.floor(Math.random() * 9) + 2;
        answer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * answer;
      } else if (difficulty === Difficulty.MEDIUM) {
        num2 = Math.floor(Math.random() * 9) + 2;
        answer = Math.floor(Math.random() * 20) + 1;
        num1 = num2 * answer;
      } else {
        num2 = Math.floor(Math.random() * 9) + 2;
        answer = Math.floor(Math.random() * 100) + 10;
        num1 = num2 * answer;
      }
    }

    // Ensure subtraction doesn't result in negative numbers for kids
    if (operation === Operation.SUBTRACTION && num1 < num2) {
      [num1, num2] = [num2, num1];
    }

    const isRealLife = Math.random() > 0.5;
    const categories: ('money' | 'time' | 'sharing' | 'general')[] = ['money', 'time', 'sharing'];
    const category = isRealLife ? categories[Math.floor(Math.random() * categories.length)] : 'general';

    switch (operation) {
      case Operation.ADDITION:
        answer = num1 + num2;
        if (isRealLife && category === 'money') {
          text = `You have $${num1} and your friend gives you $${num2}. How much money do you have now?`;
        } else if (isRealLife && category === 'time') {
          text = `You played for ${num1} minutes and then read for ${num2} minutes. How many minutes did you spend in total?`;
        } else {
          text = `What is ${num1} + ${num2}?`;
        }
        explanation = [
          `Start with ${num1}.`,
          `Add ${num2} more.`,
          `You can break it down: ${num1} + ${num2}.`,
          `The total is ${answer}!`
        ];
        break;
      case Operation.SUBTRACTION:
        answer = num1 - num2;
        if (isRealLife && category === 'sharing') {
          text = `You had ${num1} cookies and gave ${num2} to your sister. How many cookies do you have left?`;
        } else if (isRealLife && category === 'money') {
          text = `You had $${num1} and spent $${num2} on a toy. How much money is left?`;
        } else {
          text = `What is ${num1} - ${num2}?`;
        }
        explanation = [
          `Start with ${num1}.`,
          `Take away ${num2}.`,
          `You can use a number line or column subtraction.`,
          `You are left with ${answer}!`
        ];
        break;
      case Operation.MULTIPLICATION:
        answer = num1 * num2;
        if (isRealLife && category === 'sharing') {
          text = `There are ${num1} boxes, and each box has ${num2} apples. How many apples are there in total?`;
        } else {
          text = `What is ${num1} × ${num2}?`;
        }
        explanation = [
          `This is like adding ${num2} to itself ${num1} times.`,
          `You can use doubling or breaking down numbers.`,
          `The total is ${answer}!`
        ];
        break;
      case Operation.DIVISION:
        answer = num1 / num2;
        if (isRealLife && category === 'sharing') {
          text = `You have ${num1} sweets to share equally among ${num2} friends. How many sweets does each friend get?`;
        } else {
          text = `What is ${num1} ÷ ${num2}?`;
        }
        explanation = [
          `How many times does ${num2} go into ${num1}?`,
          `You can use multiplication as the inverse: ${num2} × ? = ${num1}.`,
          `The answer is ${answer}!`
        ];
        break;
      case Operation.ROUNDING:
        const roundTo = [10, 100, 1000][Math.floor(Math.random() * (difficulty === Difficulty.EASY ? 1 : difficulty === Difficulty.MEDIUM ? 2 : 3))];
        answer = Math.round(num1 / roundTo) * roundTo;
        text = `Round off ${num1} to the nearest ${roundTo}.`;
        explanation = [
          `Look at the digit to the right of the ${roundTo}s place.`,
          `If it's 5 or more, round up.`,
          `If it's less than 5, round down.`,
          `${num1} rounded to the nearest ${roundTo} is ${answer}.`
        ];
        break;
      case Operation.PLACE_VALUE:
        const places = ['units', 'tens', 'hundreds', 'thousands'];
        const placeIdx = Math.floor(Math.random() * (num1 > 999 ? 4 : num1 > 99 ? 3 : 2));
        const place = places[placeIdx];
        const numStr = num1.toString().padStart(4, '0');
        answer = parseInt(numStr[3 - placeIdx]);
        text = `What is the value of the ${place} digit in the number ${num1}?`;
        explanation = [
          `In ${num1}, the digits from right to left are:`,
          `Units, Tens, Hundreds, Thousands.`,
          `The ${place} digit is ${answer}.`
        ];
        break;
      case Operation.FRACTIONS:
        const denoms = [2, 3, 4, 5, 6, 8];
        const denom = denoms[Math.floor(Math.random() * denoms.length)];
        const numer = Math.floor(Math.random() * (denom - 1)) + 1;
        text = `Which is larger: ${numer}/${denom} or 1/2? (Type 1 for ${numer}/${denom}, 2 for 1/2, 0 for equal)`;
        const val = numer / denom;
        answer = val > 0.5 ? 1 : val < 0.5 ? 2 : 0;
        explanation = [
          `${numer}/${denom} is ${val.toFixed(2)}.`,
          `1/2 is 0.50.`,
          `Compare the two values to find the larger one.`
        ];
        break;
      case Operation.NUMBER_SENTENCES:
        const unknown = Math.floor(Math.random() * 20) + 1;
        const other = Math.floor(Math.random() * 20) + 1;
        const total = unknown + other;
        text = `Solve for □: □ + ${other} = ${total}`;
        answer = unknown;
        explanation = [
          `To find the unknown number, use subtraction.`,
          `${total} - ${other} = ${unknown}.`,
          `So, □ is ${unknown}.`
        ];
        break;
      case Operation.PATTERNS:
        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 5) + 1;
        const seq = [start, start + step, start + step * 2, start + step * 3];
        text = `What is the next number in the pattern: ${seq.join(', ')}, ...?`;
        answer = start + step * 4;
        explanation = [
          `Look at the difference between the numbers.`,
          `${seq[1]} - ${seq[0]} = ${step}.`,
          `The pattern is adding ${step} each time.`,
          `${seq[3]} + ${step} = ${answer}.`
        ];
        break;
      case Operation.SHAPES_2D:
        const shapes2d = [
          { name: 'Triangle', sides: 3 },
          { name: 'Square', sides: 4 },
          { name: 'Pentagon', sides: 5 },
          { name: 'Hexagon', sides: 6 }
        ];
        const shape2d = shapes2d[Math.floor(Math.random() * shapes2d.length)];
        text = `How many sides does a ${shape2d.name} have?`;
        answer = shape2d.sides;
        explanation = [
          `A ${shape2d.name} is a polygon.`,
          `It has ${shape2d.sides} straight sides.`
        ];
        break;
      case Operation.OBJECTS_3D:
        const objects3d = [
          { name: 'Cube', faces: 6 },
          { name: 'Cylinder', faces: 3 },
          { name: 'Sphere', faces: 1 },
          { name: 'Pyramid', faces: 5 }
        ];
        const obj3d = objects3d[Math.floor(Math.random() * objects3d.length)];
        text = `How many faces does a ${obj3d.name} have?`;
        answer = obj3d.faces;
        explanation = [
          `A ${obj3d.name} is a 3D object.`,
          `It has ${obj3d.faces} faces in total.`
        ];
        break;
      case Operation.DATA_HANDLING:
        const data = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
        text = `In a survey, 3 kids liked Apples, ${data[1]} liked Bananas, and ${data[2]} liked Grapes. How many kids were surveyed in total?`;
        answer = 3 + data[1] + data[2];
        explanation = [
          `Add all the groups together.`,
          `3 + ${data[1]} + ${data[2]} = ${answer}.`
        ];
        break;
      case Operation.MEASUREMENT:
        const units = [
          { from: 'kg', to: 'g', factor: 1000 },
          { from: 'm', to: 'cm', factor: 100 },
          { from: 'litres', to: 'ml', factor: 1000 }
        ];
        const unit = units[Math.floor(Math.random() * units.length)];
        const val_m = Math.floor(Math.random() * 5) + 1;
        text = `How many ${unit.to} are in ${val_m} ${unit.from}?`;
        answer = val_m * unit.factor;
        explanation = [
          `1 ${unit.from} = ${unit.factor} ${unit.to}.`,
          `${val_m} × ${unit.factor} = ${answer}.`
        ];
        break;
      case Operation.TIME:
        const hours = Math.floor(Math.random() * 12) + 1;
        text = `If it is ${hours}:00 now, what time will it be in 3 hours? (Use 12-hour format)`;
        answer = ((hours + 2) % 12) + 1;
        explanation = [
          `Add 3 hours to the current time.`,
          `${hours} + 3 = ${hours + 3}.`,
          `In 12-hour format, that is ${answer}:00.`
        ];
        break;
      case Operation.PERIMETER_AREA:
        const side = Math.floor(Math.random() * 10) + 1;
        const isPerimeter = Math.random() > 0.5;
        if (isPerimeter) {
          text = `What is the perimeter of a square with side length ${side} units?`;
          answer = side * 4;
          explanation = [
            `Perimeter is the distance around the shape.`,
            `For a square, it is side × 4.`,
            `${side} × 4 = ${answer}.`
          ];
        } else {
          text = `What is the area of a square with side length ${side} units?`;
          answer = side * side;
          explanation = [
            `Area is the space inside the shape.`,
            `For a square, it is side × side.`,
            `${side} × ${side} = ${answer}.`
          ];
        }
        break;
      case Operation.PROBABILITY:
        text = `If you toss a fair coin, how many possible outcomes are there?`;
        answer = 2;
        explanation = [
          `A coin has two sides: Heads and Tails.`,
          `So there are 2 possible outcomes.`
        ];
        break;
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      text,
      num1,
      num2,
      operation,
      answer,
      explanation,
      isRealLife,
      category
    };
  }
}
