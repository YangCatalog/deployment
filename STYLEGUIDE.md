# Code Style Guide for the YANG Catalog Project

For matters which aren't mentioned in this file, refer to [PEP8](https://peps.python.org/pep-0008/).

## Line length

All lines should be kept under 120 characters in length.

## Strings
Use single quotes for strings. If a string contains a single quote, using double quotes is acceptable.

Use f-strings instead of `str.format()`, `%`-formatting, and string concatenation where applicable. For composing file paths, use `os.path.join()` instead of f-strings.

## Naming

Use `snake_case` for file, variable, attribute, function, and method names. Use `ALL_CAPS` for the names of constants. For class names, use `CamelCase`.

## Line breaks and indentation

Use 4 spaces for indenting standard code blocks.

### Function signatures and calls

When the arguments for a function signature or a function call do not fit on a single line, pass each argument on it's own line:

```python
def function(
    first_argument: str,
    second_argument: str,
    third_argument: str,
    fourth_argument: str,
    fifth_argument: str
) -> str

function(
    very_long_argument_name,
    another_very_long_name,
    other_function().method().attribute ,
    fourth_argument, fifth_argument
)
```

### Initializing lists, dicts and sets

Where possible, initialize on a single line. When the elements don't fit on a single line, write each on it's own line. Prefer assigning in a single statement to creating an empty dict and individually assigning to fields.

```python
my_dict = {'key1': value1, 'key2': value2}
my_list = [
    very_long_element_name1,
    very_long_element_name2,
    very_long_element_name3,
    very_long_element_name4,
    very_long_element_name5
]
```

## Documentation strings

Use `"""` to delimit docstrings. For single line docstrings, keep the quotes on the same line.

```python
"""A single line docstring"""
```

For multi line docstrings, begin the text on a new line.

```python
"""
This is an example.

Multi-line documentation string
"""
```

In function docstrings, when describing parameters use this syntax:
```python
"""
This is a function.

Arguments:
    :param p1   (str) A string parameter.
    :param p2   (int) An integer parameter.
    :return     (bool) A bool return value
"""
```