# japan-political-party-funding
[![Build Status](https://travis-ci.org/atsuya/japan-political-party-funding.svg?branch=master)](https://travis-ci.org/atsuya/japan-political-party-funding)

This project parses documents publicly available from Japanese Government with regards to political party funding.

# How to run

```
$ $(yarn bin)/textract <file path> > extracted.txt
$ node parse.js extracted.txt parsed.json
```