#!/bin/bash

# Loop through each commit message
while read -r line; do
    # Check if the commit message follows Conventional Commits pattern
    if ! echo "$line" | grep -qE "^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .+"; then
        echo "ERROR: Commit message '$line' does not follow Conventional Commits pattern."
        exit 1
    fi
done < <(git log --pretty=format:"%s")

echo "All commits follow Conventional Commits pattern."
exit 0
