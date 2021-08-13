# pr-name

Performs an action if a PR name check fails.

The action so far is limited to either posting a comment or adding a label.

The current checks are limited to prefixes in the PR title.
# Usage 

```yaml
name: PR name check 

on:
  pull_request:
    # Only following types are handled by the action, but one can default to all as well
    types: [opened, reopened, edited, synchronize]

jobs:
  check_pr_name:
    runs-on: ubuntu-latest
    steps:
      - uses: juanecabellob/pr-name@v1.1.9
        name: PR name checker
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          action_type: both
          comment: |
              Hi, this PR title doesn't conform with our guidelines. Could you name your PR's in the front repo adhering to our current standard?
          configuration-path: .github/pr-name-check-and-run-config.yaml
          label: needs formatting
          skip_ci: false

```

# Configuration

| Variable or Argument    | Location | Description                                                                                                                 | Required | Default |
|--------------------------|------------------|----------------|-------------|
| action_type | with | Determines what kind of action(s) should run. One of: comment, label or both | yes | comment |
| comment | with | Message to post as a comment | yes | `Your PR name does not conform with our standards. Please read in the Contributing Guidelines about this.` |
| label | with | Label title to use in case the PR name does not conform with the standard | yes | `PR title needs formatting` |
| skip_ci | with | Skips failing CI check in case something goes wrong | no | `false` |
| configuration-path | with | Specifies where to find the configuration file | yes | `.github/pr-name-check-and-run-config.yaml` |
| pr_name_check | config file | Contains the checks to be run | yes | `prefixes: []` |
| ignore_on_labels | config file | Determines the labels that mark whether a PR should be ignored | no | `[]` |
# Config file example 

```yaml
pr_name_check:
  prefixes:
    - "chore:"
    - "infra:"
    - "developer:"
    - "dev:"
    - "fix:"
    - "hotfix:"
    - "bugfix:"
    - "update:"
    - "change:"
    - "edit:"
    - "feat:"
    - "feature:"
    - "enhancement:"
ignore_on_labels:
  - "do-not-check"
```
