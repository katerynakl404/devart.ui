Page navigation for a table or a list.

Put it directly under the table, outside the table's own frame, with `mt-4` and
the page-size selector on the left, page controls on the right.

Pagination is why a table needs `layout="fixed"`: each page has different
content widths, so an auto-layout table re-measures every column on every page
change and the whole grid shifts under the user.

Always show the current range and the total ("1–25 of 342") — a bare page number
tells the user nothing about how much is left. When the total is unknown, show
the range alone rather than inventing a page count.
