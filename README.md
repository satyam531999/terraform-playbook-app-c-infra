# terraform-playbook-app-c-infra

This repository is the application-owned slice extracted from the original `terraform-aws-prod-lab` monorepo.

## Scope

- `app/`: observable demo application source and container build context
- `environments/dev/`: development stack for the application
- `environments/prod/`: production stack for the application
- `.github/workflows/`: app image and Terraform workflows
- `docs/`: reference material kept out of the active delivery path

## External Repo Dependencies

- `terraform-playbook-modules`: owns reusable Terraform modules
- `terraform-playbook-common-infra`: owns backend bootstrap and other shared infrastructure

The environment stacks in this repo now reference the sibling `terraform-playbook-modules` repository for local parallel validation in this workspace.

## Current Split Status

- The original `terraform-aws-prod-lab` repo remains untouched and operational.
- This repo has been populated as a parallel copy for migration work.
- Backend state keys are intentionally still aligned with the current working setup.
- GitHub Actions has been prepared for standalone multi-repo execution.

## Prerequisites

- Terraform >= 1.6
- AWS CLI configured for the target account
- A checked-out sibling repo at `../terraform-playbook-modules` relative to this repo's parent directory for local runs
- Existing backend resources from `terraform-playbook-common-infra/bootstrap`

## Local Validation Flow

1. Ensure `terraform-playbook-modules`, `terraform-playbook-common-infra`, and `terraform-playbook-app-c-infra` are checked out side by side.
2. Create `backend.hcl` from the example file in the target environment.
3. Run `terraform init -backend-config=backend.hcl` inside `environments/dev` or `environments/prod`.
4. Run `terraform plan` before any apply.

## GitHub Actions Multi-Repo Setup

The workflows in this repo now check out the application repository into `terraform-playbook-app-c-infra/` and the shared modules repository into `terraform-playbook-modules/`. That preserves the relative module paths expected by Terraform.

Required repository configuration:

- Repository variable `TF_MODULES_REPOSITORY`: full repository name for the shared modules repo, for example `satyam531999/terraform-playbook-modules`
- Optional repository variable `TF_MODULES_REF`: branch, tag, or SHA to use for the modules checkout
- Repository secret `CI_REPO_READ_TOKEN`: personal access token or GitHub App token that can read the modules repo when it is private

If the modules repo is public and accessible through the default workflow token, `CI_REPO_READ_TOKEN` can be omitted.

## GitHub Publish Steps

After creating the remote repository, publish this repo with:

```bash
git remote add origin git@github-personal:satyam531999/terraform-playbook-app-c-infra.git
git add .
git commit -m "Initialize terraform-playbook-app-c-infra repository"
git push -u origin main
```

## Module Source Cutover

The environment stacks now use Git-based module sources pointed at the shared modules repository.

Current bootstrap source pattern:

```hcl
source = "git::ssh://git@github-personal/satyam531999/terraform-playbook-modules.git//modules/ecs_service?ref=v0.1.0"
```

Recommended follow-up after the first tagged release:

```hcl
source = "git::ssh://git@github-personal/satyam531999/terraform-playbook-modules.git//modules/ecs_service?ref=v0.1.0"
```

Make that change only after:

1. the modules repo has been pushed
2. a stable tag exists
3. GitHub Actions variables and access tokens are configured

## Application Delivery Flow

- `.github/workflows/app-image.yml` builds and publishes the app image, then deploys `dev`.
- `.github/workflows/terraform.yml` handles Terraform validation and manual environment operations.
- `prod` remains intended for controlled promotion.
- Workflow artifact paths are now aligned with the standalone checkout layout used in CI.

## Reference Notes

- Spinnaker reference material is preserved under `docs/` only.
- Active deployment today is GitHub Actions plus Terraform.
- See `docs/github-actions-checklist.md` for required repository variables and secrets.
- See `docs/dev-recreation-plan.md` for the safe `dev` rebuild sequence from this split repo.
