Radix tabs for switching between sibling views of the same object.

```jsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="schema">Schema</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
</Tabs>
```

Use tabs when the views are peers and the user switches between them freely. For
a linear flow use `Stepper`; for filtering one list use `SegmentedControl`.

Keep labels to one or two words, and keep the set small enough not to scroll —
a tab strip that overflows is a navigation problem wearing tabs.

`TabsContent` mounts only the active panel by default, so state inside an
inactive tab is lost on switch. Lift anything that must survive.
