# Code Style Guide for the YANG Catalog Project

For matters which aren't mentioned in this file, refer to [PEP8](https://peps.python.org/pep-0008/).

## Linting tools
To check linting we are using: [flake8](https://flake8.pycqa.org/en/latest/), [black](https://black.readthedocs.io/en/stable/), [isort](https://pycqa.github.io/isort/), and [pre-commit](https://pre-commit.com/).
Corresponding configurations are added to the [backend](https://github.com/YangCatalog/backend), [module-compilation](https://github.com/YangCatalog/module-compilation), and [yang-validator-extractor](https://github.com/YangCatalog/yang-validator-extractor) repositories for now.

**Useful notes for flake8** (Other configuration details for every tool can be found in documentations):

- If there's a flake8 error for the exact line, but this line needs to stay as it is - just simply add ```# noqa``` comment at the end of this line, and it will disable flake8 for this line. It's also possible to indicate some specific errors in this comment, for example, ```# noqa: F401, F405``` will only disable ```F401``` and ```F405``` errors for this line but will still check this line for other errors.
- If you are using [per-file-ignores](https://flake8.pycqa.org/en/latest/user/options.html#cmdoption-flake8-per-file-ignores) and run ```flake8 dir_name --config=./dir_name/.flake8```  from the ```development``` directory, then these ```per-file-ignores``` will not work , but running it from the ```dir_name``` directory will enable per-file-ignores correctly. So, if you want to run flake8 from the development directory to see all the navigation urls but don't want to see the navigation urls to these ignored files, then you have to add ```*/``` at the beginning of every path in ```per-file-ignores```, so ```actual/path/to/ignore.py``` will become ```*/actual/path/to/ignore.py``` (don't forget to change it back after).

**There is a guide to enable tools locally** (The ```backend``` repository is used in this example, but all the steps can be used in every other repository listed above):

**Required steps:**<br>
Go to the ```backend``` directory and run the following commands
```
pip install pre-commit
pre-commit install
pre-commit autoupdate
```
It will enable the pre-commit hook, so all your future commits will automatically be reformatted by isort and black, and also they will be checked by flake8. If you don't do it, then all the errors found by any of these tools will break your GitHub Actions, and you'll be forced to fix them anyway.

**Recommended steps:**<br>
It's convenient to be able to run any of these tools locally, so I recommend to install all other dependencies as well. In the ```backend``` directory: ```pip install -r lint_requirements.txt```, in the ```deployment``` directory: ```pip install -r backend/lint_requirements.txt```, and now you'll be able to run all the tools locally:
- ```flake8```: In the ```backend``` directory: ```flake8 .```, from the ```deployment``` directory: ```flake8 backend --config=./backend/.flake8```. If you aren't using a separate directory for the forked ```backend``` repo, then it's recommended to run this command from the ```development``` repo to see the navigation urls to all errors identified by ```flake8```, otherwise you will only see paths to broken lines, and need to find these lines yourself
- ```black```: In the ```backend``` directory: ```black .```, from the ```deployment``` directory: ```black backend```
- ```isort```: In the ```backend``` directory: ```isort .```, from the ```deployment``` directory: ```isort backend```
- ```pre-commit```: In the ```backend``` directory: ```pre-commit```. FYI: this command analyses only the files already added to Git using the ```git add``` command

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

When the arguments for a function signature or a function call do not fit on a single line, pass each argument on its own line:

```python
def function(
    first_argument: str,
    second_argument: str,
    third_argument: str,
    fourth_argument: str,
    fifth_argument: str,
) -> str:
    pass

function(
    very_long_argument_name,
    another_very_long_name,
    other_function().method().attribute ,
    fourth_argument,
    fifth_argument,
)
```

### Initializing lists, dicts and sets

Where possible, initialize on a single line. When the elements don't fit on a single line, write each on its own line. Prefer assigning in a single statement to creating an empty dict and individually assigning to fields.

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