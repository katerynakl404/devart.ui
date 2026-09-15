import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge';
import { Button } from '../Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardDivider,
  CardFooter,
  CardHeader,
  CardIcon,
  CardSectionLabel,
  CardTitle,
} from './index';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    variant: 'outline',
    rounded: 'lg',
    fullWidth: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outline', 'secondary', 'row', 'elevated', 'ghost'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
    },
    children: { control: false },
    ref: { control: false, table: { disable: true } },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Usage this month</CardTitle>
        <CardDescription>Resets on the 1st of each month.</CardDescription>
      </CardHeader>
      <CardContent>
        You have used 640 of 1,000 messages included in your plan.
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="secondary" size="sm">
          View details
        </Button>
        <Button size="sm">Upgrade</Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-4">
      <Card {...args} variant="outline" className="w-72">
        <CardHeader>
          <CardTitle>Outline</CardTitle>
          <CardDescription>
            Bordered surface with a subtle shadow.
          </CardDescription>
        </CardHeader>
        <CardContent>Default variant, best for standalone content.</CardContent>
      </Card>
      <Card {...args} variant="secondary" className="w-72">
        <CardHeader>
          <CardTitle>Secondary</CardTitle>
          <CardDescription>Filled surface with hover feedback.</CardDescription>
        </CardHeader>
        <CardContent>Best for interactive list rows and tiles.</CardContent>
      </Card>
      <Card {...args} className="w-72" variant="elevated">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
          <CardDescription>
            Lifts on hover — shadow, brand-tinted border, -2px translate.
          </CardDescription>
        </CardHeader>
        <CardContent>The provider / connector tile surface.</CardContent>
      </Card>
      <Card {...args} className="w-72" variant="row">
        <CardContent>Row — compact single-line list item.</CardContent>
      </Card>
      <Card {...args} className="h-32 w-72" variant="ghost">
        <CardContent>
          Ghost — dashed &ldquo;browse more&rdquo; tile.
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * The full sub-part set the reference documents, in the shape of the provider
 * card: icon wrapper, title + description, divider, section label, footer CTA.
 */
export const Anatomy: Story = {
  render: (args) => (
    <Card {...args} className="w-64 gap-3" rounded="xl" variant="elevated">
      <CardHeader layout="horizontal" leftSlot={<CardIcon>JS</CardIcon>}>
        <CardTitle>Jira Software</CardTitle>
        <CardDescription className="text-xs">Not connected</CardDescription>
      </CardHeader>
      <CardDivider />
      <CardContent className="flex flex-col gap-2">
        <CardSectionLabel>Available metrics</CardSectionLabel>
        <div className="flex flex-wrap gap-1.5">
          <Badge rounded="md" size="sm" variant="secondary">
            Issues created
          </Badge>
          <Badge rounded="md" size="sm" variant="secondary">
            Bug count
          </Badge>
        </div>
      </CardContent>
      <CardFooter variant="actions">
        <Button size="sm">Connect</Button>
      </CardFooter>
    </Card>
  ),
};

export const Rounded: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-4">
      {(['none', 'sm', 'md', 'lg', 'xl'] as const).map((rounded) => (
        <Card {...args} key={rounded} rounded={rounded} className="w-40">
          <CardHeader>
            <CardTitle>{rounded}</CardTitle>
          </CardHeader>
          <CardContent>Corner rounding: {rounded}.</CardContent>
        </Card>
      ))}
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  parameters: { layout: 'padded' },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Full-width card</CardTitle>
        <CardDescription>Stretches to fill its container.</CardDescription>
      </CardHeader>
      <CardContent>
        Useful inside page sections and settings panels.
      </CardContent>
    </Card>
  ),
};

/**
 * Dark theme. Every token is plain CSS cascade, so a scoped `.dark` re-themes
 * the subtree — no provider, no props, no JS.
 */
export const DarkTheme: Story = {
  ...Default,
  decorators: [
    (Story) => (
      <div className="dark rounded-lg bg-surface-page p-6">
        <Story />
      </div>
    ),
  ],
};
