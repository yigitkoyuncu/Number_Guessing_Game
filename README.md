# Number Guessing Game 🎯

A Python number guessing game where you can guess the computer’s secret number or let the computer guess yours.

## Game Modes

### Mode 1 — You Guess
Try to find the computer’s secret four-digit number using feedback after each guess.

### Mode 2 — Computer Guesses
Choose a secret four-digit number and provide feedback on the computer’s guesses. The computer eliminates possible answers using your clues.

## Feedback

Each guess receives two numbers:

- **Correct position:** Digits that match both the value and position.
- **Wrong position:** Digits that appear in the secret number but are in a different position.

For example, if the secret is `1234` and the guess is `1249`, the feedback is `2 1`.

## Number Patterns

The game supports four number patterns:

| Pattern | Rule | Example |
|---------|------|---------|
| 1 | All four digits are identical | `1111` |
| 2 | Three identical digits, or two pairs | `1112`, `1122` |
| 3 | One pair and two other distinct digits | `1123` |
| 4 | All digits are different | `1234` |

Numbers must contain exactly four digits and cannot start with zero.

## Features

- Player and computer guessing
- Feedback based on digit values and positions
- Four number patterns
- Input validation
- Detection of contradictory clues in computer guessing
- Replay option

## Run the Game

Download the `.exe` file and double-click it to start playing on Windows. No Python installation is required.

## Testing

The project includes automated tests using Python’s built-in `unittest` module. I also manually tested the game, identified issues, and fixed them throughout development.

## Development

Developed with vibe coding.
