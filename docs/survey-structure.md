# Survey Definition Structure

## Overview

Usually a survey is described as a set of (ordered) questions. 

In this engine a survey is a hierarchical structure composed by 2 kind of elements:

- `SurveyItem`, can be a `SurveySingleItem` (one "question") or a `SurveyGroupItem` (one "group of questions)
- `SurveyItemComponent` hold by a `SurveySingleItem`, describes the question content (see Components)

## SurveyItem

Survey items tree describes the survey structure, determining how questions are presented (order) and logically grouped.

Two kind of `SurveyItem:`

- `SurveySingleItem`, is the logical unit of the survey (usually known as "question"). It can show text, and/or data collection components with more or less complex layouts.
- `SurveyGroupItem` represents a group of SurveyItem(s)

All kind of SurveyItem can react to the logical rules of the survey (see Survey Engine Logic). For example, a rule can show a single question (targeting a `SurveySingleItem`) or a group of questions (`SurveyGroupItem`).

The following example of a survey structure represents the hierarchy tree of survey items (the key of item in parenthesis).

```yaml:
SurveyGroupItem(intake):
    - SurveySingleItem(intake.Q1)
    - SurveySingleItem(intake.Q2)
    - SurveyGroupItem(intake.HS)
        - SurveySingleItem(intake.HS.Q3)
        - SurveySingleItem(intake.HS.Q4)
```

### Survey keys

All `SurveyItem` must have a key identifier, use to refer to it in the survey logic and to identify the response in the collected data after survey submission.

The keys of SurveyItem elements (`SurveySingleItem` and `SurveyGroupItem`) must follow some rules to ensure the survey engine to work correctly:

- A key is composed by a set of segments separated by a dot (.), the root item has only one segment (usually the survey name)
- Key segments are set of characters WITHOUT dot 
- The key of one SurveyItem must be prefixed by the key of it parents.
- All keys must be unique and uniquely identify one item 

A key with several segments separated by dots represents the path to this item from the root item. In other words, the key of each item must be the path (dot separated) to this item from the root item. Each dot represents the walk through the lower level. 

Examples:
 - A survey named weekly, with an item Q1:
   - The root item is is keyed 'weekly', 
   - the item is keyed 'weekly.Q1'
 - A survey named weekly with a group of question 'G1', this group containing two questions (SingleItem) Q1 and Q2:
   -  the root item's key is 'weekly'
   -  the group's key is 'weekly.G1'
   -  the item inside the groups have keys respectively 'weekly.G1.Q1', 'weekly.G1.Q2'

**General best practices**

- Key segments should be alphanumerical words, including underscores (obviously excluding dot '.' character)
- As meaningful as possible
- If a word separator is chosen (dash or underscore) it should be the same everywhere

**Best practices for InfluenzaNet**

Besides the previous naming rules, there are some naming conventions, inherited from historical platform of Influenzanet

- [should] Items are named with a 'Q' followed by a question identifier (in use Q[nn] and Qcov[nn])
- [must] Because the last segment is used a the key for data export, the last segment of each key must be unique in the survey. e.g. 'weekly.Q1' must be unique but also 'Q1' in the survey. You must not have another item with a key finishing by 'Q1', even if in another group.
- [must] Question keys are arbitrary but the common questions must have the assigned key in the survey standard definition 
- [should] question outside of the survey standard (e.g. country specific questions), should have a prefix to clearly identify them as non standard question (like a namespace), for example 

### Survey Item properties

A survey Item has common properties :

- key : string (as described )
- condition: *expression* describing the condition when the item is active/shown (see Expression below)
- follows: list of item keys the item must follow
## Survey Item Components

Components describe the content of a SurveySingleItem (e.g. a question). Any element (visual, input) is described by a component with a specific role. For example the label, the input widget or an option is a component. 

The components also follow a hierarchical structure, allowing a component to contain sub-components (by using a Group component).

Components can be :

- A display component, describing the visual parts of the question like texts (title, description, tooltip)
- A response component describing the data collection process (a question only have one response component, but this component can contains several sub-components)
- Group component containing a list of sub components (the first level component of a `SurveySingleItem` must be a Group component)

### Component Roles

The 'role' field determines the purpose of the component and how the survey engine will handle it.

Common roles:
- 'root' : the group component of a survey item, containing all the components of a Survey item.
- 'responseGroup' : the response group component. A Survey Item can only contains of responseGroup
- 'helpGroup' : group component containing a set of textual elements used to show
- 'text' : a component describing text to show (for example the label of the question)

Response dedicated roles (used in subcomponents of the component with the 'responseGroup' role):
- 'singleChoiceGroup'
- 'dropDownGroup'
- 'multipleChoiceGroup'
- 'dateInput'
- 'input'
- 'numberInput'
- 'sliderNumeric', 'sliderNumericRange', 'sliderCategorical'
- 'option' : component describing an option in a list of possible choices

### Components common fields

- `content`, `description` : the visual/textual contents as `Localized Content`
- `displayCondition`: *expression* describing a condition for displaying the component or not.
- `properties`: properties to describes constraints and parameters of a component (like min/max value)
- `disabled` : *expression* determining the condition when the component should be disabled

For group component only
- `order` : order of components (for Group component)

Most of fields are represented as structure called `Expression`. They can be evaluated to a value (boolean, string, value) at runtime allowing to define complex rules to dynamically determine a field value.

### Keys

Component can also have keys uniquely identifying the component in the SurveyItem.

Keys are mandatory for Response component. They are used to identify the component in the survey logic and the response provided after the survey submission.

## Expression

**Expression** are tree structures representing an operation to be evaluated at runtime that can produce a value. They provide dynamic property evaluation for the survey logic.

An **Expression** is a simple structure that can be either:
- A typed literal value (numerical, string)
- A call, with a `name` and a field `data` set of parameters with a list of `Expression`

In other words an expression is an abstract way to describe a function call, with arguments (each argument can be literal or an expression).

The survey engine implements a set of known operations, that can be used in the `name` field. Expressions are widely used in the survey system of Influenzanet to describe dynamic behavior. In the survey, expressions are evaluated by the survey engine running on the client part, but we also used expression on the server side to describes the study logic (sequence of surveys,... ).

## Survey Logic

TBD.

## Localized Content

Textual fields in the survey definition are provided as Localized Content.
A Localized Content is a set of contents associated with a language code. This structure handles the internationalization of the survey content. The survey engine will only show the contents associated with the current language code (this part is not implemented in the survey engine itself but by the UI components).

## Survey Context
TBD.
