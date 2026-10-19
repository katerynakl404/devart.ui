A card-sized answer to a question — title, optional description, badge and
leading icon — and the chosen state: the Brand/Primary border over a 5% brand
wash.

```jsx
<ChoiceGroup aria-label="Your role" value={role} onValueChange={setRole} onPick={next}>
  <ChoiceCard value="sales" title="Sales" description="Pipeline and deals" />
  <ChoiceCard value="other" title="Other">
    <TextArea rows={2} aria-label="Your answer" />   {/* shown while chosen */}
  </ChoiceCard>
</ChoiceGroup>

<ChoiceGroup type="multiple" aria-label="Goals" value={goals} onValueChange={setGoals}>
  <ChoiceCard value="revenue" title="Track revenue" badge="Popular" />
</ChoiceGroup>
```

## The three shapes

| Where | It is | Mark (`indicator="auto"`) |
|---|---|---|
| `ChoiceGroup type="single"` | a `role="radio"` card in a radiogroup | none — the card shows the choice |
| `ChoiceGroup type="multiple"` | a label around a `Checkbox` | checkbox |
| no group | a toggle button (`aria-pressed`) — `selected` + `onSelect` | none |

`indicator="radio"` draws the RadioButton mark on request; `"checkbox"` on a
standalone card makes it a label around a Checkbox.

## Keyboard, and `onPick`

A single group is one tab stop (the chosen card, else the first enabled one).
The arrow keys move and choose, wrapping, skipping disabled cards; Enter and
Space choose. `onValueChange` reports every change. `onPick` reports only a
deliberate pick — click, Enter, Space — never an arrow key, so a one-answer
question can move on by itself without jumping as the reader arrows through.

## Layout

`columns={2}` sets the cards side by side from 640px up. A leading `icon` is a
36px disc that leads the row top-aligned; the row keeps its padding and the
mark stays on the title line. `children` turn the card into an expandable one:
the head is the button (`aria-expanded`) and the content opens inside the card.
