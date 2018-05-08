# japan-political-party-funding
[![Build Status](https://travis-ci.org/atsuya/japan-political-party-funding.svg?branch=master)](https://travis-ci.org/atsuya/japan-political-party-funding)

This project parses documents publicly available from Japanese Government with regards to political party funding.

# How to run

```
$ node pdf2json.js test/resources/h28-report-1.pdf
```

# Sample Result

This is a [result](https://raw.githubusercontent.com/atsuya/japan-political-party-funding/master/samples/h28-political-party.json) of `pdf2json` for H28 report. Note that it only outputs political party sections at the moment (support for other sections to come later).