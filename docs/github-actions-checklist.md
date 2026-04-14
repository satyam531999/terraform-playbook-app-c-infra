# GitHub Actions Checklist

Use this checklist before running workflows in `terraform-playbook-app-c-infra`.

## Repository Variables

- `TF_MODULES_REPOSITORY`: `satyam531999/terraform-playbook-modules`
- `TF_MODULES_REF`: `v0.1.0`

## Repository Secrets

- `AWS_ROLE_TO_ASSUME`: IAM role ARN trusted by GitHub OIDC
- `AWS_REGION`: `us-east-1`
- `TF_STATE_BUCKET`: `tfstate-140023367958-prodlab-20260409`
- `TF_LOCK_TABLE`: `terraform-state-locks`

## Optional Secret

- `CI_REPO_READ_TOKEN`: only required if the modules repo cannot be read with the default workflow token
- `DYNATRACE_API_TOKEN`: Dynatrace API token used as `TF_VAR_dynatrace_api_token` during Terraform plan/apply/destroy

## Recommended GitHub Environments

Create these GitHub environments in the app repo:

- `dev`
- `prod`

Recommended controls:

- keep `dev` open for fast iteration
- require reviewers for `prod`

## First Workflow Runs

Run in this order:

1. `Terraform CI CD` with `action=plan`, `target_env=dev`
2. `App Image CI` on a branch push or `workflow_dispatch`
3. `Terraform CI CD` with `action=plan`, `target_env=prod`

## Expected Behavior

- the Terraform workflow checks out `terraform-playbook-modules` at `v0.1.0`
- the app workflow builds and pushes `observable-demo-app`
- the app workflow deploys only `dev`
- `prod` stays under manual control