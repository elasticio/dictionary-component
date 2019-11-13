# Dictionary Component
## Table of Contents
* [General information](#general-information)
* [Credentials](#credentials)
* [Triggers](#triggers)
* [Actions](#actions)
   * [Action Name](#action-name)
     * [Action Name. Config fields](#action-name-config-fields)
* [Additional info](#additional-info)
* [Known Limitations](#known-limitations)

## General Information
The Dictionary Component can be used to convert from different dictionaries that parsed as a CSV.

## Credentials
### CSV
The CSV is entered on the Credentials page as a list of separated items. Any delimiter is supported. The CSV will be parsed using the first row as a header for each column below it. The CSV must be able to be interpreted as a rectangle, i.e. it cannot be missing values.

For example,

```
English,Abbreviated,German
male,M,männlich
female,F,weiblich
other,O,divers
unknown,U,unbekannt
```

Will parse as

| English | Abbreviated | German    | 
|---------|-------------|-----------| 
| male    | M           | männlich  | 
| female  | F           | weiblich  | 
| other   | O           | divers    | 
| unknown | U           | unbekannt |

and

```
English,Abbreviated,German
male,M,männlich
,F,weiblich
other,,
unknown,U,unbekannt
```

Will parse correctly as

| English | Abbreviated | German    | 
|---------|-------------|-----------| 
| male    | M           | männlich  | 
|         | F           | weiblich  | 
| other   |             |           | 
| unknown | U           | unbekannt | 

(though this may not be useful), but

```
English,Abbreviated,German
male,M,männlich
F,weiblich
other
unknown,U,unbekannt
```
will provide a failed result.

The CSV can only be a maximum of 5kB, and if it contains any duplicate values in a given column, it will fail validation.

## Triggers

## Actions
### Lookup From Dictionary
The lookup from dictionary action takes a dictionary to lookup from, a dictionary to translate to, and an input value to translate. It returns an object in the form `{result: value}` where the value is the result of the table lookup, if it exists:

**Input Metadata**
- Emit empty object on unsuccessful lookup: if selected, an empty object `{}` will be emitted given an unsuccessful lookup where nothing is found. If *not* selected, an error will be thrown on unsuccessful lookup
- From this dictionary: the dictionary to translate from
- To this dictionary: the dictionary to translate to
- Input: the value to translate. Should be selected from the list of available values under `Values`

**Output Metadata**
- if lookup is successful, an object of the type `{result: value}` will be emitted
- if lookup is unsuccessful and emitting empty object, `{}` will be emitted
- if lookup is unsuccessful and not emitting an empty object, and error will be emitted

## Additional Info

## Known Limitations
- the CSV has a max size of 5kB
- the CSV must be able to be parsed as a rectangle
- the CSV must not contain any duplicates in column values