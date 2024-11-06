# C GUIDELINES
These C Guidelines (style guide) help the community focus on the code's intent and work together with a minimum of friction.

## PURPOSE
These C Guidelines help developers who are new to the community and want to contribute to the itsme-subid repos.

## PHILOSOPHY
A few philosophical guidelines can stand in place of a thousand narrow rules. These guidelines are not intended as absolute (black or white) truths but rather lenses to focus our vision when faced with subtle shades of ambiguity.

## SIMPLICITY
```SIMPLICITY 
Use and build only what is essential to a project.
```

Projects can quickly grow beyond their essence by taking on dependencies and features that are not central to their purpose. Keep the essential goal in mind as a project evolves. Take on only what is needed and only when the need arises.

## STABILITY
``` STABILITY 
Build for longevity and maturity.
```

It is easy to get swept away in the rushing waters of new projects, tools, and libraries. However, the sedimentary landscape left behind by the swift and meandering river of change can be unstable. It is certainly unwise to build one's home on a river delta.

Choose an existing framework and set of tools and use them to make what matters to you. Avoiding creating a bespoke framework when a current framework would get you further down the road.

When choosing tools and technologies, keep an eye towards mature projects and standards built to last many years. Find projects that extend existing standards and ways of working.

## FOCUS
```FOCUS
Choose the right level of abstraction and best use of time.
```

When developing, it is easy to find ourselves in layers of technology that are not directly contributing to our goals. For example, spending inordinate time with build tool configurations or type definitions instead of building features and getting user feedback. Choose tools that get out of the way and transparently support your work, creating what matters.

## MAINTAINABILITY
```MAINTAINABILITY 
Write clean and conventional code.
```

Code is read more often than it is written. Code is written for humans, not machines. As such, we can do ourselves a favor by making our code as reader-friendly as possible.

## CODE FORMATTING
We adopt existing code formatting standards. To this end, all code must be formatted using Prettier, an opinionated code formatter. We also use eslint to handle cases that Prettier may overlook.
