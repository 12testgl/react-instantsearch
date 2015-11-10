#!/usr/bin/env bash

set -ev # exit when error

cd docs && bundle install && bundle exec guard -i & npm run dev & wait
