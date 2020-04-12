# Nova CLI

## A CLI for Nova: A Node Compilng Helper

## Commands

```
Usage: $ nova <cmd> [opt]
```

#### scss

Compile and prefix .scss files in `./files/src/styles` to .css files. If `-p` is added, files will be minified as well.

```
Usage: $ nova scss|s [options]

Compile .scss files

Options:
  -d, --dev   Run in dev mode.
  -p, --pro   Run in pro mode.
  -H, --help  Display help for command
```

#### prettify

Prettify all files in `./files/src` with `-a` flag, or specific file types with their specific flags.

```
Usage: $ nova prettify|p [options]

Prettify files in directory

Options:
  -h, --html  Add .html files
  -s, --scss  Add .scss files
  -j, --js    Add .js files
  -a, --all   Add all files
  -H, --help  Display help for command
```

# Releases

#### v1.0.0 | SCSS Features Complete

8 April, 2020

#### v2.0.0 | Prettify Features Complete

12 April, 2020
