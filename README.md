# pr-name
Performs an action if the PR name does not conform with the standard


# config 

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
